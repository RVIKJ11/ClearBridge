'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface StudyGuideViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function StudyGuideView({ results, autoReadAloud = false }: StudyGuideViewProps) {
  const { largeText } = useAppStore();
  const textSize = largeText ? 'text-lg' : 'text-base';

  return (
    <div
      id="tabpanel-study"
      role="tabpanel"
      aria-labelledby="tab-study"
      className="space-y-5"
    >
      {results.topicBreakdown.length > 0 && (
        <section aria-labelledby="topic-breakdown-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="topic-breakdown-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Topic Breakdown
              <span className="ml-2 text-sm font-normal text-gray-400">{results.topicBreakdown.length}</span>
            </h3>
            <ReadAloudButton
              text={`Topic breakdown: ${results.topicBreakdown.map((t) => `${t.topic}: ${t.summary}`).join('. ')}`}
              label="Read topics"
            />
          </div>
          <div className="space-y-3">
            {results.topicBreakdown.map((topic, i) => (
              <Card key={i} variant="bordered" padding="sm" className="border-l-4 border-l-indigo-400">
                <h4 className={`font-medium text-indigo-700 mb-1 ${largeText ? 'text-base' : 'text-sm'}`}>
                  {topic.topic}
                </h4>
                <p className={`text-gray-600 leading-relaxed ${largeText ? 'text-base' : 'text-sm'}`}>
                  {topic.summary}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results.studyGuide && (
        <Card variant="elevated">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Study Guide
            </h3>
            <ReadAloudButton text={results.studyGuide} label="Read study guide" autoStart={autoReadAloud} />
          </div>
          <div className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${textSize}`}>
            {results.studyGuide}
          </div>
        </Card>
      )}

      {results.nextSteps.length > 0 && (
        <Card variant="bordered" className="border-teal-200 bg-teal-50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-teal-800 ${largeText ? 'text-lg' : 'text-base'}`}>
              Next Steps
            </h3>
            <ReadAloudButton
              text={`Next steps: ${results.nextSteps.join('. ')}`}
              label="Read next steps"
            />
          </div>
          <ol className="space-y-2">
            {results.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className={`text-gray-700 leading-relaxed ${textSize}`}>{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {results.learnMore.length > 0 && (
        <Card variant="default">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Learn More
            </h3>
            <ReadAloudButton
              text={`Learn more about: ${results.learnMore.join('. ')}`}
              label="Read learn more"
            />
          </div>
          <ul className="space-y-2">
            {results.learnMore.map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-blue-500 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className={`text-gray-600 leading-relaxed ${largeText ? 'text-base' : 'text-sm'}`}>{item}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {results.funFacts.length > 0 && (
        <Card variant="bordered" className="border-orange-200 bg-orange-50">
          <h3 className={`font-semibold text-orange-800 mb-3 ${largeText ? 'text-lg' : 'text-base'}`}>
            Fun Facts
          </h3>
          <ul className="space-y-2">
            {results.funFacts.map((fact, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-orange-500 flex-shrink-0 mt-0.5 text-sm">&#9733;</span>
                <p className={`text-gray-700 leading-relaxed ${largeText ? 'text-base' : 'text-sm'}`}>{fact}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!results.studyGuide && results.topicBreakdown.length === 0 && (
        <Card variant="default">
          <p className="text-gray-400 text-center py-8">
            No study guide material was generated for this content.
          </p>
        </Card>
      )}
    </div>
  );
}
