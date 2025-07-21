
'use server';
/**
 * @fileOverview Implements a Text-to-Speech (TTS) flow specifically for audio on plant cards.
 *
 * - cardAudioFlow - Converts a string of text into playable audio data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// Input schema for the TTS flow, expecting a plant ID and the text to speak.
const CardAudioInputSchema = z.object({
  plantId: z.string(),
  textToSpeak: z.string(),
});
export type CardAudioInput = z.infer<typeof CardAudioInputSchema>;

// Output schema for the TTS flow, returning the audio as a data URI string.
const CardAudioOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI, e.g., 'data:audio/wav;base64,...'"),
});
export type CardAudioOutput = z.infer<typeof CardAudioOutputSchema>;

/**
 * Converts raw PCM audio buffer to a Base64-encoded WAV string.
 */
async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

// This flow is now only called from the server-side API route.
export const cardAudioFlow = ai.defineFlow(
  {
    name: 'cardAudioFlow',
    inputSchema: CardAudioInputSchema,
    outputSchema: CardAudioOutputSchema,
  },
  async ({ textToSpeak }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A pleasant, clear voice
          },
        },
      },
      prompt: textToSpeak,
    });

    if (!media) {
      throw new Error('No audio media was generated.');
    }

    // The audio data is a base64 string within the data URI. We need to extract it.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    // Convert the raw PCM audio to a proper WAV format.
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
