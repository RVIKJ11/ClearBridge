'use client';

export type SpeechResultCallback = (transcript: string, isFinal: boolean, timestamp: number) => void;
export type SpeechErrorCallback = (error: string) => void;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;
let shouldBeListening = false;

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

function createRecognition(
  onResult: SpeechResultCallback,
  onError: SpeechErrorCallback,
  onEnd: () => void
) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-US';
  rec.maxAlternatives = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rec.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';
    const now = Date.now();

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript + ' ';
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript, true, now);
    } else if (interimTranscript) {
      onResult(interimTranscript, false, now);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rec.onerror = (event: any) => {
    if (event.error === 'no-speech') return;
    if (event.error === 'aborted') return;
    onError(`Speech recognition error: ${event.error}`);
    shouldBeListening = false;
  };

  rec.onend = () => {
    if (shouldBeListening) {
      try {
        recognition = createRecognition(onResult, onError, onEnd);
        recognition.start();
      } catch {
        shouldBeListening = false;
        onEnd();
      }
      return;
    }
    onEnd();
  };

  return rec;
}

export function startSpeechRecognition(
  onResult: SpeechResultCallback,
  onError: SpeechErrorCallback,
  onEnd: () => void
): void {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please use Google Chrome.');
    return;
  }

  shouldBeListening = true;
  recognition = createRecognition(onResult, onError, onEnd);
  recognition.start();
}

export function stopSpeechRecognition(): void {
  shouldBeListening = false;
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}
