'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';
import ResultsDashboard from '@/components/results/ResultsDashboard';
import ProcessingOverlay from '@/components/ui/ProcessingOverlay';
import Button from '@/components/ui/Button';
import { getModeConfig } from '@/lib/mode-adapter';

export default function ResultsPage() {
  const router = useRouter();
  const { currentSession, accessibilityMode, highContrast, largeText, setHighContrast, setLargeText } = useAppStore();
  const modeConfig = getModeConfig(accessibilityMode);

  useEffect(() => {
    if (modeConfig.defaultHighContrast && !highContrast) {
      setHighContrast(true);
    }
    if (modeConfig.defaultLargeText && !largeText) {
      setLargeText(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessibilityMode]);

  if (currentSession.isProcessing) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20">
        <ProcessingOverlay
          step="Analyzing your session..."
          subtext="Generating summary, key points, study guide, glossary, and more."
        />
      </div>
    );
  }

  if (currentSession.error) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-6">
          {currentSession.error}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="primary" onClick={() => router.push('/')}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSession.results) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          No results yet
        </h1>
        <p className="text-gray-500 mb-6">
          Start a live session to see results.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={() => router.push('/session')}>
            Start Live Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-in">
      <ResultsDashboard
        results={currentSession.results}
        title={currentSession.fileName}
        inputType={currentSession.inputType}
      />
      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
        <p className="text-sm text-gray-400">
          Start a new session
        </p>
        <div className="flex gap-2">
          <Link href="/session">
            <Button variant="primary" size="sm">New Session</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
