'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface ActionItemsViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function ActionItemsView({ results, autoReadAloud = false }: ActionItemsViewProps) {
  const { largeText } = useAppStore();
  const textSize = largeText ? 'text-lg' : 'text-base';

  return (
    <div
      id="tabpanel-actions"
      role="tabpanel"
      aria-labelledby="tab-actions"
      className="space-y-6"
    >
      <section aria-labelledby="action-items-heading">
        <div className="flex items-center justify-between mb-3">
          <h3 id="action-items-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
            Action Items
            {results.actionItems.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">{results.actionItems.length}</span>
            )}
          </h3>
          <ReadAloudButton
            text={results.actionItems.length > 0 ? `Action items: ${results.actionItems.join('. ')}` : 'No action items found.'}
            label="Read action items"
            autoStart={autoReadAloud}
          />
        </div>
        {results.actionItems.length === 0 ? (
          <Card variant="default"><p className="text-gray-400 text-center py-6">No action items found.</p></Card>
        ) : (
          <ul className="space-y-2" aria-label="Action items list">
            {results.actionItems.map((item, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <span aria-hidden="true" className="text-emerald-500 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{item}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="dates-heading">
        <div className="flex items-center justify-between mb-3">
          <h3 id="dates-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
            Dates and Deadlines
            {results.dates.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">{results.dates.length}</span>
            )}
          </h3>
          <ReadAloudButton
            text={results.dates.length > 0 ? `Dates and deadlines: ${results.dates.join('. ')}` : 'No dates found.'}
            label="Read dates"
          />
        </div>
        {results.dates.length === 0 ? (
          <Card variant="default"><p className="text-gray-400 text-center py-6">No dates or deadlines found.</p></Card>
        ) : (
          <ul className="space-y-2" aria-label="Dates list">
            {results.dates.map((date, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <span aria-hidden="true" className="text-amber-500 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {results.questions.length > 0 && (
        <section aria-labelledby="questions-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="questions-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Questions Asked
              <span className="ml-2 text-sm font-normal text-gray-400">{results.questions.length}</span>
            </h3>
            <ReadAloudButton
              text={`Questions asked: ${results.questions.join('. ')}`}
              label="Read questions"
            />
          </div>
          <ul className="space-y-2" aria-label="Questions list">
            {results.questions.map((q, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                <span aria-hidden="true" className="text-purple-500 flex-shrink-0 mt-0.5 font-bold text-sm">Q</span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{q}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.steps.length > 0 && (
        <section aria-labelledby="steps-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="steps-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Steps & Instructions
              <span className="ml-2 text-sm font-normal text-gray-400">{results.steps.length}</span>
            </h3>
            <ReadAloudButton
              text={`Steps and instructions: ${results.steps.join('. ')}`}
              label="Read steps"
            />
          </div>
          <ol className="space-y-2" aria-label="Steps list">
            {results.steps.map((step, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
