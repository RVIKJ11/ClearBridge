import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { HighlightCategory } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ClassifyRequestBody {
  text: string;
  recentContext?: string;
  lastTopic?: string | null;
}

interface ClassifyResponse {
  category: HighlightCategory;
  label: string;
  explanation: string;
  isTopicShift: boolean;
  topicLabel?: string;
}

const VALID_CATEGORIES = new Set<HighlightCategory>([
  'key_point',
  'action_item',
  'emphasis',
  'question',
  'example',
  'definition',
  'general',
]);

const SYSTEM_PROMPT = `You are a real-time transcript classifier for an accessibility tool. For each spoken sentence (or short phrase), you must classify it and return a single compact JSON object — no prose, no markdown, no code fences.

Return EXACTLY this shape:
{
  "category": "key_point" | "action_item" | "emphasis" | "question" | "example" | "definition" | "general",
  "label": "<2-3 word tag, Title Case>",
  "explanation": "<1-2 sentences of why this line was flagged and what it means in context>",
  "isTopicShift": <boolean>,
  "topicLabel": "<short topic name, only if isTopicShift is true>"
}

Category guide (be strict — most lines are "general"):
- key_point  → a core idea, important fact, or central claim worth remembering. Suggested labels: "Key Idea", "Main Point".
- action_item → an instruction, task, or thing the listener must do. Suggested labels: "Action Required", "To Do".
- emphasis  → a warning, caution, deadline, or strongly stressed point. Suggested labels: "Emphasis", "Warning", "Important".
- question  → a question being asked aloud. Suggested labels: "Question", "Q Raised".
- example   → an analogy, illustration, or worked example. Suggested labels: "Example", "Analogy".
- definition → defining or explaining a term. Suggested labels: "Definition".
- general   → ordinary connective speech, filler, repetition. Use empty string for label.

isTopicShift: only true if the new line clearly moves to a noticeably different subject than the recent context. Prefer false. When true, topicLabel is a 2-5 word topic title.

Keep label SHORT (≤ 24 chars). Keep explanation ≤ 240 chars. Output ONLY the JSON object.`;

function fallback(text: string): ClassifyResponse {
  const t = text.trim();
  let category: HighlightCategory = 'general';
  let label = '';

  if (/\?\s*$/.test(t)) {
    category = 'question';
    label = 'Question';
  } else if (/\b(must|need to|should|todo|action|please|remember to|don't forget)\b/i.test(t)) {
    category = 'action_item';
    label = 'Action Required';
  } else if (/\b(important|warning|critical|deadline|caution|note that)\b/i.test(t)) {
    category = 'emphasis';
    label = 'Emphasis';
  } else if (/\b(for example|such as|like when|imagine|analogy)\b/i.test(t)) {
    category = 'example';
    label = 'Example';
  } else if (/\b(is defined as|means that|refers to|by definition)\b/i.test(t)) {
    category = 'definition';
    label = 'Definition';
  }

  return {
    category,
    label,
    explanation: '',
    isTopicShift: false,
  };
}

function coerceResponse(raw: string, originalText: string): ClassifyResponse {
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    const category: HighlightCategory = VALID_CATEGORIES.has(parsed.category)
      ? parsed.category
      : 'general';
    const label =
      typeof parsed.label === 'string'
        ? parsed.label.slice(0, 30)
        : '';
    const explanation =
      typeof parsed.explanation === 'string'
        ? parsed.explanation.slice(0, 280)
        : '';
    const isTopicShift = parsed.isTopicShift === true;
    const topicLabel =
      typeof parsed.topicLabel === 'string'
        ? parsed.topicLabel.slice(0, 60)
        : undefined;

    return {
      category,
      label: category === 'general' ? '' : label,
      explanation,
      isTopicShift,
      topicLabel: isTopicShift ? topicLabel : undefined,
    };
  } catch {
    return fallback(originalText);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ClassifyRequestBody;
    const { text, recentContext = '', lastTopic = null } = body;

    if (!text || text.trim().length < 2) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Graceful fallback: keyword-based classification when no API key is set.
      return NextResponse.json(fallback(text));
    }

    const userMessage =
      `RECENT CONTEXT (previous spoken lines, oldest first):\n${recentContext || '(none yet)'}\n\n` +
      `CURRENT TOPIC SO FAR: ${lastTopic || '(unknown)'}\n\n` +
      `NEW SPOKEN LINE TO CLASSIFY:\n"${text.trim()}"\n\n` +
      `Return the JSON object now.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content ?? '';
    const result = coerceResponse(raw, text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('classify-line error:', error);
    // Never break the live UX — fall back to a simple keyword guess.
    try {
      const body = (await req.clone().json()) as ClassifyRequestBody;
      return NextResponse.json(fallback(body.text || ''));
    } catch {
      return NextResponse.json(
        { category: 'general', label: '', explanation: '', isTopicShift: false },
        { status: 200 }
      );
    }
  }
}
