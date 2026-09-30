'use client';

import { StreamingTranscriber } from 'assemblyai';
import type { TurnEvent } from 'assemblyai';

// ---------------------------------------------------------------------------
// AssemblyAI live transcription service (Universal-Streaming).
//
// This module owns every piece of the live capture pipeline:
//   1. getUserMedia -> MediaStream
//   2. AudioContext + AudioWorklet (pcm-resample-processor) -> 16 kHz PCM16
//   3. StreamingTranscriber WebSocket -> partial + final transcripts
//
// It exposes the same conceptual contract the rest of the app already uses:
// a single `onTranscript(text, isFinal, timestamp)` callback, plus error and
// close callbacks. The driver (app/session/page.tsx) only needs to call
// `connect(...)` and `disconnect()`.
//
// The AssemblyAI API key is NEVER imported here. Authentication happens via
// a short-lived token fetched from the server route /api/assemblyai-token.
// ---------------------------------------------------------------------------

export type TranscriptCallback = (
  transcript: string,
  isFinal: boolean,
  timestamp: number
) => void;
export type ErrorCallback = (error: string) => void;
export type CloseCallback = () => void;

export interface ConnectOptions {
  onTranscript: TranscriptCallback;
  onError: ErrorCallback;
  onClose: CloseCallback;
}

const TARGET_SAMPLE_RATE = 16000;
const WORKLET_URL = '/pcm-worklet.js';
const WORKLET_NAME = 'pcm-resample-processor';
const TOKEN_ENDPOINT = '/api/assemblyai-token';
// Matches AssemblyAI's official Universal-Streaming quickstart:
//   wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&speech_model=u3-rt-pro
const SPEECH_MODEL = 'u3-rt-pro';

// AssemblyAI Universal-Streaming requires each audio message to represent
// between 50 ms and 1000 ms of audio. We target 100 ms. The worklet already
// posts 100 ms frames; this main-thread accumulator is a belt-and-braces
// guard in case the worklet ever produces something shorter (e.g. a future
// implementation change or teardown tail).
const MIN_CHUNK_MS = 50;
const TARGET_CHUNK_MS = 100;
const BYTES_PER_SAMPLE = 2; // 16-bit PCM
const MIN_CHUNK_BYTES = (TARGET_SAMPLE_RATE * MIN_CHUNK_MS) / 1000 * BYTES_PER_SAMPLE; // 1600
const TARGET_CHUNK_BYTES = (TARGET_SAMPLE_RATE * TARGET_CHUNK_MS) / 1000 * BYTES_PER_SAMPLE; // 3200

const DEBUG_AUDIO_CHUNKS = false; // toggle chunk-duration logging

// Module-level singletons. A single session is active at a time, which
// matches the existing Web Speech behavior.
let transcriber: StreamingTranscriber | null = null;
let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let workletNode: AudioWorkletNode | null = null;
let isActive = false;

// Defensive main-thread accumulator. Everything the worklet sends is copied
// into here, and we only call sendAudio() once we have at least MIN_CHUNK_BYTES
// (50 ms) worth. Under normal operation the worklet already posts 100 ms
// frames, so this is a single passthrough per message; the accumulator only
// kicks in if something upstream changes.
let pendingPcm: Uint8Array = new Uint8Array(0);

function appendPending(chunk: Uint8Array): void {
  if (pendingPcm.byteLength === 0) {
    pendingPcm = chunk;
    return;
  }
  const merged = new Uint8Array(pendingPcm.byteLength + chunk.byteLength);
  merged.set(pendingPcm, 0);
  merged.set(chunk, pendingPcm.byteLength);
  pendingPcm = merged;
}

function flushPending(): void {
  if (!transcriber || !isActive) return;
  while (pendingPcm.byteLength >= MIN_CHUNK_BYTES) {
    // Take up to TARGET_CHUNK_BYTES at a time so we stay inside the
    // 50–1000 ms window even if a big buffer arrives in one shot.
    const take = Math.min(pendingPcm.byteLength, TARGET_CHUNK_BYTES);
    const slice = pendingPcm.slice(0, take);
    pendingPcm = pendingPcm.slice(take);

    const sampleCount = slice.byteLength / BYTES_PER_SAMPLE;
    const durationMs = (sampleCount / TARGET_SAMPLE_RATE) * 1000;
    if (DEBUG_AUDIO_CHUNKS) {
      console.log(
        `[AssemblyAI] sending chunk: ${durationMs.toFixed(1)} ms ` +
          `(${sampleCount} samples, ${slice.byteLength} bytes)`
      );
    }
    try {
      transcriber.sendAudio(slice.buffer);
    } catch (e) {
      isActive = false;
      if (workletNode) workletNode.port.onmessage = null;
      console.warn('[AssemblyAI] sendAudio threw unexpectedly:', e);
      return;
    }
  }
}

export function isTranscriptionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (!navigator?.mediaDevices?.getUserMedia) return false;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return false;
  if (typeof AudioWorkletNode === 'undefined') return false;
  return true;
}

async function fetchSessionToken(): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, { method: 'POST' });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? 'Failed to obtain AssemblyAI session token.');
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error('AssemblyAI session token was empty.');
  return data.token;
}

export async function connect(options: ConnectOptions): Promise<void> {
  if (isActive) return;

  if (!isTranscriptionSupported()) {
    options.onError(
      'Live transcription is not supported in this browser. Please use a modern Chromium, Firefox, or Safari browser.'
    );
    return;
  }

  isActive = true;
  pendingPcm = new Uint8Array(0);

  try {
    const token = await fetchSessionToken();

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    // Request the AudioContext at 16 kHz. Some browsers ignore this and use
    // the hardware sample rate; the worklet handles resampling either way.
    audioContext = new Ctx({ sampleRate: TARGET_SAMPLE_RATE });

    await audioContext.audioWorklet.addModule(WORKLET_URL);

    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    workletNode = new AudioWorkletNode(audioContext, WORKLET_NAME, {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      processorOptions: { targetSampleRate: TARGET_SAMPLE_RATE },
    });

    transcriber = new StreamingTranscriber({
      token,
      sampleRate: TARGET_SAMPLE_RATE,
      speechModel: SPEECH_MODEL,
      formatTurns: true,
    });

    // Universal-Streaming emits a single `turn` event for both partial and
    // final transcripts. The `end_of_turn` flag distinguishes them. Partials
    // are cumulative for the current turn, so we can pass them through to
    // the interim display; finals are the locked-in text.
    transcriber.on('turn', (event: TurnEvent) => {
      const text = (event?.transcript ?? '').trim();
      if (!text) return;
      const isFinal = Boolean(event?.end_of_turn);
      options.onTranscript(text, isFinal, Date.now());
    });

    transcriber.on('error', (err: Error) => {
      const message = err?.message ?? 'Streaming transcription error.';
      // Stop the worklet immediately so no more audio frames are sent
      // to a socket that is about to close.
      isActive = false;
      if (workletNode) workletNode.port.onmessage = null;
      options.onError(`Transcription error: ${message}`);
      void disconnect();
    });

    transcriber.on('close', (code: number, reason: string) => {
      // Mark the session inactive the moment the socket closes so any
      // in-flight worklet frames are dropped instead of thrown into a
      // dead WebSocket ("Socket is not open for communication").
      isActive = false;
      // Null out the handler immediately — the event queue may still have
      // buffered worklet frames that would otherwise race past the isActive
      // guard before this microtask tick finishes.
      if (workletNode) workletNode.port.onmessage = null;
      if (code !== 1000) {
        console.warn(`[AssemblyAI] WebSocket closed — code: ${code}, reason: ${reason || '(none)'}`);
      }
      options.onClose();
    });

    // Pipe PCM chunks from the worklet through the main-thread accumulator
    // and then into the WebSocket. The worklet already emits ~100 ms frames,
    // but we still run every message through flushPending() so any future
    // size changes can't re-introduce the 8 ms bug.
    workletNode.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
      if (!isActive || !transcriber) return;
      const buffer = event.data;
      if (!buffer || buffer.byteLength === 0) return;
      appendPending(new Uint8Array(buffer));
      flushPending();
    };

    await transcriber.connect();

    // Only wire the mic into the worklet after the WebSocket is open,
    // otherwise the first few frames would be dropped.
    sourceNode.connect(workletNode);
    // Intentionally do NOT connect workletNode to destination — we don't want
    // to play the user's own mic back through their speakers.
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to start transcription.';
    options.onError(message);
    await disconnect();
  }
}

export async function disconnect(): Promise<void> {
  isActive = false;
  pendingPcm = new Uint8Array(0);

  try {
    if (workletNode) {
      workletNode.port.onmessage = null;
      workletNode.disconnect();
    }
  } catch {
    /* ignore teardown errors */
  }

  try {
    if (sourceNode) sourceNode.disconnect();
  } catch {
    /* ignore teardown errors */
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
  }

  if (transcriber) {
    try {
      await transcriber.close();
    } catch {
      /* ignore teardown errors */
    }
  }

  if (audioContext && audioContext.state !== 'closed') {
    try {
      await audioContext.close();
    } catch {
      /* ignore teardown errors */
    }
  }

  workletNode = null;
  sourceNode = null;
  mediaStream = null;
  transcriber = null;
  audioContext = null;
}
