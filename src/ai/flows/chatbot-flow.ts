
'use server';
/**
 * @fileOverview Implements a conversational AI assistant for the AYUSH Virtual Garden app.
 *
 * - chatbotFlow - A function that handles the conversational exchange.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { plants } from '@/lib/plant-data';
import { geminiPro } from '@genkit-ai/googleai';

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

    const prompt = `You are a friendly and helpful virtual guide for the "AYUSH Virtual Garden" web application.
Your goal is to assist users and answer their questions about the app and the medicinal plants it features.

Keep your answers concise and helpful.

The app has the following features:
- Dashboard: The main landing page.
- Explore Plants: A gallery of all medicinal plants in the virtual garden.
- AI Recommendations: Users can get personalized plant suggestions based on their health goals.
- Plant Recognition: Users can upload a photo of a plant to have the AI identify it.
- Quizzes: Users can test their knowledge about the plants.
- My Progress: A page where users can see their quiz history, viewed plants, and earned badges.

Here is a list of plants available in the garden:
${plantSummary}

Now, please respond to the user's message.`;
    
    const llm = ai.model('googleai/gemini-1.5-flash-latest');

    const result = await llm.generate({
        system: prompt,
        history: input.history,
        prompt: input.message,
    });
    
    return result.text;
}
