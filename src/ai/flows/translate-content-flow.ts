'use server';
/**
 * @fileOverview Implements a text translation flow using Genkit.
 *
 * - translateContent - Translates text to a specified target language.
 * - TranslateContentInput - The input type for the translation flow.
 * - TranslateContentOutput - The return type for the translation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateContentInputSchema = z.object({
  content: z.string().describe('The text content to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "Hindi").'),
});
export type TranslateContentInput = z.infer<typeof TranslateContentInputSchema>;

const TranslateContentOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateContentOutput = z.infer<typeof TranslateContentOutputSchema>;

export async function translateContent(input: TranslateContentInput): Promise<TranslateContentOutput> {
  return translateContentFlow(input);
}

const translationPrompt = ai.definePrompt({
    name: 'translationPrompt',
    input: { schema: TranslateContentInputSchema },
    output: { schema: TranslateContentOutputSchema },
    prompt: `Translate the following text to {{targetLanguage}}.

    Text to translate:
    "{{content}}"

    Return only the translated text.`,
});


const translateContentFlow = ai.defineFlow(
  {
    name: 'translateContentFlow',
    inputSchema: TranslateContentInputSchema,
    outputSchema: TranslateContentOutputSchema,
  },
  async (input) => {
    const { output } = await translationPrompt(input);
    return output!;
  }
);
