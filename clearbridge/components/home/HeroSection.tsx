'use client';

import { useAppStore } from '@/store/app-store';
import { useRouter } from 'next/navigation';

const stats = [
  { value: 'Live', label: 'Real-time transcription' },
  { value: '100%', label: 'Browser-native TTS' },
  { value: '6', label: 'AI annotation categories' },
];

export default function HeroSection() {
  const { largeText } = useAppStore();
  const router = useRouter();

  return (
    <section
      className="hero-bg pt-14 pb-20 px-6 relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-24 w-64 h-64 rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center md:justify-start mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-50 border border-indigo-200 text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true" />
            Accessibility for everyone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <h1
              id="hero-heading"
              className={`font-extrabold leading-[1.08] mb-6 tracking-tight text-gray-900 ${
                largeText ? 'text-5xl' : 'text-4xl sm:text-[3.5rem]'
              }`}
            >
              Every Voice
              <br />
              and Vision,
              <br />
              <span className="gradient-text">Understood</span>
            </h1>

            <p
              className={`text-gray-500 leading-relaxed max-w-md font-medium mb-8 ${
                largeText ? 'text-xl' : 'text-base'
              }`}
            >
              If someone speaks and there is no caption, or a document has
              no summary, the information is lost. ClearBridge makes sure
              it never is.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/session')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
                Start Live Session
              </button>
              <button
                onClick={() => router.push('/sessions')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-indigo-300 bg-white text-gray-800 font-bold text-sm transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                View Saved Sessions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: visual card stack */}
          <div className="relative flex items-center justify-center">
            {/* Background glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-20"
              style={{ background: 'radial-gradient(ellipse at center, #a5b4fc 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            {/* Main demo card */}
            <div className="relative w-full max-w-sm rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100 p-6 animate-float">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-900">Live Caption</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  Live
                </span>
              </div>

              {/* Simulated caption lines */}
              <div className="space-y-2 mb-5">
                <div className="h-3 rounded-full bg-gray-100 w-full" />
                <div className="h-3 rounded-full bg-indigo-100 w-4/5" />
                <div className="h-3 rounded-full bg-gray-100 w-full" />
                <div className="h-3 rounded-full bg-violet-100 w-3/4" />
                <div className="h-3 rounded-full bg-gray-100 w-5/6" />
              </div>

              {/* Key points preview */}
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Key Points</p>
                <ul className="space-y-1.5">
                  {['Due date: Friday at 5pm', 'Review chapter 4 & 5', 'Group project assigned'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Floating pill badges */}
            <div
              className="absolute -top-3 -right-3 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-violet-200"
              aria-hidden="true"
            >
              AI-powered
            </div>
            <div
              className="absolute -bottom-3 -left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-200"
              aria-hidden="true"
            >
              Zero setup
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg" role="list" aria-label="Key statistics">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center" role="listitem">
              <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
