// src/ai/flows/recognize-plant.ts
'use server';
/**
 * @fileOverview Implements plant recognition using an image provided by the user.  It identifies the plant and provides
 *  information about its medicinal properties and uses in AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy).
 *
 * - recognizePlant - A function that handles the plant recognition process.
 * - RecognizePlantInput - The input type for the recognizePlant function.
 * - RecognizePlantOutput - The return type for the recognizePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizePlantInput = z.infer<typeof RecognizePlantInputSchema>;

const RecognizePlantOutputSchema = z.object({
  identification: z.object({
    commonName: z.string().describe('The common name of the identified plant.'),
    latinName: z.string().describe('The Latin name of the identified plant.'),
    ayushUses: z
      .string()
      .describe('The medicinal properties and uses of the plant in AYUSH.'),
  }),
});
export type RecognizePlantOutput = z.infer<typeof RecognizePlantOutputSchema>;

export async function recognizePlant(input: RecognizePlantInput): Promise<RecognizePlantOutput> {
  return recognizePlantFlow(input);
}

const plantRecognitionPrompt = ai.definePrompt({
  name: 'plantRecognitionPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: RecognizePlantInputSchema},
  output: {schema: RecognizePlantOutputSchema},
  prompt: `You are an expert in identifying plants and their uses in AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy).

  Given the following image of a plant, identify the plant (give both the common and latin name) and describe its medicinal properties and uses in AYUSH.

  Photo: {{media url=photoDataUri}}

  Format your output as a JSON object matching the schema.`,
});

const recognizePlantFlow = ai.defineFlow(
  {
    name: 'recognizePlantFlow',
    inputSchema: RecognizePlantInputSchema,
    outputSchema: RecognizePlantOutputSchema,
  },
  async input => {
    const {output} = await plantRecognitionPrompt(input);
    return output!;
  }
);
