
// src/app/api/tts/route.ts
import { NextResponse } from 'next/server';
import { cardAudioFlow } from '@/ai/flows/card-audio-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plantId, textToSpeak } = body;

    if (!plantId || !textToSpeak) {
      return NextResponse.json({ error: 'Missing plantId or textToSpeak' }, { status: 400 });
    }

    const result = await cardAudioFlow({ plantId, textToSpeak });
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in TTS API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to generate audio: ${errorMessage}` }, { status: 500 });
  }
}
