export type AccessibilityMode = 'hearing' | 'vision' | 'dual';

export type InputType = 'live' | 'upload';

export type FileType = 'pdf' | 'image' | 'audio' | 'text' | 'unknown';

export interface ContextFile {
  id: string;
  fileName: string;
  fileType: FileType;
  extractedContent: string;
  uploadedAt: number;
}

export interface ImageDescription {
  filename: string;
  description: string;
}

export interface InsightSignal {
  type: 'action_items' | 'dates' | 'key_points' | 'image' | 'simplified' | 'general' | 'questions' | 'glossary' | 'steps';
  message: string;
  count?: number;
}

export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export type HighlightCategory =
  | 'key_point'
  | 'action_item'
  | 'emphasis'
  | 'question'
  | 'example'
  | 'definition'
  | 'general';

export interface LineAnnotation {
  chunkId: string;
  category: HighlightCategory;
  label: string;
  explanation: string;
  isTopicShift?: boolean;
  topicLabel?: string;
}

export interface Bookmark {
  id: string;
  chunkId: string;
  timestamp: number;
  label: string;
  auto?: boolean;
}

export interface TopicSegment {
  topic: string;
  summary: string;
  startIndex: number;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface ProcessedResults {
  originalText: string;
  cleanedTranscript: string;
  summary: string;
  detailedSummary: string;
  simplifiedExplanation: string;
  keyPoints: string[];
  actionItems: string[];
  dates: string[];
  questions: string[];
  steps: string[];
  namesAndTerms: string[];
  glossary: GlossaryEntry[];
  topicBreakdown: TopicSegment[];
  whatMatters: string[];
  studyGuide: string;
  nextSteps: string[];
  learnMore: string[];
  funFacts: string[];
  imageDescriptions: ImageDescription[];
  insights: InsightSignal[];
}

export interface SessionData {
  id: string;
  timestamp: number;
  duration?: number;
  title: string;
  inputType: InputType;
  accessibilityMode: AccessibilityMode;
  fileName?: string;
  fileType?: FileType;
  results: ProcessedResults;
  bookmarks: Bookmark[];
}

export interface ModeConfig {
  defaultTab: TabId;
  tabOrder: TabId[];
  autoReadAloud: boolean;
  defaultLargeText: boolean;
  defaultHighContrast: boolean;
}

export type TabId = 'summary' | 'keypoints' | 'actions' | 'fulltext' | 'study' | 'glossary' | 'analytics';

export interface TabDefinition {
  id: TabId;
  label: string;
  icon: string;
}

export interface AppState {
  accessibilityMode: AccessibilityMode;
  highContrast: boolean;
  largeText: boolean;
  currentSession: CurrentSession;
  savedSessions: SessionData[];
  sessionContext: ContextFile[];

  transcriptChunks: TranscriptChunk[];
  bookmarks: Bookmark[];
  sessionStartTime: number | null;
  isRecording: boolean;
  focusMode: boolean;

  lineAnnotations: Record<string, LineAnnotation>;
  enabledHighlightCategories: HighlightCategory[];
  highlightingEnabled: boolean;

  setAccessibilityMode: (mode: AccessibilityMode) => void;
  setHighContrast: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
  setInputType: (type: InputType) => void;
  setRawContent: (content: string) => void;
  setFileInfo: (info: { fileName: string; fileType: FileType }) => void;
  setResults: (results: ProcessedResults) => void;
  setProcessing: (v: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  saveCurrentSession: () => void;
  loadSession: (session: SessionData) => void;
  deleteSavedSession: (id: string) => void;

  addTranscriptChunk: (chunk: TranscriptChunk) => void;
  clearTranscriptChunks: () => void;
  getFullTranscript: () => string;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  relabelBookmarks: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  toggleFocusMode: () => void;

  setLineAnnotation: (annotation: LineAnnotation) => void;
  clearLineAnnotations: () => void;
  toggleHighlightCategory: (category: HighlightCategory) => void;
  setEnabledHighlightCategories: (categories: HighlightCategory[]) => void;
  setHighlightingEnabled: (v: boolean) => void;

  addContextFile: (file: ContextFile) => void;
  removeContextFile: (id: string) => void;
  clearContextFiles: () => void;
}

export interface CurrentSession {
  inputType: InputType;
  rawContent: string;
  fileName?: string;
  fileType?: FileType;
  results: ProcessedResults | null;
  isProcessing: boolean;
  error: string | null;
}
