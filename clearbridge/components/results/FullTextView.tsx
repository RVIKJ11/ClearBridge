'use client';

import { useState } from 'react';
import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface FullTextViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function FullTextView({ results, autoReadAloud = false }: FullTextViewProps) {
  const { largeText } = useAppStore();
  const [showCleaned, setShowCleaned] = useState(
    results.cleanedTranscript !== results.originalText && !!results.cleanedTranscript
  );
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const displayText = showCleaned ? results.cleanedTranscript : results.originalText;

  function handleCopy() {
    navigator.clipboard.writeText(displayText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function highlightedText(text: string): React.ReactNode {
    if (!searchQuery || searchQuery.length < 2) return text;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  const hasCleaned = results.cleanedTranscript && results.cleanedTranscript !== results.originalText;

  return (
    <div
      id="tabpanel-fulltext"
      role="tabpanel"
      aria-labelledby="tab-fulltext"
      className="space-y-4"
    >
      <Card variant="default">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              {showCleaned ? 'Cleaned Transcript' : 'Original Transcript'}
            </h3>
            {hasCleaned && (
              <button
                onClick={() => setShowCleaned(!showCleaned)}
                className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Show {showCleaned ? 'Original' : 'Cleaned'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Copy transcript"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <ReadAloudButton
              text={displayText}
              label="Read full text"
              autoStart={autoReadAloud}
            />
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in transcript..."
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div
          className={[
            'max-h-[500px] overflow-y-auto rounded-lg p-4 bg-gray-50',
            'border border-gray-100',
            largeText ? 'text-lg leading-loose' : 'text-base leading-relaxed',
          ].join(' ')}
        >
          <p className="text-gray-700 whitespace-pre-wrap">
            {highlightedText(displayText || 'No text available.')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {displayText.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </Card>

      {results.imageDescriptions.length > 0 && (
        <section aria-labelledby="image-desc-heading">
          <h3 id="image-desc-heading" className={`font-semibold text-gray-900 mb-3 ${largeText ? 'text-lg' : 'text-base'}`}>
            Image Descriptions
          </h3>
          <div className="space-y-3">
            {results.imageDescriptions.map((img, i) => (
              <Card key={i} variant="bordered">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-gray-500 truncate">{img.filename}</p>
                  <ReadAloudButton text={img.description} label={`Read description for ${img.filename}`} />
                </div>
                <p className={`text-gray-700 leading-relaxed ${largeText ? 'text-lg' : 'text-base'}`}>
                  {img.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
