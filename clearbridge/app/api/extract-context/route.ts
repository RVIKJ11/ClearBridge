import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildImageDescriptionPrompt } from '@/lib/ai/prompts';
import type { FileType } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractPDFText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfModule: any = await import('pdf-parse');
  const pdfParse = pdfModule.default ?? pdfModule;
  const data = await pdfParse(buffer);
  return data.text;
}

async function describeImageForContext(
  imageBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
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

  const description =
    response.choices[0]?.message?.content ??
    'Image description could not be generated.';

  return `[Image: ${filename}]\n${description}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

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
    let extractedContent = '';
    let fileType: FileType = 'unknown';

    if (mimeType === 'application/pdf') {
      fileType = 'pdf';
      try {
        extractedContent = await extractPDFText(file);
        if (!extractedContent.trim()) {
          return NextResponse.json(
            {
              error:
                'Could not extract text from this PDF. It may be a scanned image. Try uploading it as an image instead.',
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
      fileType = 'image';
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      extractedContent = await describeImageForContext(buffer, mimeType, filename);
    } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
      fileType = 'text';
      extractedContent = await file.text();
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file type. Please upload a PDF, image (JPG, PNG, WebP, GIF), or text file.`,
        },
        { status: 400 }
      );
    }

    if (!extractedContent.trim()) {
      return NextResponse.json(
        { error: 'No content could be extracted from the file.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ extractedContent, fileType });
  } catch (error) {
    console.error('extract-context error:', error);

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
      { error: 'Failed to extract content. Please try again.' },
      { status: 500 }
    );
  }
}
