'use client';

import type { ProcessedResults } from '@/types';
import { useAppStore } from '@/store/app-store';
import Card from '@/components/ui/Card';

interface AnalyticsViewProps {
  results: ProcessedResults;
}

interface BarData {
  label: string;
  value: number;
  color: string;
}

function HorizontalBar({ data, maxValue }: { data: BarData[]; maxValue: number }) {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">{d.label}</span>
            <span className="text-sm font-semibold text-gray-700 tabular-nums">{d.value}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${d.color}`}
              style={{ width: `${maxValue > 0 ? (d.value / maxValue) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        {segments.filter((s) => s.value > 0).map((seg) => {
          const pct = seg.value / total;
          const dashLength = pct * circumference;
          const dashOffset = -offset;
          offset += dashLength;
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              className={seg.color}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="fill-gray-700 text-2xl font-bold">
          {total}
        </text>
        <text x={size / 2} y={size / 2 + 16} textAnchor="middle" className="fill-gray-400 text-xs">
          total items
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.filter((s) => s.value > 0).map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-sm ${seg.color.replace('text-', 'bg-')}`} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="font-medium text-gray-700 tabular-nums">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsView({ results }: AnalyticsViewProps) {
  const { largeText } = useAppStore();

  const categoryData: BarData[] = [
    { label: 'Key Points', value: results.keyPoints.length, color: 'bg-blue-500' },
    { label: 'Action Items', value: results.actionItems.length, color: 'bg-emerald-500' },
    { label: 'Dates/Deadlines', value: results.dates.length, color: 'bg-amber-500' },
    { label: 'Questions', value: results.questions.length, color: 'bg-purple-500' },
    { label: 'Steps', value: results.steps.length, color: 'bg-sky-500' },
    { label: 'Glossary Terms', value: results.glossary.length, color: 'bg-violet-500' },
    { label: 'Names/Terms', value: results.namesAndTerms.length, color: 'bg-gray-500' },
  ].filter((d) => d.value > 0);

  const maxBar = Math.max(...categoryData.map((d) => d.value), 1);

  const donutSegments = [
    { label: 'Key Points', value: results.keyPoints.length, color: 'text-blue-500' },
    { label: 'Actions', value: results.actionItems.length, color: 'text-emerald-500' },
    { label: 'Dates', value: results.dates.length, color: 'text-amber-500' },
    { label: 'Questions', value: results.questions.length, color: 'text-purple-500' },
    { label: 'Steps', value: results.steps.length, color: 'text-sky-500' },
  ];

  const wordCount = results.originalText.split(/\s+/).filter(Boolean).length;
  const sentenceCount = results.originalText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  const hasData = categoryData.length > 0;

  return (
    <div
      id="tabpanel-analytics"
      role="tabpanel"
      aria-labelledby="tab-analytics"
      className="space-y-5"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Words', value: wordCount, accent: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Sentences', value: sentenceCount, accent: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Topics', value: results.topicBreakdown.length, accent: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Insights', value: results.insights.length, accent: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map(({ label, value, accent }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${accent}`}>
            <p className={`font-bold tabular-nums ${largeText ? 'text-2xl' : 'text-xl'}`}>{value}</p>
            <p className="text-xs mt-0.5 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {hasData && (
        <Card variant="elevated">
          <h3 className={`font-semibold text-gray-900 mb-4 ${largeText ? 'text-lg' : 'text-base'}`}>
            Content Breakdown
          </h3>
          <DonutChart segments={donutSegments} />
        </Card>
      )}

      {hasData && (
        <Card variant="default">
          <h3 className={`font-semibold text-gray-900 mb-4 ${largeText ? 'text-lg' : 'text-base'}`}>
            Category Distribution
          </h3>
          <HorizontalBar data={categoryData} maxValue={maxBar} />
        </Card>
      )}

      {results.topicBreakdown.length > 0 && (
        <Card variant="bordered">
          <h3 className={`font-semibold text-gray-900 mb-4 ${largeText ? 'text-lg' : 'text-base'}`}>
            Topic Timeline
          </h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
            {results.topicBreakdown.map((topic, i) => (
              <div key={i} className="relative mb-4 last:mb-0">
                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white" />
                <h4 className="font-medium text-indigo-700 text-sm">{topic.topic}</h4>
                <p className="text-gray-500 text-sm mt-0.5">{topic.summary}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!hasData && (
        <Card variant="default">
          <p className="text-gray-400 text-center py-8">
            Not enough data to generate analytics for this session.
          </p>
        </Card>
      )}
    </div>
  );
}
