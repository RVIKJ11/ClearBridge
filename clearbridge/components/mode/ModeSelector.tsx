'use client';

import { useAppStore } from '@/store/app-store';
import type { AccessibilityMode } from '@/types';

interface ModeSelectorProps {
  onSelect?: (mode: AccessibilityMode) => void;
  compact?: boolean;
}

const modes: {
  id: AccessibilityMode;
  label: string;
  description: string;
  tagline: string;
  bullets: { icon: string; text: string }[];
  colorSelected: string;
  colorBadge: string;
  iconBg: string;
  iconText: string;
  ringColor: string;
  descBg: string;
  descText: string;
  descBorder: string;
  bulletAccent: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'hearing',
    label: 'Hearing Support',
    description: 'Key points and action items lead. Structured for reading, no audio output.',
    tagline: 'A visual-first experience built for readers.',
    bullets: [
      { icon: '👁', text: 'Results shown as scannable key points and action items' },
      { icon: '🔇', text: 'No audio output — nothing competes for your attention' },
      { icon: '📋', text: 'Content structured so you can read, absorb, and act quickly' },
      { icon: '🎨', text: 'Standard contrast and text size kept clean by default' },
    ],
    descBg: 'bg-indigo-50',
    descText: 'text-indigo-800',
    descBorder: 'border-indigo-200',
    bulletAccent: 'bg-indigo-100',
    colorSelected: 'border-indigo-500 bg-indigo-50 shadow-indigo-100',
    colorBadge: 'bg-indigo-600 text-white',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    ringColor: 'focus-visible:ring-indigo-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'vision',
    label: 'Vision Support',
    description: 'Content read aloud automatically. Large text and high contrast enabled.',
    tagline: 'An audio-first experience built for listeners.',
    bullets: [
      { icon: '🔊', text: 'Results read aloud automatically the moment they are ready' },
      { icon: '🔠', text: 'Large text activated so every word is easy to see' },
      { icon: '⚡', text: 'High contrast display for maximum legibility at a glance' },
      { icon: '🎧', text: 'Listening and reading flow together without interruption' },
    ],
    descBg: 'bg-violet-50',
    descText: 'text-violet-800',
    descBorder: 'border-violet-200',
    bulletAccent: 'bg-violet-100',
    colorSelected: 'border-violet-500 bg-violet-50 shadow-violet-100',
    colorBadge: 'bg-violet-600 text-white',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    ringColor: 'focus-visible:ring-violet-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
  },
  {
    id: 'dual',
    label: 'Dual Support',
    description: 'Full coverage. Key points, actions, read aloud, and high contrast together.',
    tagline: 'Every channel active. Nothing missed.',
    bullets: [
      { icon: '👁', text: 'Visual key points and action items structured for reading' },
      { icon: '🔊', text: 'Text-to-speech reads results aloud at the same time' },
      { icon: '🔠', text: 'Large text and high contrast both switched on' },
      { icon: '✅', text: 'All features work together so you can engage however suits you' },
    ],
    descBg: 'bg-blue-50',
    descText: 'text-blue-800',
    descBorder: 'border-blue-200',
    bulletAccent: 'bg-blue-100',
    colorSelected: 'border-blue-500 bg-blue-50 shadow-blue-100',
    colorBadge: 'bg-blue-600 text-white',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    ringColor: 'focus-visible:ring-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

export default function ModeSelector({ onSelect, compact = false }: ModeSelectorProps) {
  const { accessibilityMode, setAccessibilityMode } = useAppStore();

  function handleSelect(mode: AccessibilityMode) {
    setAccessibilityMode(mode);
    onSelect?.(mode);
  }

  if (compact) {
    const selectedMode = modes.find((m) => m.id === accessibilityMode);
    return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Accessibility mode">
          {modes.map((mode) => {
            const isSelected = accessibilityMode === mode.id;
            return (
              <button
                key={mode.id}
                role="radio"
                aria-checked={isSelected}
                title={mode.description}
                onClick={() => handleSelect(mode.id)}
                className={[
                  'px-4 py-2 rounded-full text-sm font-bold transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  mode.ringColor,
                  isSelected
                    ? `${mode.colorBadge} shadow-sm`
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300',
                ].join(' ')}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {selectedMode && (
          <div
            className={`rounded-xl border px-4 py-4 ${selectedMode.descBg} ${selectedMode.descBorder}`}
            role="status"
            aria-live="polite"
          >
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${selectedMode.descText} opacity-60`}>
              {selectedMode.label}
            </p>
            <p className={`text-sm font-semibold mb-3 ${selectedMode.descText}`}>
              {selectedMode.tagline}
            </p>
            <ul className="space-y-2">
              {selectedMode.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${selectedMode.bulletAccent}`}>
                    {bullet.icon}
                  </span>
                  <span className={`text-sm font-medium leading-snug pt-1 ${selectedMode.descText}`}>
                    {bullet.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      role="radiogroup"
      aria-label="Select your accessibility mode"
    >
      {modes.map((mode) => {
        const isSelected = accessibilityMode === mode.id;
        return (
          <button
            key={mode.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(mode.id)}
            className={[
              'card-hover text-left p-6 rounded-2xl border-2 transition-all cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              mode.ringColor,
              isSelected
                ? `${mode.colorSelected} shadow-md`
                : 'bg-white border-gray-200 hover:border-gray-300',
            ].join(' ')}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
              isSelected ? `${mode.iconBg} ${mode.iconText}` : 'bg-gray-100 text-gray-400'
            }`}>
              {mode.icon}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{mode.label}</span>
              {isSelected && (
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${mode.colorBadge}`}>
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
