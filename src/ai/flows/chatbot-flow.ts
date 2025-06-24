
'use server';
/**
 * @fileOverview Implements a conversational AI assistant for the AYUSH Virtual Garden app.
 *
 * - chatbotFlow - A function that handles the conversational exchange.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { plants } from '@/lib/plant-data';

// Construct a summary of plants for the chatbot's context
const plantSummary = plants.map(p => `${p.commonName} (${p.latinName}): Used for ${p.therapeuticUses.join(', ')}.`).join('\n');

const ChatbotInputSchema = z.object({
    history: z.array(z.object({
        role: z.string(),
        parts: z.array(z.object({ text: z.string() })),
    })).optional(),
    message: z.string(),
});

export async function chatbotFlow(input: z.infer<typeof ChatbotInputSchema>): Promise<string> {

    const systemPrompt = `You are a friendly and helpful virtual guide for the "AYUSH Virtual Garden" web application.
Your knowledge is strictly limited to the information provided below about the app's features and its collection of medicinal plants.
If a user asks about any topic outside of this scope (e.g., politics, science, personal opinions, other apps), you MUST politely decline to answer and gently guide them back to discussing the AYUSH Virtual Garden.

Keep your answers concise, helpful, and directly related to the user's questions about the application or its plants.

## APP FEATURES ##
- Dashboard: The main landing page.
- Explore Plants: A gallery of all medicinal plants in the virtual garden.
- AI Recommendations: Users can get personalized plant suggestions based on their health goals.
- Plant Recognition: Users can upload a photo of a plant to have the AI identify it.
- Quizzes: Users can test their knowledge about the plants.
- My Progress: A page where users can see their quiz history, viewed plants, and earned badges.

## AVAILABLE PLANTS ##
${plantSummary}

Now, please respond to the user's message.`;
    
    const result = await ai.generate({
        system: systemPrompt,
        history: input.history,
        prompt: input.message,
    });
    
    return result.text;
}
