'use client';

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function readAloud(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
    onStart?: () => void;
  }
): void {
  if (!isTTSSupported() || !text.trim()) return;

  stopReading();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 1.05;
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;
  utterance.lang = 'en-US';

  // Prefer neural / online voices (most natural-sounding), then well-known
  // high-quality fallbacks, then any en-US voice.
  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.startsWith('en'));
  const pick = (names: string[]) =>
    names.reduce<SpeechSynthesisVoice | undefined>(
      (found, n) => found ?? enVoices.find((v) => v.name.includes(n)),
      undefined
    );

  const preferred =
    // 1. Edge / Windows neural voices (very natural)
    pick(['Aria', 'Jenny', 'Guy', 'Davis', 'Emma', 'Brian']) ??
    // 2. Chrome cloud voices
    pick(['Google US English', 'Google UK English Female']) ??
    // 3. macOS high-quality voices
    pick(['Samantha', 'Karen', 'Daniel', 'Moira']) ??
    // 4. Any en-US voice
    enVoices.find((v) => v.lang === 'en-US');

  if (preferred) utterance.voice = preferred;

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;

  window.speechSynthesis.speak(utterance);
}

export function stopReading(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function pauseReading(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

export function resumeReading(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

export function isReading(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.speechSynthesis?.speaking === true
  );
}
