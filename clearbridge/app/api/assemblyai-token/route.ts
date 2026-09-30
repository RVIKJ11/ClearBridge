import { NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

// Mints a short-lived token so the browser can connect to the AssemblyAI
// Universal-Streaming WebSocket without ever seeing the raw API key.
export async function POST() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ASSEMBLYAI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const client = new AssemblyAI({ apiKey });
    const token = await client.streaming.createTemporaryToken({
      expires_in_seconds: 600,
    });
    return NextResponse.json({ token });
  } catch (error) {
    console.error('assemblyai-token error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create AssemblyAI session token.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
