'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
// OLD (Web Speech API engine — kept here until the new engine is confirmed working):
// import {
//   startSpeechRecognition,
//   stopSpeechRecognition,
//   isSpeechRecognitionSupported,
// } from '@/lib/speech/web-speech';
import {
  connect as connectTranscription,
  disconnect as disconnectTranscription,
  isTranscriptionSupported,
} from '@/lib/speech/assemblyai-speech';
import MicButton from '@/components/session/MicButton';
import LiveTranscript from '@/components/session/LiveTranscript';
import SessionTimer from '@/components/session/SessionTimer';
import LiveInsightsSidebar from '@/components/session/LiveInsightsSidebar';
import HighlightFilterBar from '@/components/session/HighlightFilterBar';
// Disabled: import ContextPanel from '@/components/session/ContextPanel';
import Button from '@/components/ui/Button';
import { DEMO_RESULTS } from '@/lib/demo-data';
import { useLineClassifier } from '@/lib/ai/use-line-classifier';

export default function SessionPage() {
  const router = useRouter();
  const {
    accessibilityMode,
    largeText,
    isRecording,
    sessionStartTime,
    setInputType,
    setRawContent,
    setResults,
    setProcessing,
    setError,
    clearSession,
    addTranscriptChunk,
    getFullTranscript,
    addBookmark,
    removeBookmark,
    relabelBookmarks,
    startRecording: storeStartRecording,
    stopRecording: storeStopRecording,
    transcriptChunks,
  } = useAppStore();

  const [interimText, setInterimText] = useState('');
  const [speechError, setSpeechError] = useState('');
  const [isProcessing, setIsProcessingLocal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMicHint, setShowMicHint] = useState(true);
  const chunkCounterRef = useRef(0);

  // OLD: const supported = isSpeechRecognitionSupported();
  // Defer the support check to after mount so SSR and the first client render
  // agree (hydration-safe). `isTranscriptionSupported()` reads `window` and
  // would otherwise differ between server and client.
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(isTranscriptionSupported());
  }, []);

  // Layered: classifies each new finalized line via the existing AI pipeline
  // and writes annotations into the store. No effect on transcript capture.
  useLineClassifier(true);

  const hasTranscript = transcriptChunks.some((c) => c.isFinal);

  const handleStart = useCallback(() => {
    if (!supported) return;
    setSpeechError('');
    setShowMicHint(false);
    storeStartRecording();
    chunkCounterRef.current = 0;

    // OLD (Web Speech API engine — kept for reference until new engine is confirmed working):
    // startSpeechRecognition(...)

    void connectTranscription({
      onTranscript: (transcript, isFinal, timestamp) => {
        if (isFinal) {
          chunkCounterRef.current += 1;
          addTranscriptChunk({
            id: `chunk-${timestamp}-${chunkCounterRef.current}`,
            text: transcript.trim(),
            timestamp,
            isFinal: true,
          });
          setInterimText('');
        } else {
          setInterimText(transcript);
        }
      },
      onError: (error) => {
        setSpeechError(error);
        storeStopRecording();
      },
      onClose: () => {
        setInterimText('');
      },
    });
  }, [supported, storeStartRecording, addTranscriptChunk, storeStopRecording]);

  const handleStop = useCallback(() => {
    // OLD: stopSpeechRecognition();
    void disconnectTranscription();
    storeStopRecording();
    setInterimText('');
  }, [storeStopRecording]);

  const handleProcess = useCallback(async () => {
    const text = getFullTranscript();
    if (!text) {
      setSpeechError('No transcript to process. Record some speech first.');
      return;
    }

    setIsProcessingLocal(true);
    setProcessing(true);
    setInputType('live');
    setRawContent(text);

    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: accessibilityMode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Processing failed');
      }

      setResults(data.results);
      router.push('/results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process transcript';
      setError(message);
      setSpeechError(message);
    } finally {
      setIsProcessingLocal(false);
      setProcessing(false);
    }
  }, [accessibilityMode, router, setError, setInputType, setProcessing, setRawContent, setResults, getFullTranscript]);

  const handleClear = useCallback(() => {
    clearSession();
    setInterimText('');
    setSpeechError('');
  }, [clearSession]);

  const handleLoadDemo = useCallback(() => {
    setInputType('live');
    setRawContent(DEMO_RESULTS.originalText);
    setResults(DEMO_RESULTS);
    router.push('/results');
  }, [router, setInputType, setRawContent, setResults]);

  const handleBookmark = useCallback(() => {
    const chunks = useAppStore.getState().transcriptChunks.filter((c) => c.isFinal);
    const lastChunk = chunks[chunks.length - 1];
    if (!lastChunk) return;

    const alreadyBookmarked = useAppStore.getState().bookmarks.some((b) => b.chunkId === lastChunk.id);
    if (alreadyBookmarked) return;

    addBookmark({
      id: `bm-${Date.now()}`,
      chunkId: lastChunk.id,
      timestamp: Date.now(),
      label: '',
    });
    relabelBookmarks();
  }, [addBookmark, relabelBookmarks]);

  const handleBookmarkLine = useCallback((chunkId: string) => {
    const alreadyBookmarked = useAppStore.getState().bookmarks.some((b) => b.chunkId === chunkId);
    if (alreadyBookmarked) return;

    addBookmark({
      id: `bm-${Date.now()}`,
      chunkId,
      timestamp: Date.now(),
      label: '',
    });
    relabelBookmarks();
  }, [addBookmark, relabelBookmarks]);

  const handleRemoveBookmarkLine = useCallback((bookmarkId: string) => {
    removeBookmark(bookmarkId);
    relabelBookmarks();
  }, [removeBookmark, relabelBookmarks]);

  return (
    <div className="session-body bg-gray-50 h-[calc(100vh-4rem)] flex flex-col text-gray-900 overflow-hidden">
      {/* Top toolbar — compact, sits flush under global header */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className={`text-gray-900 font-semibold ${largeText ? 'text-lg' : 'text-base'}`}>
            Live Session
          </h1>
          <SessionTimer
            startTime={sessionStartTime}
            isRecording={isRecording}
            className="text-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <MicButton
              isRecording={isRecording}
              onStart={handleStart}
              onStop={handleStop}
              disabled={isProcessing}
              compact
            />
            {showMicHint && (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-full mr-3 flex flex-row items-center gap-1.5 pointer-events-none z-50"
                aria-hidden="true"
              >
                <span className="bg-blue-500 text-white text-xs font-medium rounded-md px-2.5 py-1 whitespace-nowrap shadow-lg ring-1 ring-blue-400/40">
                  Click to start session
                </span>
                {/* Left-to-right bouncing arrow */}
                <svg
                  className="w-4 h-4 text-blue-400 animate-bounce-x flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Stats popover */}
          <div className="relative">
            <Button
              variant={showStats ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowStats((v) => !v)}
              className={
                showStats
                  ? ''
                  : 'border-gray-700 text-gray-900 hover:bg-gray-100'
              }
              title="Live session stats"
            >
              Stats
            </Button>
            {showStats && (
              <div className="absolute right-0 top-full mt-2 z-30 w-60 bg-white rounded-xl shadow-xl border border-gray-200 p-3 overflow-y-auto max-h-[80vh] text-gray-900">
                <LiveInsightsSidebar />
              </div>
            )}
          </div>
        </div>
      </div>

      {!supported && (
        <div className="mx-6 mt-2 p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 flex-shrink-0">
          <p className="font-medium mb-1">Speech recognition not available</p>
          <p className="text-sm">
            Live mic requires Chrome. You can{' '}
            <button onClick={handleLoadDemo} className="underline font-medium">
              load a demo
            </button>.
          </p>
        </div>
      )}

      {speechError && (
        <p
          role="alert"
          className="mx-6 mt-2 text-red-600 text-sm flex-shrink-0"
        >
          {speechError}
        </p>
      )}

      {/* Highlight filter bar */}
      <div className="px-6 pt-2.5 pb-2 flex-shrink-0">
        <HighlightFilterBar largeText={largeText} />
      </div>

      {/* Main transcript area — fills available space */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pb-3 min-h-0">
        <LiveTranscript
          isRecording={isRecording}
          interimText={interimText}
          onBookmark={handleBookmark}
          onBookmarkLine={handleBookmarkLine}
          onRemoveBookmarkLine={handleRemoveBookmarkLine}
        />
      </div>

      {/* Footer with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 border-t border-gray-200 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isRecording || isProcessing}
            className="border-gray-700 text-gray-900 hover:bg-gray-100 disabled:text-gray-400"
            aria-label="Clear transcript"
          >
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadDemo}
            aria-label="Load demo results"
            className="border-gray-700 text-gray-900 hover:bg-gray-100"
          >
            Load Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            disabled={!isRecording || !hasTranscript}
            className="border-gray-700 text-gray-900 hover:text-amber-600 hover:bg-gray-100 hover:border-amber-500 disabled:text-gray-400"
            aria-label="Bookmark this moment"
          >
            Bookmark
          </Button>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleProcess}
          loading={isProcessing}
          disabled={isRecording || !hasTranscript || isProcessing}
          className="disabled:opacity-60 disabled:bg-blue-500"
          aria-label="Process transcript"
        >
          Process Session
        </Button>
      </div>
    </div>
  );
}
