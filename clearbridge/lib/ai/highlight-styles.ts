import type { HighlightCategory } from '@/types';

export interface HighlightStyle {
  category: HighlightCategory;
  displayName: string;
  defaultLabel: string;
  bg: string;         // tailwind bg class for the line background (light mode)
  darkBg: string;     // tailwind bg class for the line background (dark / focus mode)
  tagBg: string;      // tailwind bg class for the inline tag
  tagText: string;    // tailwind text class for the inline tag
  border: string;     // tailwind border class (left accent, light mode)
  darkBorder: string; // tailwind border class (left accent, dark / focus mode)
  // PDF / print fallbacks (raw hex pairs that pass WCAG AA on white):
  pdfBg: string;
  pdfTagBg: string;
  pdfTagText: string;
}

export const HIGHLIGHT_STYLES: Record<HighlightCategory, HighlightStyle> = {
  key_point: {
    category: 'key_point',
    displayName: 'Key Point',
    defaultLabel: 'Key Idea',
    bg: 'bg-blue-50',
    darkBg: 'bg-blue-950/50',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-800',
    border: 'border-blue-300',
    darkBorder: 'border-blue-500',
    pdfBg: '#eff6ff',
    pdfTagBg: '#dbeafe',
    pdfTagText: '#1e40af',
  },
  action_item: {
    category: 'action_item',
    displayName: 'Action Item',
    defaultLabel: 'Action Required',
    bg: 'bg-emerald-50',
    darkBg: 'bg-emerald-950/50',
    tagBg: 'bg-emerald-100',
    tagText: 'text-emerald-800',
    border: 'border-emerald-300',
    darkBorder: 'border-emerald-500',
    pdfBg: '#ecfdf5',
    pdfTagBg: '#d1fae5',
    pdfTagText: '#065f46',
  },
  emphasis: {
    category: 'emphasis',
    displayName: 'Important / Warning',
    defaultLabel: 'Emphasis',
    bg: 'bg-amber-50',
    darkBg: 'bg-amber-950/50',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-900',
    border: 'border-amber-300',
    darkBorder: 'border-amber-500',
    pdfBg: '#fffbeb',
    pdfTagBg: '#fef3c7',
    pdfTagText: '#78350f',
  },
  question: {
    category: 'question',
    displayName: 'Question',
    defaultLabel: 'Question',
    bg: 'bg-purple-50',
    darkBg: 'bg-purple-950/50',
    tagBg: 'bg-purple-100',
    tagText: 'text-purple-800',
    border: 'border-purple-300',
    darkBorder: 'border-purple-500',
    pdfBg: '#faf5ff',
    pdfTagBg: '#f3e8ff',
    pdfTagText: '#6b21a8',
  },
  example: {
    category: 'example',
    displayName: 'Example / Analogy',
    defaultLabel: 'Example',
    bg: 'bg-teal-50',
    darkBg: 'bg-teal-950/50',
    tagBg: 'bg-teal-100',
    tagText: 'text-teal-800',
    border: 'border-teal-300',
    darkBorder: 'border-teal-500',
    pdfBg: '#f0fdfa',
    pdfTagBg: '#ccfbf1',
    pdfTagText: '#115e59',
  },
  definition: {
    category: 'definition',
    displayName: 'Definition',
    defaultLabel: 'Definition',
    bg: 'bg-indigo-50',
    darkBg: 'bg-indigo-950/50',
    tagBg: 'bg-indigo-100',
    tagText: 'text-indigo-800',
    border: 'border-indigo-300',
    darkBorder: 'border-indigo-500',
    pdfBg: '#eef2ff',
    pdfTagBg: '#e0e7ff',
    pdfTagText: '#3730a3',
  },
  general: {
    category: 'general',
    displayName: 'General Speech',
    defaultLabel: '',
    bg: '',
    darkBg: '',
    tagBg: 'bg-gray-100',
    tagText: 'text-gray-600',
    border: 'border-transparent',
    darkBorder: 'border-transparent',
    pdfBg: 'transparent',
    pdfTagBg: '#f3f4f6',
    pdfTagText: '#4b5563',
  },
};

export const HIGHLIGHT_CATEGORY_ORDER: HighlightCategory[] = [
  'key_point',
  'action_item',
  'emphasis',
  'question',
  'example',
  'definition',
  'general',
];
