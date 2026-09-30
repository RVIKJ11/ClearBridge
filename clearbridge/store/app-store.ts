'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  AccessibilityMode,
  InputType,
  FileType,
  ProcessedResults,
  SessionData,
  CurrentSession,
  TranscriptChunk,
  Bookmark,
  LineAnnotation,
  HighlightCategory,
  ContextFile,
} from '@/types';

const ALL_HIGHLIGHT_CATEGORIES: HighlightCategory[] = [
  'key_point',
  'action_item',
  'emphasis',
  'question',
  'example',
  'definition',
  'general',
];

const emptySession: CurrentSession = {
  inputType: 'live',
  rawContent: '',
  fileName: undefined,
  fileType: undefined,
  results: null,
  isProcessing: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      accessibilityMode: 'hearing' as AccessibilityMode,
      highContrast: false,
      largeText: false,
      currentSession: { ...emptySession },
      savedSessions: [],
      sessionContext: [] as ContextFile[],

      transcriptChunks: [],
      bookmarks: [],
      sessionStartTime: null,
      isRecording: false,
      focusMode: false,

      lineAnnotations: {},
      enabledHighlightCategories: [...ALL_HIGHLIGHT_CATEGORIES],
      highlightingEnabled: true,

      setAccessibilityMode: (mode: AccessibilityMode) =>
        set({ accessibilityMode: mode }),

      setHighContrast: (v: boolean) => set({ highContrast: v }),

      setLargeText: (v: boolean) => set({ largeText: v }),

      setInputType: (type: InputType) =>
        set((s) => ({
          currentSession: { ...s.currentSession, inputType: type },
        })),

      setRawContent: (content: string) =>
        set((s) => ({
          currentSession: { ...s.currentSession, rawContent: content },
        })),

      setFileInfo: (info: { fileName: string; fileType: FileType }) =>
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            fileName: info.fileName,
            fileType: info.fileType,
          },
        })),

      setResults: (results: ProcessedResults) =>
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            results,
            isProcessing: false,
            error: null,
          },
        })),

      setProcessing: (v: boolean) =>
        set((s) => ({
          currentSession: { ...s.currentSession, isProcessing: v },
        })),

      setError: (error: string | null) =>
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            error,
            isProcessing: false,
          },
        })),

      clearSession: () =>
        set({
          currentSession: { ...emptySession },
          transcriptChunks: [],
          bookmarks: [],
          sessionStartTime: null,
          isRecording: false,
          focusMode: false,
          lineAnnotations: {},
          sessionContext: [],
        }),

      saveCurrentSession: () => {
        const { currentSession, accessibilityMode, savedSessions, bookmarks, sessionStartTime } = get();
        if (!currentSession.results) return;

        const duration = sessionStartTime
          ? Date.now() - sessionStartTime
          : undefined;

        const session: SessionData = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          duration,
          title:
            currentSession.fileName ||
            `Live Session ${new Date().toLocaleDateString()}`,
          inputType: currentSession.inputType,
          accessibilityMode,
          fileName: currentSession.fileName,
          fileType: currentSession.fileType,
          results: currentSession.results,
          bookmarks: [...bookmarks],
        };

        set({ savedSessions: [session, ...savedSessions].slice(0, 50) });
      },

      loadSession: (session: SessionData) => {
        set({
          accessibilityMode: session.accessibilityMode,
          bookmarks: session.bookmarks || [],
          currentSession: {
            inputType: session.inputType,
            rawContent: session.results.originalText,
            fileName: session.fileName,
            fileType: session.fileType,
            results: session.results,
            isProcessing: false,
            error: null,
          },
        });
      },

      deleteSavedSession: (id: string) =>
        set((s) => ({
          savedSessions: s.savedSessions.filter((sess) => sess.id !== id),
        })),

      addTranscriptChunk: (chunk: TranscriptChunk) =>
        set((s) => {
          if (!chunk.isFinal) {
            const existing = s.transcriptChunks.filter((c) => c.isFinal);
            return { transcriptChunks: [...existing, chunk] };
          }
          const existing = s.transcriptChunks.filter((c) => c.isFinal);
          return { transcriptChunks: [...existing, chunk] };
        }),

      clearTranscriptChunks: () =>
        set({ transcriptChunks: [], bookmarks: [], lineAnnotations: {} }),

      getFullTranscript: () => {
        const { transcriptChunks } = get();
        return transcriptChunks
          .filter((c) => c.isFinal)
          .map((c) => c.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      },

      addBookmark: (bookmark: Bookmark) =>
        set((s) => ({
          bookmarks: [...s.bookmarks, bookmark],
        })),

      removeBookmark: (id: string) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter((b) => b.id !== id),
        })),

      relabelBookmarks: () => {
        const { transcriptChunks, bookmarks } = get();
        const chunkOrder = new Map(transcriptChunks.map((c, i) => [c.id, i]));
        const sorted = [...bookmarks].sort((a, b) => {
          const ia = chunkOrder.get(a.chunkId) ?? Infinity;
          const ib = chunkOrder.get(b.chunkId) ?? Infinity;
          return ia - ib;
        });
        set({ bookmarks: sorted.map((b, i) => ({ ...b, label: `Bookmark ${i + 1}` })) });
      },

      startRecording: () =>
        set({
          isRecording: true,
          sessionStartTime: Date.now(),
          transcriptChunks: [],
          bookmarks: [],
          lineAnnotations: {},
        }),

      stopRecording: () =>
        set({ isRecording: false }),

      toggleFocusMode: () =>
        set((s) => ({ focusMode: !s.focusMode })),

      setLineAnnotation: (annotation: LineAnnotation) =>
        set((s) => ({
          lineAnnotations: {
            ...s.lineAnnotations,
            [annotation.chunkId]: annotation,
          },
        })),

      clearLineAnnotations: () => set({ lineAnnotations: {} }),

      toggleHighlightCategory: (category: HighlightCategory) =>
        set((s) => {
          const has = s.enabledHighlightCategories.includes(category);
          return {
            enabledHighlightCategories: has
              ? s.enabledHighlightCategories.filter((c) => c !== category)
              : [...s.enabledHighlightCategories, category],
          };
        }),

      setEnabledHighlightCategories: (categories: HighlightCategory[]) =>
        set({ enabledHighlightCategories: categories }),

      setHighlightingEnabled: (v: boolean) => set({ highlightingEnabled: v }),

      addContextFile: (file: ContextFile) =>
        set((s) => ({ sessionContext: [...s.sessionContext, file] })),

      removeContextFile: (id: string) =>
        set((s) => ({ sessionContext: s.sessionContext.filter((f) => f.id !== id) })),

      clearContextFiles: () => set({ sessionContext: [] }),
    }),
    {
      name: 'clearbridge-storage',
      partialize: (state) => ({
        savedSessions: state.savedSessions,
      }),
    }
  )
);
