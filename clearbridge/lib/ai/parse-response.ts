import type { ProcessedResults, InsightSignal, GlossaryEntry, TopicSegment } from '@/types';

interface RawAIResponse {
  cleanedTranscript?: string;
  summary?: string;
  detailedSummary?: string;
  simplifiedExplanation?: string;
  keyPoints?: unknown[];
  actionItems?: unknown[];
  dates?: unknown[];
  questions?: unknown[];
  steps?: unknown[];
  namesAndTerms?: unknown[];
  glossary?: unknown[];
  topicBreakdown?: unknown[];
  whatMatters?: unknown[];
  studyGuide?: string;
  nextSteps?: unknown[];
  learnMore?: unknown[];
  funFacts?: unknown[];
  insights?: unknown[];
}

function ensureStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.filter((item) => typeof item === 'string') as string[];
}

function parseGlossary(val: unknown): GlossaryEntry[] {
  if (!Array.isArray(val)) return [];
  return val
    .filter(
      (item): item is { term: string; definition: string } =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).term === 'string' &&
        typeof (item as Record<string, unknown>).definition === 'string'
    )
    .map((item) => ({ term: item.term, definition: item.definition }));
}

function parseTopicBreakdown(val: unknown): TopicSegment[] {
  if (!Array.isArray(val)) return [];
  return val
    .filter(
      (item): item is { topic: string; summary: string; startIndex?: number } =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).topic === 'string' &&
        typeof (item as Record<string, unknown>).summary === 'string'
    )
    .map((item, idx) => ({
      topic: item.topic,
      summary: item.summary,
      startIndex: typeof item.startIndex === 'number' ? item.startIndex : idx,
    }));
}

const VALID_INSIGHT_TYPES = new Set<InsightSignal['type']>([
  'action_items', 'dates', 'key_points', 'image', 'simplified', 'general', 'questions', 'glossary', 'steps',
]);

function isValidInsight(item: unknown): item is InsightSignal {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    VALID_INSIGHT_TYPES.has(obj.type as InsightSignal['type']) &&
    typeof obj.message === 'string' &&
    obj.message.length > 0
  );
}

function buildInsights(raw: unknown[], results: Partial<ProcessedResults>): InsightSignal[] {
  const validAIInsights = (raw || []).filter(isValidInsight);
  if (validAIInsights.length > 0) {
    const signals: InsightSignal[] = [...validAIInsights];

    const imageCount = results.imageDescriptions?.length ?? 0;
    if (imageCount > 0 && !signals.some((s) => s.type === 'image')) {
      signals.push({
        type: 'image',
        message: `${imageCount} image${imageCount !== 1 ? 's' : ''} described`,
        count: imageCount,
      });
    }
    if (results.simplifiedExplanation && !signals.some((s) => s.type === 'simplified')) {
      signals.push({ type: 'simplified', message: 'Simplified version ready' });
    }

    return signals;
  }

  const signals: InsightSignal[] = [];
  const counts: [InsightSignal['type'], unknown[] | undefined, string][] = [
    ['key_points', results.keyPoints, 'key point'],
    ['action_items', results.actionItems, 'action item'],
    ['dates', results.dates, 'date/deadline'],
    ['questions', results.questions, 'question'],
    ['glossary', results.glossary, 'term defined'],
    ['steps', results.steps, 'step/instruction'],
  ];

  for (const [type, arr, label] of counts) {
    const count = arr?.length ?? 0;
    if (count > 0) {
      signals.push({
        type,
        message: `${count} ${label}${count !== 1 ? 's' : ''} found`,
        count,
      });
    }
  }

  const imageCount = results.imageDescriptions?.length ?? 0;
  if (imageCount > 0) {
    signals.push({
      type: 'image',
      message: `${imageCount} image${imageCount !== 1 ? 's' : ''} described`,
      count: imageCount,
    });
  }

  if (results.simplifiedExplanation) {
    signals.push({ type: 'simplified', message: 'Simplified version ready' });
  }

  return signals;
}

export function parseAIResponse(
  raw: string,
  originalText: string,
  imageDescriptions: ProcessedResults['imageDescriptions'] = []
): ProcessedResults {
  let parsed: RawAIResponse = {};

  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    parsed = JSON.parse(cleaned);
  } catch {
    return {
      originalText,
      cleanedTranscript: originalText,
      summary: 'Content was processed but could not be fully structured. Please try again.',
      detailedSummary: '',
      simplifiedExplanation: originalText.slice(0, 500),
      keyPoints: [],
      actionItems: [],
      dates: [],
      questions: [],
      steps: [],
      namesAndTerms: [],
      glossary: [],
      topicBreakdown: [],
      whatMatters: [],
      studyGuide: '',
      nextSteps: [],
      learnMore: [],
      funFacts: [],
      imageDescriptions,
      insights: [{ type: 'general', message: 'Content processed with limited structure' }],
    };
  }

  const keyPoints = ensureStringArray(parsed.keyPoints);
  const actionItems = ensureStringArray(parsed.actionItems);
  const dates = ensureStringArray(parsed.dates);
  const questions = ensureStringArray(parsed.questions);
  const steps = ensureStringArray(parsed.steps);
  const namesAndTerms = ensureStringArray(parsed.namesAndTerms);
  const glossary = parseGlossary(parsed.glossary);
  const topicBreakdown = parseTopicBreakdown(parsed.topicBreakdown);
  const whatMatters = ensureStringArray(parsed.whatMatters);
  const nextSteps = ensureStringArray(parsed.nextSteps);
  const learnMore = ensureStringArray(parsed.learnMore);
  const funFacts = ensureStringArray(parsed.funFacts);

  const partial: Partial<ProcessedResults> = {
    keyPoints,
    actionItems,
    dates,
    questions,
    steps,
    namesAndTerms,
    glossary,
    topicBreakdown,
    whatMatters,
    nextSteps,
    learnMore,
    funFacts,
    imageDescriptions,
    simplifiedExplanation: typeof parsed.simplifiedExplanation === 'string'
      ? parsed.simplifiedExplanation
      : '',
  };

  const insights = buildInsights(parsed.insights ?? [], partial);

  return {
    originalText,
    cleanedTranscript: typeof parsed.cleanedTranscript === 'string' ? parsed.cleanedTranscript : originalText,
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    detailedSummary: typeof parsed.detailedSummary === 'string' ? parsed.detailedSummary : '',
    simplifiedExplanation: partial.simplifiedExplanation ?? '',
    keyPoints,
    actionItems,
    dates,
    questions,
    steps,
    namesAndTerms,
    glossary,
    topicBreakdown,
    whatMatters,
    studyGuide: typeof parsed.studyGuide === 'string' ? parsed.studyGuide : '',
    nextSteps,
    learnMore,
    funFacts,
    imageDescriptions,
    insights,
  };
}
