'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';

export default function ActionCards() {
  const router = useRouter();
  const { largeText } = useAppStore();

  return (
    <section
      aria-labelledby="actions-heading"
      className="px-6 pt-16 pb-20"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2
            id="actions-heading"
            className={`font-extrabold text-gray-900 tracking-tight ${largeText ? 'text-3xl' : 'text-2xl'}`}
          >
            Get started now
          </h2>
          <p className={`text-gray-500 font-medium mt-2 max-w-md mx-auto ${largeText ? 'text-lg' : 'text-sm'}`}>
            Choose how you want to capture content. Results adapt to your accessibility mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Live Session card */}
          <button
            onClick={() => router.push('/session')}
            className="group card-hover text-left p-7 rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label="Start live session"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3
              className={`font-bold text-gray-900 mb-1.5 ${largeText ? 'text-xl' : 'text-base'}`}
            >
              Live Session
            </h3>
            <p className={`text-gray-500 font-medium leading-relaxed mb-4 ${largeText ? 'text-base' : 'text-sm'}`}>
              Capture speech in real time. Get live captions, key points, and action items.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Live captions', 'Key points', 'Action items'].map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Saved Sessions card */}
          <button
            onClick={() => router.push('/sessions')}
            className="group card-hover text-left p-7 rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-white hover:border-violet-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            aria-label="View saved sessions"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-5 group-hover:bg-violet-200 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3
              className={`font-bold text-gray-900 mb-1.5 ${largeText ? 'text-xl' : 'text-base'}`}
            >
              Saved Sessions
            </h3>
            <p className={`text-gray-500 font-medium leading-relaxed mb-4 ${largeText ? 'text-base' : 'text-sm'}`}>
              Revisit past sessions, review summaries, and continue where you left off.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Summaries', 'Bookmarks', 'Glossary'].map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
