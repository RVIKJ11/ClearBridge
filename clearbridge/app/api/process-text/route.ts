import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildProcessingPrompt } from '@/lib/ai/prompts';
import { parseAIResponse } from '@/lib/ai/parse-response';
import type { AccessibilityMode, ImageDescription } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHUNK_CHARS = 24000;

function splitIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      mode = 'hearing',
      imageDescriptions = [],
      context,
    }: {
      text: string;
      mode: AccessibilityMode;
      imageDescriptions?: ImageDescription[];
      context?: string;
    } = body;

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text content is too short to process.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const systemPrompt = buildProcessingPrompt(mode);
    const chunks = splitIntoChunks(text, MAX_CHUNK_CHARS);

    let analysisText = text;
    if (chunks.length > 1) {
      const summaries: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunkResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are summarizing part ${i + 1} of ${chunks.length} of a transcript. Provide a detailed summary preserving ALL key information, action items, dates, questions, names, terms, and instructions. Return plain text, not JSON.`,
            },
            { role: 'user', content: chunks[i] },
          ],
          temperature: 0.2,
          max_tokens: 2000,
        });
        summaries.push(chunkResponse.choices[0]?.message?.content ?? '');
      }

      analysisText =
        `FULL SESSION TRANSCRIPT (${chunks.length} parts combined):\n\n` +
        `DETAILED PART SUMMARIES:\n${summaries.map((s, i) => `Part ${i + 1}:\n${s}`).join('\n\n')}\n\n` +
        `COMPLETE ORIGINAL TEXT:\n${text.slice(0, MAX_CHUNK_CHARS)}` +
        (text.length > MAX_CHUNK_CHARS ? '\n[...remainder captured in part summaries above]' : '');
    }

    const userMessage = context
      ? `[CONTEXT FROM UPLOADED MATERIALS]\n${context}\n\n[LIVE SESSION TRANSCRIPT]\nPlease analyze this content from a live session and return the structured JSON with ALL fields populated:\n\n${analysisText}`
      : `Please analyze this content from a live session and return the structured JSON with ALL fields populated:\n\n${analysisText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const rawContent = response.choices[0]?.message?.content ?? '';
    const results = parseAIResponse(rawContent, text, imageDescriptions);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('process-text error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your .env.local file.' },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit reached. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process content. Please try again.' },
      { status: 500 }
    );
  }
}
