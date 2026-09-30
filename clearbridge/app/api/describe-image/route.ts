import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildImageDescriptionPrompt } from '@/lib/ai/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

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

    const description = response.choices[0]?.message?.content ?? 'Could not generate image description.';

    return NextResponse.json({ description });
  } catch (error) {
    console.error('describe-image error:', error);
    return NextResponse.json(
      { error: 'Failed to describe image.' },
      { status: 500 }
    );
  }
}
