'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { useShallow } from 'zustand/react/shallow';
import type { Bookmark } from '@/types';
import Card from '@/components/ui/Card';

export default function LiveInsightsSidebar() {
  const { transcriptChunks, bookmarks, isRecording, largeText, removeBookmark } = useAppStore(
    useShallow((s) => ({
      transcriptChunks: s.transcriptChunks,
      bookmarks: s.bookmarks,
      isRecording: s.isRecording,
      largeText: s.largeText,
      removeBookmark: s.removeBookmark,
    }))
  );

  const finalChunks = useMemo(
    () => transcriptChunks.filter((c) => c.isFinal),
    [transcriptChunks]
  );

  const stats = useMemo(() => {
    const fullText = finalChunks.map((c) => c.text).join(' ');
    const words = fullText.split(/\s+/).filter(Boolean).length;
    const sentences = fullText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    const questionPattern = /\b(?:who|what|when|where|why|how|can|could|would|should|is|are|do|does|did|will|shall|may|might)\b[^.!]*\?/gi;
    const questionMatches = fullText.match(questionPattern);
    const questions = questionMatches?.length ?? 0;

    const datePattern = /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}|\d{1,2}:\d{2}|tomorrow|next\s+week|due\s+date|deadline)\b/gi;
    const dateMatches = fullText.match(datePattern);
    const dateRefs = dateMatches ? new Set(dateMatches.map((d) => d.toLowerCase())).size : 0;

    return { words, sentences, questions, dateRefs, chunks: finalChunks.length };
  }, [finalChunks]);

  const textSize = largeText ? 'text-base' : 'text-sm';

  return (
    <aside className="space-y-4" aria-label="Session insights">
      <Card variant="bordered" padding="sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Live Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Words', value: stats.words, color: 'text-blue-600' },
            { label: 'Segments', value: stats.chunks, color: 'text-gray-600' },
            { label: 'Questions', value: stats.questions, color: 'text-purple-600' },
            { label: 'Date refs', value: stats.dateRefs, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className={`text-lg font-semibold ${color} tabular-nums`}>{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {bookmarks.length > 0 && (
        <Card variant="bordered" padding="sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Bookmarks ({bookmarks.length})
          </h3>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto">
            {bookmarks.map((b: Bookmark) => (
              <li
                key={b.id}
                className={`flex items-center justify-between gap-2 ${textSize}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="text-gray-700 truncate">{b.label}</span>
                </div>
                <button
                  onClick={() => removeBookmark(b.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label={`Remove bookmark: ${b.label}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {isRecording && (
        <Card variant="default" padding="sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Tips
          </h3>
          <ul className={`space-y-1 text-gray-500 ${textSize}`}>
            <li>Speak clearly at a moderate pace</li>
            <li>Bookmark important moments</li>
            <li>Tap a highlighted line for details</li>
          </ul>
        </Card>
      )}
    </aside>
  );
}
