'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import type { LineAnnotation, HighlightCategory } from '@/types';

const RECENT_CONTEXT_LINES = 4;
const MIN_LENGTH_TO_CLASSIFY = 4;

interface ClassifyApiResponse {
  category: HighlightCategory;
  label: string;
  explanation: string;
  isTopicShift: boolean;
  topicLabel?: string;
}

/**
 * Layered hook: subscribes to transcript chunks and asks the existing
 * AI pipeline to classify each new finalized line. Results land in the
 * store as LineAnnotation entries keyed by chunkId. Pure side-effect —
 * does not modify or rebuild any existing transcript logic.
 */
export function useLineClassifier(enabled: boolean) {
  const inFlightRef = useRef<Set<string>>(new Set());
  const lastTopicRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.transcriptChunks === prev.transcriptChunks) return;

      const finals = state.transcriptChunks.filter((c) => c.isFinal);
      const annotations = state.lineAnnotations;

      for (let i = 0; i < finals.length; i++) {
        const chunk = finals[i];
        if (annotations[chunk.id]) continue;
        if (inFlightRef.current.has(chunk.id)) continue;
        if (chunk.text.trim().length < MIN_LENGTH_TO_CLASSIFY) continue;

        inFlightRef.current.add(chunk.id);

        const recent = finals
          .slice(Math.max(0, i - RECENT_CONTEXT_LINES), i)
          .map((c) => c.text)
          .join(' \n');

        classifyLine(chunk.text, recent, lastTopicRef.current)
          .then((res) => {
            const annotation: LineAnnotation = {
              chunkId: chunk.id,
              category: res.category,
              label: res.label,
              explanation: res.explanation,
              isTopicShift: res.isTopicShift,
              topicLabel: res.topicLabel,
            };
            useAppStore.getState().setLineAnnotation(annotation);
            if (res.isTopicShift && res.topicLabel) {
              lastTopicRef.current = res.topicLabel;
            }
          })
          .catch(() => {
            // Silent fail; classification is best-effort.
          })
          .finally(() => {
            inFlightRef.current.delete(chunk.id);
          });
      }
    });

    return () => {
      unsub();
    };
  }, [enabled]);

  // Reset topic memory when recording stops + restarts (new session).
  useEffect(() => {
    if (!enabled) return;
    const unsub = useAppStore.subscribe((state, prev) => {
      if (prev.isRecording && !state.isRecording) {
        // session ended; keep topic until a new one starts
      }
      if (!prev.isRecording && state.isRecording) {
        lastTopicRef.current = null;
        inFlightRef.current.clear();
      }
    });
    return () => unsub();
  }, [enabled]);
}

async function classifyLine(
  text: string,
  recentContext: string,
  lastTopic: string | null
): Promise<ClassifyApiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('/api/classify-line', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, recentContext, lastTopic }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as ClassifyApiResponse;
    return {
      category: data.category ?? 'general',
      label: data.label ?? '',
      explanation: data.explanation ?? '',
      isTopicShift: !!data.isTopicShift,
      topicLabel: data.topicLabel,
    };
  } finally {
    clearTimeout(timeout);
  }
}
