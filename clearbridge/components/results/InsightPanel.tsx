'use client';

import type { InsightSignal } from '@/types';
import { useAppStore } from '@/store/app-store';

interface InsightPanelProps {
  insights: InsightSignal[];
}

const insightStyle: Record<InsightSignal['type'], { color: string; bg: string; icon: string }> = {
  key_points: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', icon: '🎯' },
  action_items: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', icon: '✅' },
  dates: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', icon: '📅' },
  questions: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100', icon: '❓' },
  glossary: { color: 'text-violet-700', bg: 'bg-violet-50 border-violet-100', icon: '📖' },
  steps: { color: 'text-sky-700', bg: 'bg-sky-50 border-sky-100', icon: '📝' },
  image: { color: 'text-pink-700', bg: 'bg-pink-50 border-pink-100', icon: '🖼️' },
  simplified: { color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100', icon: '💡' },
  general: { color: 'text-gray-700', bg: 'bg-gray-50 border-gray-100', icon: '📋' },
};

export default function InsightPanel({ insights }: InsightPanelProps) {
  const { largeText } = useAppStore();

  if (insights.length === 0) return null;

  return (
    <aside
      className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm"
      aria-label="Session insights"
    >
      <h3
        className={`font-semibold text-gray-700 mb-3 ${
          largeText ? 'text-base' : 'text-sm'
        }`}
      >
        Session Insights
      </h3>
      <div className="flex flex-wrap gap-2" role="list">
        {insights.map((insight, i) => {
          const style = insightStyle[insight.type] || insightStyle.general;
          return (
            <div
              key={i}
              role="listitem"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${style.bg} ${largeText ? 'text-base' : 'text-sm'}`}
            >
              <span aria-hidden="true">{style.icon}</span>
              <span className={`font-medium ${style.color}`}>
                {insight.message}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
