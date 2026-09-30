'use client';

import { useState, useEffect, useRef } from 'react';
import type { ProcessedResults } from '@/types';
import type { TabId } from '@/types';
import { useAppStore } from '@/store/app-store';
import { getModeConfig } from '@/lib/mode-adapter';
import { exportSessionAsText, exportSessionAsJSON, exportSessionAsMarkdown, printSession } from '@/lib/storage';
import TabNav from './TabNav';
import SummaryView from './SummaryView';
import KeyPointsView from './KeyPointsView';
import ActionItemsView from './ActionItemsView';
import StudyGuideView from './StudyGuideView';
import GlossaryView from './GlossaryView';
import AnalyticsView from './AnalyticsView';
import FullTextView from './FullTextView';
import InsightPanel from './InsightPanel';
import Button from '@/components/ui/Button';

interface ResultsDashboardProps {
  results: ProcessedResults;
  title?: string;
  inputType?: 'live' | 'upload';
}

export default function ResultsDashboard({ results, title, inputType }: ResultsDashboardProps) {
  const {
    accessibilityMode,
    largeText,
    saveCurrentSession,
    bookmarks,
    sessionStartTime,
    transcriptChunks,
    lineAnnotations,
  } = useAppStore();
  const modeConfig = getModeConfig(accessibilityMode);

  const [activeTab, setActiveTab] = useState<TabId>(modeConfig.defaultTab);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setActiveTab(getModeConfig(accessibilityMode).defaultTab);
  }, [accessibilityMode]);

  function handleSave() {
    saveCurrentSession();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showExportMenu) return;
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showExportMenu]);

  const sessionTitle = title ?? (inputType === 'live' ? 'Live Session Results' : 'Upload Results');
  const duration = sessionStartTime ? Date.now() - sessionStartTime : undefined;

  function handleExportText() {
    exportSessionAsText(sessionTitle, results, bookmarks, duration);
    setShowExportMenu(false);
  }
  function handleExportJSON() {
    exportSessionAsJSON(sessionTitle, results, bookmarks, duration);
    setShowExportMenu(false);
  }
  function handleExportMarkdown() {
    exportSessionAsMarkdown(sessionTitle, results, bookmarks, duration);
    setShowExportMenu(false);
  }
  function handlePrint() {
    printSession(sessionTitle, results, {
      transcriptChunks,
      annotations: lineAnnotations,
    });
    setShowExportMenu(false);
  }

  const autoReadAloud = modeConfig.autoReadAloud;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-semibold text-gray-900 ${largeText ? 'text-2xl' : 'text-xl'}`}>
            {sessionTitle}
          </h1>
          <p className="text-sm text-gray-500">
            {accessibilityMode} support mode
            {duration && (
              <span className="ml-2 text-gray-400">
                {Math.floor(duration / 60000)}m {Math.floor((duration % 60000) / 1000)}s
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={exportRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExportMenu((v) => !v)}
              aria-expanded={showExportMenu}
              aria-haspopup="true"
            >
              Export
            </Button>
            {showExportMenu && (
              <div
                className="absolute right-0 mt-1 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden"
                role="menu"
              >
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors" role="menuitem" onClick={handleExportText}>
                  Plain Text (.txt)
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors" role="menuitem" onClick={handleExportMarkdown}>
                  Markdown (.md)
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors" role="menuitem" onClick={handleExportJSON}>
                  JSON (.json)
                </button>
                <div className="border-t border-gray-100" />
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors" role="menuitem" onClick={handlePrint}>
                  Print / PDF
                </button>
              </div>
            )}
          </div>
          <Button
            variant={saved ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleSave}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {results.insights.length > 0 && (
        <InsightPanel insights={results.insights} />
      )}

      <TabNav
        tabs={modeConfig.tabOrder}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div>
        {activeTab === 'summary' && (
          <SummaryView results={results} autoReadAloud={autoReadAloud} />
        )}
        {activeTab === 'keypoints' && (
          <KeyPointsView results={results} autoReadAloud={autoReadAloud} />
        )}
        {activeTab === 'actions' && (
          <ActionItemsView results={results} autoReadAloud={autoReadAloud} />
        )}
        {activeTab === 'study' && (
          <StudyGuideView results={results} autoReadAloud={autoReadAloud} />
        )}
        {activeTab === 'glossary' && (
          <GlossaryView results={results} autoReadAloud={autoReadAloud} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView results={results} />
        )}
        {activeTab === 'fulltext' && (
          <FullTextView results={results} autoReadAloud={autoReadAloud} />
        )}
      </div>
    </div>
  );
}
