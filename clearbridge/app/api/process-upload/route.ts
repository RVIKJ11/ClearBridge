import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildProcessingPrompt } from '@/lib/ai/prompts';
import { buildImageDescriptionPrompt } from '@/lib/ai/prompts';
import { parseAIResponse } from '@/lib/ai/parse-response';
import type { AccessibilityMode, ImageDescription } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractPDFText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Dynamic import with any-cast to handle ESM/CJS interop differences across pdf-parse versions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfModule: any = await import('pdf-parse');
  const pdfParse = pdfModule.default ?? pdfModule;
  const data = await pdfParse(buffer);
  return data.text;
}

async function describeImage(
  imageBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<ImageDescription> {
  const base64 = imageBuffer.toString('base64');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: buildImageDescriptionPrompt() },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    max_tokens: 800,
  });

  return {
    filename,
    description:
      response.choices[0]?.message?.content ??
      'Image description could not be generated.',
  };
}

async function processWithAI(
  text: string,
  mode: AccessibilityMode,
  imageDescriptions: ImageDescription[]
) {
  const systemPrompt = buildProcessingPrompt(mode);
  const truncatedText =
    text.length > 24000
      ? text.slice(0, 24000) + '\n\n[Content truncated for processing]'
      : text;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Please analyze this content and return the structured JSON with ALL fields populated:\n\n${truncatedText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const rawContent = response.choices[0]?.message?.content ?? '';
  return parseAIResponse(rawContent, text, imageDescriptions);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as AccessibilityMode) || 'hearing';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    const filename = file.name;
    let extractedText = '';
    const imageDescriptions: ImageDescription[] = [];

    if (mimeType === 'application/pdf') {
      try {
        extractedText = await extractPDFText(file);
        if (!extractedText.trim()) {
          return NextResponse.json(
            {
              error:
                'Could not extract text from this PDF. It may be a scanned image PDF. Please try uploading it as an image instead.',
            },
            { status: 422 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Failed to parse PDF. Please ensure it is a valid PDF file.' },
          { status: 422 }
        );
      }
    } else if (mimeType.startsWith('image/')) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get image description
      const imgDesc = await describeImage(buffer, mimeType, filename);
      imageDescriptions.push(imgDesc);

      // Use the image description as text for AI processing
      extractedText = `[Image Content from ${filename}]\n\n${imgDesc.description}`;
    } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
      extractedText = await file.text();
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${mimeType}. Please upload a PDF, image, or text file.`,
        },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No content could be extracted from the file.' },
        { status: 422 }
      );
    }

    const results = await processWithAI(extractedText, mode, imageDescriptions);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('process-upload error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key.' },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit reached. Please wait and try again.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process file. Please try again.' },
      { status: 500 }
    );
  }
}
