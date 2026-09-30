'use client';

import { useEffect, useRef } from 'react';
import { HIGHLIGHT_STYLES } from '@/lib/ai/highlight-styles';
import type { LineAnnotation, TranscriptChunk } from '@/types';

interface LineDetailPopoverProps {
  chunk: TranscriptChunk;
  annotation: LineAnnotation;
  onClose: () => void;
  anchorRect?: DOMRect | null;
}

/**
 * Lightweight floating panel showing why a line was flagged.
 * Positioned near the clicked line; does not block interaction with the
 * underlying transcript.
 */
export default function LineDetailPopover({
  chunk,
  annotation,
  onClose,
  anchorRect,
}: LineDetailPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const style = HIGHLIGHT_STYLES[annotation.category];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Position: prefer just below the clicked line, fallback centered.
  const top =
    anchorRect && typeof window !== 'undefined'
      ? Math.min(
          anchorRect.bottom + window.scrollY + 6,
          window.scrollY + window.innerHeight - 220
        )
      : undefined;
  const left =
    anchorRect && typeof window !== 'undefined'
      ? Math.min(
          Math.max(anchorRect.left + window.scrollX, 12),
          window.scrollX + window.innerWidth - 360
        )
      : undefined;

  const positioned = top !== undefined && left !== undefined;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`Why this line was flagged as ${style.displayName}`}
      className={[
        'z-50 w-[340px] max-w-[calc(100vw-24px)] rounded-xl shadow-xl border bg-white',
        'p-3.5',
        positioned ? 'absolute' : 'fixed left-1/2 top-1/3 -translate-x-1/2',
      ].join(' ')}
      style={positioned ? { top, left } : undefined}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${style.tagBg} ${style.tagText} border ${style.border}`}
        >
          {annotation.label || style.defaultLabel || style.displayName}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close detail"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-2 italic border-l-2 border-gray-200 pl-2">
        “{chunk.text}”
      </p>

      <p className="text-sm text-gray-700 leading-relaxed">
        {annotation.explanation ||
          `Flagged as ${style.displayName.toLowerCase()} based on tone and content of the spoken line.`}
      </p>

      {annotation.isTopicShift && annotation.topicLabel && (
        <p className="mt-2 text-xs text-indigo-600 font-medium">
          Topic shift detected → {annotation.topicLabel}
        </p>
      )}
    </div>
  );
}
