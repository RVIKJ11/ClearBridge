'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import ReadAloudButton from '@/components/accessibility/ReadAloudButton';
import Card from '@/components/ui/Card';

interface GlossaryViewProps {
  results: ProcessedResults;
  autoReadAloud?: boolean;
}

export default function GlossaryView({ results, autoReadAloud = false }: GlossaryViewProps) {
  const { largeText } = useAppStore();
  const textSize = largeText ? 'text-lg' : 'text-base';

  return (
    <div
      id="tabpanel-glossary"
      role="tabpanel"
      aria-labelledby="tab-glossary"
      className="space-y-5"
    >
      {results.glossary.length > 0 && (
        <section aria-labelledby="glossary-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="glossary-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Glossary
              <span className="ml-2 text-sm font-normal text-gray-400">{results.glossary.length}</span>
            </h3>
            <ReadAloudButton
              text={`Glossary: ${results.glossary.map((g) => `${g.term}: ${g.definition}`).join('. ')}`}
              label="Read glossary"
              autoStart={autoReadAloud}
            />
          </div>
          <div className="space-y-2">
            {results.glossary.map((entry, i) => (
              <Card key={i} variant="bordered" padding="sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wide mt-0.5">
                    {entry.term}
                  </span>
                  <p className={`text-gray-600 leading-relaxed flex-1 ${largeText ? 'text-base' : 'text-sm'}`}>
                    {entry.definition}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results.namesAndTerms.length > 0 && (
        <section aria-labelledby="names-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="names-heading" className={`font-semibold text-gray-900 ${largeText ? 'text-lg' : 'text-base'}`}>
              Names, Terms & Topics
              <span className="ml-2 text-sm font-normal text-gray-400">{results.namesAndTerms.length}</span>
            </h3>
            <ReadAloudButton
              text={`Important names and terms: ${results.namesAndTerms.join('. ')}`}
              label="Read names and terms"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {results.namesAndTerms.map((term, i) => (
              <span
                key={i}
                className={`inline-block px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 ${largeText ? 'text-base' : 'text-sm'}`}
              >
                {term}
              </span>
            ))}
          </div>
        </section>
      )}

      {results.glossary.length === 0 && results.namesAndTerms.length === 0 && (
        <Card variant="default">
          <p className="text-gray-400 text-center py-8">
            No glossary terms or important names were detected.
          </p>
        </Card>
      )}
    </div>
  );
}
