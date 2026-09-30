'use client';

import { useState, useEffect } from 'react';
import { readAloud, stopReading, pauseReading, resumeReading, isTTSSupported } from '@/lib/tts/read-aloud';
import Button from '@/components/ui/Button';

interface ReadAloudButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  autoStart?: boolean;
}

export default function ReadAloudButton({
  text,
  label = 'Read Aloud',
  size = 'sm',
  variant = 'secondary',
  autoStart = false,
}: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isTTSSupported());
  }, []);

  useEffect(() => {
    if (autoStart && text && supported) {
      handlePlay();
    }
    return () => {
      stopReading();
      setIsPlaying(false);
      setIsPaused(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, text]);

  function handlePlay() {
    readAloud(text, {
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
    setIsPlaying(true);
  }

  function handlePause() {
    pauseReading();
    setIsPaused(true);
  }

  function handleResume() {
    resumeReading();
    setIsPaused(false);
  }

  function handleStop() {
    stopReading();
    setIsPlaying(false);
    setIsPaused(false);
  }

  if (!supported) return null;

  if (!isPlaying) {
    return (
      <Button variant={variant} size={size} onClick={handlePlay} aria-label={`Read aloud: ${label}`}>
        {label}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Read aloud controls">
      {isPaused ? (
        <Button variant={variant} size={size} onClick={handleResume} aria-label="Resume reading">
          Resume
        </Button>
      ) : (
        <Button variant={variant} size={size} onClick={handlePause} aria-label="Pause reading">
          Pause
        </Button>
      )}
      <Button variant="ghost" size={size} onClick={handleStop} aria-label="Stop reading">
        Stop
      </Button>
    </div>
  );
}
