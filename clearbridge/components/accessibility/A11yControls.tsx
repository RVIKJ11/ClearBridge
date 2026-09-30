'use client';

import { useAppStore } from '@/store/app-store';

export default function A11yControls() {
  const { highContrast, largeText, setHighContrast, setLargeText } = useAppStore();

  const inactiveClass = 'text-gray-900 border border-gray-400 hover:bg-gray-100 hover:border-gray-600';

  return (
    <div className="flex items-center gap-1.5" role="toolbar" aria-label="Accessibility controls">
      <button
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        aria-label={`High contrast ${highContrast ? 'on' : 'off'}`}
        title="Toggle high-contrast mode"
        className={[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          highContrast ? 'contrast-btn-active' : inactiveClass,
        ].join(' ')}
      >
        Contrast
      </button>

      <button
        onClick={() => setLargeText(!largeText)}
        aria-pressed={largeText}
        aria-label={`Large text ${largeText ? 'on' : 'off'}`}
        title="Toggle larger text size"
        className={[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          largeText ? 'contrast-btn-active' : inactiveClass,
        ].join(' ')}
      >
        A+ Text
      </button>
    </div>
  );
}
