'use client';

interface MicButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function MicButton({
  isRecording,
  onStart,
  onStop,
  disabled = false,
  compact = false,
}: MicButtonProps) {
  const size = compact ? 'w-10 h-10' : 'w-20 h-20';
  const iconSize = compact ? 'w-4 h-4' : 'w-7 h-7';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-pressed={isRecording}
        className={[
          `relative ${size} rounded-full transition-colors duration-200`,
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-4',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-300'
            : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300',
        ].join(' ')}
      >
        {isRecording && (
          <span
            className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40"
            aria-hidden="true"
          />
        )}
        <span className="relative flex items-center justify-center w-full h-full">
          {isRecording ? (
            <svg className={`${iconSize} text-white`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className={`${iconSize} text-white`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </span>
      </button>
      {!compact && (
        <p className="text-sm text-gray-500">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              Recording. Click to stop.
            </span>
          ) : (
            'Click to start recording'
          )}
        </p>
      )}
    </div>
  );
}
