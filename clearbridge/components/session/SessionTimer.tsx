'use client';

import { useState, useEffect } from 'react';

interface SessionTimerProps {
  startTime: number | null;
  isRecording: boolean;
  className?: string;
}

export default function SessionTimer({ startTime, isRecording, className = '' }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRecording || !startTime) {
      return;
    }
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  if (!startTime) return null;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
      )}
      <span
        className={`font-mono text-sm tabular-nums ${className || 'text-gray-500'}`}
        aria-label={`Session time: ${mins} minutes ${secs} seconds`}
      >
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
