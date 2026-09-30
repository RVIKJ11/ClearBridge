import type { AccessibilityMode, ModeConfig, TabId } from '@/types';

export function getModeConfig(mode: AccessibilityMode): ModeConfig {
  switch (mode) {
    case 'hearing':
      return {
        defaultTab: 'summary',
        tabOrder: ['summary', 'keypoints', 'actions', 'study', 'glossary', 'analytics', 'fulltext'],
        autoReadAloud: false,
        defaultLargeText: false,
        defaultHighContrast: false,
      };
    case 'vision':
      return {
        defaultTab: 'summary',
        tabOrder: ['summary', 'fulltext', 'keypoints', 'actions', 'study', 'glossary'],
        autoReadAloud: true,
        defaultLargeText: true,
        defaultHighContrast: true,
      };
    case 'dual':
      return {
        defaultTab: 'summary',
        tabOrder: ['summary', 'keypoints', 'actions', 'study', 'glossary', 'analytics', 'fulltext'],
        autoReadAloud: true,
        defaultLargeText: true,
        defaultHighContrast: true,
      };
  }
}

export const TAB_DEFINITIONS: Record<TabId, { label: string; icon: string; description: string }> = {
  summary: {
    label: 'Overview',
    icon: '📋',
    description: 'Summary, key takeaways, and what matters most',
  },
  keypoints: {
    label: 'Key Points',
    icon: '🎯',
    description: 'Most important information extracted',
  },
  actions: {
    label: 'Actions & Dates',
    icon: '✅',
    description: 'Tasks, deadlines, instructions, and questions',
  },
  study: {
    label: 'Study Guide',
    icon: '📚',
    description: 'Learning aids, topic breakdown, and review material',
  },
  glossary: {
    label: 'Glossary',
    icon: '📖',
    description: 'Terms, names, definitions, and learn more',
  },
  analytics: {
    label: 'Analytics',
    icon: '📊',
    description: 'Visual breakdown and session statistics',
  },
  fulltext: {
    label: 'Full Text',
    icon: '📄',
    description: 'Complete and cleaned transcript',
  },
};

export function getModeLabel(mode: AccessibilityMode): string {
  switch (mode) {
    case 'hearing':
      return 'Hearing Support';
    case 'vision':
      return 'Vision Support';
    case 'dual':
      return 'Dual Support';
  }
}

export function getModeDescription(mode: AccessibilityMode): string {
  switch (mode) {
    case 'hearing':
      return 'Visual first. Key points and action items lead, structured for easy reading. No audio output.';
    case 'vision':
      return 'Audio-first: content read aloud automatically, large text and high contrast enabled, summary leads';
    case 'dual':
      return 'Full coverage: key points and actions first so nothing is missed, plus read-aloud and high contrast';
  }
}

export function getModeColor(mode: AccessibilityMode): string {
  switch (mode) {
    case 'hearing':
      return 'hearing';
    case 'vision':
      return 'vision';
    case 'dual':
      return 'dual';
  }
}
