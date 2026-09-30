'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { highContrast, largeText } = useAppStore();

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    if (largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }
  }, [largeText]);

  return <>{children}</>;
}
