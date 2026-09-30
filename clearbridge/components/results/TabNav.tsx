'use client';

import type { TabId } from '@/types';
import { TAB_DEFINITIONS } from '@/lib/mode-adapter';
import { useAppStore } from '@/store/app-store';

interface TabNavProps {
  tabs: TabId[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  const { largeText } = useAppStore();

  return (
    <nav
      role="tablist"
      aria-label="Results views"
      className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto"
    >
      {tabs.map((tabId) => {
        const tab = TAB_DEFINITIONS[tabId];
        const isActive = activeTab === tabId;
        return (
          <button
            key={tabId}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tabId}`}
            id={`tab-${tabId}`}
            onClick={() => onTabChange(tabId)}
            className={[
              'px-4 py-2 rounded-md font-medium transition-colors flex-1 text-center whitespace-nowrap',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
              largeText ? 'text-base' : 'text-sm',
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
