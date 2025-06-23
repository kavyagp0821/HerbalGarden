
'use server';
/**
 * @fileOverview Implements an AI flow to recommend medicinal plants based on a user's health interest.
 *
 * - recommendPlants - A function that handles the plant recommendation process.
 * - RecommendPlantsInput - The input type for the recommendPlants function.
 * - RecommendPlantsOutput - The return type for the recommendPlants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { plants } from '@/lib/plant-data';

export const RecommendPlantsInputSchema = z.object({
  healthInterest: z.string().describe('A health interest or wellness goal provided by the user, e.g., "better sleep", "stress relief", "improving digestion".'),
});
export type RecommendPlantsInput = z.infer<typeof RecommendPlantsInputSchema>;

export const RecommendPlantsOutputSchema = z.object({
  recommendations: z.array(z.object({
    id: z.string().describe("The unique ID of the plant, matching the one from the provided list."),
    commonName: z.string().describe('The common name of the recommended plant.'),
    latinName: z.string().describe('The Latin name of the recommended plant.'),
    reason: z.string().describe('A brief explanation of why this plant is recommended for the user\'s health interest.'),
  })).describe('A list of recommended plants. Return up to 3 plants.'),
});
export type RecommendPlantsOutput = z.infer<typeof RecommendPlantsOutputSchema>;

export async function recommendPlants(input: RecommendPlantsInput): Promise<RecommendPlantsOutput> {
  return recommendPlantsFlow(input);
}

// Convert the plant data to a simplified JSON string for the prompt
const plantInfoForPrompt = JSON.stringify(plants.map(p => ({
    id: p.id,
    commonName: p.commonName,
    latinName: p.latinName,
    therapeuticUses: p.therapeuticUses,
    ayushUses: p.ayushUses
})));

const recommendationPrompt = ai.definePrompt({
  name: 'plantRecommendationPrompt',
  input: {schema: RecommendPlantsInputSchema},
  output: {schema: RecommendPlantsOutputSchema},
  prompt: `You are an expert in AYUSH medicinal plants. A user is looking for plants related to a specific health interest.
Based on the user's interest, recommend up to 3 plants from the list provided below.

For each recommendation, you MUST provide the plant's id, commonName, and latinName exactly as they appear in the list.
Also, provide a concise, user-friendly reason explaining why the plant is a good match for their interest, based on its therapeutic uses.

User's health interest: {{{healthInterest}}}

List of available plants:
${plantInfoForPrompt}

Format your response as a JSON object matching the output schema.
`,
});

const recommendPlantsFlow = ai.defineFlow(
  {
    name: 'recommendPlantsFlow',
    inputSchema: RecommendPlantsInputSchema,
    outputSchema: RecommendPlantsOutputSchema,
  },
  async (input) => {
    const {output} = await recommendationPrompt(input);
    return output!;
  }
);
