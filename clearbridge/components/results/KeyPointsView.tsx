'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface KeyPointsViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function KeyPointsView({ results, autoReadAloud = false }: KeyPointsViewProps) {
  const { largeText } = useAppStore();

  const readText = results.keyPoints.length > 0
    ? `Key points: ${results.keyPoints.join('. ')}`
    : 'No key points found.';

  return (
    <div
      id="tabpanel-keypoints"
      role="tabpanel"
      aria-labelledby="tab-keypoints"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3
          className={`font-semibold text-gray-900 ${
            largeText ? 'text-lg' : 'text-base'
          }`}
        >
          Key Points
          {results.keyPoints.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              {results.keyPoints.length}
            </span>
          )}
        </h3>
        <ReadAloudButton
          text={readText}
          label="Read all key points"
          autoStart={autoReadAloud}
        />
      </div>

      {results.keyPoints.length === 0 ? (
        <Card variant="default">
          <p className="text-gray-400 text-center py-8">
            No key points were extracted from this content.
          </p>
        </Card>
      ) : (
        <ol
          className="space-y-2"
          aria-label="Key points list"
        >
          {results.keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium"
              >
                {i + 1}
              </span>
              <p
                className={`text-gray-700 leading-relaxed flex-1 ${
                  largeText ? 'text-lg' : 'text-base'
                }`}
              >
                {point}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
