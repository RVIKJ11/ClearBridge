'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { useShallow } from 'zustand/react/shallow';
import type { TranscriptChunk, Bookmark, LineAnnotation } from '@/types';
import { HIGHLIGHT_STYLES } from '@/lib/ai/highlight-styles';
import LineDetailPopover from './LineDetailPopover';

interface LiveTranscriptProps {
  isRecording: boolean;
  interimText: string;
  onBookmark: () => void;
  onBookmarkLine?: (chunkId: string) => void;
  onRemoveBookmarkLine?: (bookmarkId: string) => void;
  searchQuery?: string;
}

function highlightSearch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-300 text-gray-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function LiveTranscript({
  isRecording,
  interimText,
  onBookmark,
  onBookmarkLine,
  onRemoveBookmarkLine,
  searchQuery = '',
}: LiveTranscriptProps) {
  const {
    largeText,
    transcriptChunks,
    bookmarks,
    lineAnnotations,
    enabledHighlightCategories,
    highlightingEnabled,
  } = useAppStore(
    useShallow((s) => ({
      largeText: s.largeText,
      transcriptChunks: s.transcriptChunks,
      bookmarks: s.bookmarks,
      lineAnnotations: s.lineAnnotations,
      enabledHighlightCategories: s.enabledHighlightCategories,
      highlightingEnabled: s.highlightingEnabled,
    }))
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const [showJumpBtn, setShowJumpBtn] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [openDetail, setOpenDetail] = useState<{
    chunk: TranscriptChunk;
    annotation: LineAnnotation;
    rect: DOMRect | null;
  } | null>(null);

  const activeSearch = searchQuery || localSearch;

  const finalChunks = useMemo(
    () => transcriptChunks.filter((c) => c.isFinal),
    [transcriptChunks]
  );

  const wordCount = useMemo(
    () =>
      finalChunks
        .map((c) => c.text)
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length,
    [finalChunks]
  );

  const chunkBookmarks = useMemo(() => {
    const map = new Map<string, Bookmark[]>();
    for (const b of bookmarks) {
      const existing = map.get(b.chunkId) || [];
      existing.push(b);
      map.set(b.chunkId, existing);
    }
    return map;
  }, [bookmarks]);

  const activeChunkId = finalChunks[finalChunks.length - 1]?.id ?? null;

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distFromBottom < 80;
    autoScrollRef.current = atBottom;
    setShowJumpBtn(!atBottom);
  }

  function handleJumpToBottom() {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    autoScrollRef.current = true;
    setShowJumpBtn(false);
  }

  // Smooth-scroll to the newly finalized line when a turn completes (infrequent).
  useEffect(() => {
    if (!autoScrollRef.current) return;
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [finalChunks]);

  // Keep interim text visible with an instant scroll so rapid partial updates
  // don't queue up competing smooth-scroll animations.
  useEffect(() => {
    if (!autoScrollRef.current) return;
    if (interimText) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    }
  }, [interimText]);

  const isEmpty = finalChunks.length === 0 && !interimText;
  const textSize = largeText
    ? 'text-2xl leading-loose'
    : 'text-xl leading-relaxed';

  function handleLineClick(
    chunk: TranscriptChunk,
    annotation: LineAnnotation | undefined,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (!annotation || annotation.category === 'general') return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setOpenDetail({ chunk, annotation, rect });
  }

  return (
    <section
      aria-label="Live transcript"
      aria-live="polite"
      aria-atomic="false"
      className="flex-1 flex flex-col min-h-0 relative"
    >
      <div className="flex items-center justify-between mb-2 gap-2 flex-shrink-0">
        <h2
          className={`font-medium text-gray-900 tracking-wide ${
            largeText ? 'text-base' : 'text-sm'
          }`}
        >
          Live Captions
        </h2>
        <div className="flex items-center gap-2">
          {wordCount > 0 && (
            <span className="text-xs tabular-nums text-gray-500">
              {wordCount} words
            </span>
          )}
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="p-1 transition-colors rounded text-gray-400 hover:text-gray-700"
            aria-label="Search transcript"
            title="Search transcript"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            onClick={onBookmark}
            disabled={!isRecording || finalChunks.length === 0}
            className="p-1 text-gray-400 hover:text-amber-500 transition-colors rounded disabled:opacity-30"
            aria-label="Bookmark this moment"
            title="Bookmark this moment"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-2 flex-shrink-0">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search transcript..."
            className="w-full px-3 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            autoFocus
          />
        </div>
      )}

      <div
        id="live-transcript-scroll"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll p-1 relative"
      >
        {isEmpty && !isRecording && (
          <p className="text-gray-500 text-center mt-8">
            Transcript appears here when you start recording
          </p>
        )}

        {isEmpty && isRecording && (
          <p className="text-gray-500 text-center mt-8 flex items-center justify-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"
              aria-hidden="true"
            />
            Listening...
          </p>
        )}

        <div className="space-y-1">
          {finalChunks.map((chunk: TranscriptChunk) => {
            const bmarks = chunkBookmarks.get(chunk.id);
            const annotation = lineAnnotations[chunk.id];
            const showHighlight =
              highlightingEnabled &&
              annotation &&
              annotation.category !== 'general' &&
              enabledHighlightCategories.includes(annotation.category);
            const style = annotation
              ? HIGHLIGHT_STYLES[annotation.category]
              : null;
            const isActive = chunk.id === activeChunkId;
            const interactive = !!showHighlight;
            const showTopicDivider =
              highlightingEnabled && annotation?.isTopicShift;

            return (
              <div key={chunk.id}>
                {showTopicDivider && (
                  <div
                    className="topic-shift-divider"
                    aria-label={`Topic shift to ${annotation.topicLabel ?? 'new topic'}`}
                  >
                    <span>
                      Topic Shift
                      {annotation.topicLabel
                        ? ` · ${annotation.topicLabel}`
                        : ''}
                    </span>
                  </div>
                )}

                <div
                  ref={isActive ? activeLineRef : undefined}
                  className={[
                    'group rounded-md px-2 py-1 transition-colors highlight-bg flex items-start gap-1',
                    showHighlight && style ? style.bg : '',
                    showHighlight && style && style.border
                      ? `border-l-2 ${style.border}`
                      : 'border-l-2 border-transparent',
                    interactive ? 'cursor-pointer hover:brightness-110' : '',
                  ].join(' ')}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onClick={(e) =>
                    interactive ? handleLineClick(chunk, annotation, e) : undefined
                  }
                  onKeyDown={(e) => {
                    if (!interactive) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      setOpenDetail({ chunk, annotation: annotation!, rect });
                    }
                  }}
                  aria-label={
                    showHighlight && annotation
                      ? `${HIGHLIGHT_STYLES[annotation.category].displayName}: ${chunk.text}. Click for explanation.`
                      : undefined
                  }
                >
                  <div className="flex-1 min-w-0">
                    {bmarks?.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-1 mb-0.5"
                      >
                        <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-xs text-amber-300 font-medium">
                          {b.label}
                        </span>
                      </div>
                    ))}
                    <span className={`text-gray-900 ${textSize} inline`}>
                      {highlightSearch(chunk.text, activeSearch)}{' '}
                      {showHighlight && style && (
                        <span
                          className={[
                            'transcript-annotation-tag inline-flex items-center align-middle',
                            'ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide',
                            style.tagBg,
                            style.tagText,
                          ].join(' ')}
                          title={style.displayName}
                          aria-hidden="true"
                        >
                          {annotation.label || style.defaultLabel}
                        </span>
                      )}
                    </span>
                  </div>
                  {!isRecording && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (bmarks?.length) {
                          onRemoveBookmarkLine?.(bmarks[0].id);
                        } else {
                          onBookmarkLine?.(chunk.id);
                        }
                      }}
                      className={[
                        'flex-shrink-0 mt-1 p-0.5 rounded transition-opacity',
                        bmarks?.length
                          ? 'text-amber-400 opacity-100 hover:text-red-400'
                          : 'text-gray-300 hover:text-amber-500 opacity-0 group-hover:opacity-100',
                      ].join(' ')}
                      aria-label={bmarks?.length ? 'Remove bookmark' : 'Bookmark this line'}
                      title={bmarks?.length ? 'Remove bookmark' : 'Bookmark this line'}
                    >
                      <svg className="w-3.5 h-3.5" fill={bmarks?.length ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {interimText && (
          <span
            className={`text-gray-500 ${textSize}`}
            aria-label="Interim transcript"
          >
            {interimText}
          </span>
        )}

        <div ref={bottomRef} />
      </div>

      {showJumpBtn && (
        <button
          onClick={handleJumpToBottom}
          className="absolute bottom-14 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-md bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all"
          aria-label="Jump to live transcript"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
          Jump to live
        </button>
      )}

      {openDetail && (
        <LineDetailPopover
          chunk={openDetail.chunk}
          annotation={openDetail.annotation}
          anchorRect={openDetail.rect}
          onClose={() => setOpenDetail(null)}
        />
      )}
    </section>
  );
}
