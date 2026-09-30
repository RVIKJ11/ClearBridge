'use client';

import { useAppStore } from '@/store/app-store';

const features = [
  {
    title: 'Live captions in real time',
    description:
      'Speak into the microphone and see words appear instantly. Built for lectures, meetings, and conversations.',
    color: 'indigo',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    badgeClass: 'bg-indigo-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: 'Summaries you can act on',
    description:
      'Key points, action items, and deadlines pulled from any content. Structured for quick scanning or read aloud.',
    color: 'violet',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-100',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    badgeClass: 'bg-violet-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    title: 'Works with any format',
    description:
      'Upload PDFs, images, audio files, or plain text. ClearBridge extracts and restructures it all.',
    color: 'blue',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    badgeClass: 'bg-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  const { largeText } = useAppStore();

  return (
    <section
      className="px-6 pt-10 pb-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2
            id="features-heading"
            className={`font-extrabold text-gray-900 tracking-tight ${largeText ? 'text-3xl' : 'text-2xl'}`}
          >
            Built for real accessibility needs
          </h2>
          <p className={`text-gray-500 font-medium mt-2 max-w-md mx-auto ${largeText ? 'text-lg' : 'text-sm'}`}>
            Every feature designed around how people actually access information.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`card-hover p-6 rounded-2xl border ${feature.borderClass} ${feature.bgClass}`}
            >
              <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center ${feature.iconText} mb-5`}>
                {feature.icon}
              </div>
              <h3
                className={`font-bold text-gray-900 mb-2 ${largeText ? 'text-lg' : 'text-base'}`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-gray-600 leading-relaxed font-medium ${largeText ? 'text-base' : 'text-sm'}`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
