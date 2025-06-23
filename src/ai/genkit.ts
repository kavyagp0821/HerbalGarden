
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'test') {
  console.warn(
    '\n🔴🔴🔴 WARNING: Gemini API Key is missing! 🔴🔴🔴\n' +
    'The AYUSH Virtual Garden plant recognition feature will likely fail.\n' +
    'Please ensure you have a .env file in the root of your project containing:\n\n' +
    '  GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE\n\n' +
    'You can obtain a key from Google AI Studio: https://aistudio.google.com/app/apikey\n' +
    'After adding the key to your .env file, you MUST restart your development server.\n'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
