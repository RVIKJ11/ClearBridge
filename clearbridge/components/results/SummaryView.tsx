'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface SummaryViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function SummaryView({ results, autoReadAloud = false }: SummaryViewProps) {
  const { largeText } = useAppStore();
  const textSize = largeText ? 'text-lg' : 'text-base';

  return (
    <div
      id="tabpanel-summary"
      role="tabpanel"
      aria-labelledby="tab-summary"
      className="space-y-5"
    >
      <Card variant="elevated">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
            Summary
          </h3>
          <ReadAloudButton
            text={results.summary}
            label="Read summary"
            autoStart={autoReadAloud}
          />
        </div>
        <p className={`text-gray-600 leading-relaxed ${textSize}`}>
          {results.summary || 'No summary available.'}
        </p>
      </Card>

      {results.whatMatters.length > 0 && (
        <Card variant="bordered" className="border-rose-200 bg-rose-50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-rose-800 ${largeText ? 'text-lg' : 'text-base'}`}>
              What Matters Most
            </h3>
            <ReadAloudButton
              text={`What matters most: ${results.whatMatters.join('. ')}`}
              label="Read what matters"
            />
          </div>
          <ol className="space-y-2">
            {results.whatMatters.map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{item}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {results.detailedSummary && (
        <Card variant="default">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Detailed Summary
            </h3>
            <ReadAloudButton text={results.detailedSummary} label="Read detailed summary" />
          </div>
          <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${textSize}`}>
            {results.detailedSummary}
          </p>
        </Card>
      )}

      <Card variant="highlight">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
            Simplified Explanation
          </h3>
          <ReadAloudButton text={results.simplifiedExplanation} label="Read simplified version" />
        </div>
        <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${textSize}`}>
          {results.simplifiedExplanation || 'No simplified explanation available.'}
        </p>
      </Card>

      {(results.dates.length > 0 || results.actionItems.length > 0) && (
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Quick Reference
            </h3>
            <ReadAloudButton
              text={`Quick reference: ${[...results.actionItems, ...results.dates].join('. ')}`}
              label="Read quick reference"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.actionItems.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 mb-2">
                  Action Items
                </p>
                <ul className="space-y-1">
                  {results.actionItems.slice(0, 4).map((item, i) => (
                    <li key={i} className={`text-gray-600 ${largeText ? 'text-base' : 'text-sm'}`}>
                      {item}
                    </li>
                  ))}
                  {results.actionItems.length > 4 && (
                    <li className="text-xs text-gray-400">
                      +{results.actionItems.length - 4} more in Actions tab
                    </li>
                  )}
                </ul>
              </div>
            )}
            {results.dates.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-amber-600 mb-2">
                  Dates & Deadlines
                </p>
                <ul className="space-y-1">
                  {results.dates.map((date, i) => (
                    <li key={i} className={`text-gray-600 ${largeText ? 'text-base' : 'text-sm'}`}>
                      {date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
