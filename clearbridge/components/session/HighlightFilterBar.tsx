'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  HIGHLIGHT_STYLES,
  HIGHLIGHT_CATEGORY_ORDER,
} from '@/lib/ai/highlight-styles';
import type { HighlightCategory } from '@/types';

interface HighlightFilterBarProps {
  className?: string;
  largeText?: boolean;
  dark?: boolean;
}

/**
 * Compact toggle row above the live transcript that lets the user show/hide
 * each highlight category. Layered on top — does not own any transcript state.
 */
export default function HighlightFilterBar({
  className,
  largeText,
  dark = false,
}: HighlightFilterBarProps) {
  const {
    enabledHighlightCategories,
    toggleHighlightCategory,
    setEnabledHighlightCategories,
    highlightingEnabled,
    setHighlightingEnabled,
    lineAnnotations,
  } = useAppStore();

  const counts = useMemo(() => {
    const c: Record<HighlightCategory, number> = {
      key_point: 0,
      action_item: 0,
      emphasis: 0,
      question: 0,
      example: 0,
      definition: 0,
      general: 0,
    };
    for (const a of Object.values(lineAnnotations)) {
      c[a.category] = (c[a.category] ?? 0) + 1;
    }
    return c;
  }, [lineAnnotations]);

  const allOn =
    enabledHighlightCategories.length === HIGHLIGHT_CATEGORY_ORDER.length;
  const textSize = largeText ? 'text-sm' : 'text-xs';

  return (
    <div
      className={[
        'flex flex-wrap items-center gap-1.5 flex-shrink-0',
        className ?? '',
      ].join(' ')}
      role="toolbar"
      aria-label="Annotation category filters"
    >
      <button
        type="button"
        onClick={() => setHighlightingEnabled(!highlightingEnabled)}
        className={[
          'px-2.5 py-1 rounded-full border transition-colors',
          textSize,
          'font-medium',
          highlightingEnabled
            ? 'bg-indigo-600 text-white border-indigo-600'
            : dark
            ? 'bg-gray-800 text-white border-gray-500 hover:bg-gray-700'
            : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50',
        ].join(' ')}
        aria-pressed={highlightingEnabled}
        title="Toggle live annotations on or off"
      >
        {highlightingEnabled ? 'Annotations On' : 'Annotations Off'}
      </button>

      {highlightingEnabled && (
        <>
          {HIGHLIGHT_CATEGORY_ORDER.filter((c) => c !== 'general').map(
            (category) => {
              const style = HIGHLIGHT_STYLES[category];
              const active = enabledHighlightCategories.includes(category);
              const count = counts[category];
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleHighlightCategory(category)}
                  className={[
                    'px-2.5 py-1 rounded-full border transition-all',
                    textSize,
                    active
                      ? `${style.tagBg} ${style.tagText} ${style.border}`
                      : dark
                      ? 'bg-gray-800 text-gray-200 border-gray-500 hover:bg-gray-700 hover:text-white'
                      : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50',
                    active ? 'opacity-100' : 'opacity-90',
                  ].join(' ')}
                  aria-pressed={active}
                  title={`${active ? 'Hide' : 'Show'} ${style.displayName}`}
                >
                  <span className="font-medium">{style.displayName}</span>
                  {count > 0 && (
                    <span className="ml-1.5 tabular-nums opacity-70">
                      {count}
                    </span>
                  )}
                </button>
              );
            }
          )}

          <button
            type="button"
            onClick={() =>
              setEnabledHighlightCategories(
                allOn ? [] : [...HIGHLIGHT_CATEGORY_ORDER]
              )
            }
            className={`ml-auto ${textSize} transition-colors px-2 font-medium ${
              dark
                ? 'text-white hover:text-amber-200'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {allOn ? 'Hide all' : 'Show all'}
          </button>
        </>
      )}
    </div>
  );
}
