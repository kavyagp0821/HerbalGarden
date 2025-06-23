
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (process.env.NODE_ENV !== 'test') {
  // Enhanced logging for debugging purposes
  console.log('======================================================================');
  console.log('  Checking for Gemini API Key...');
  if (apiKey) {
    console.log('  ✅ API Key found successfully.');
  } else {
    console.warn('\n  🔴🔴🔴 WARNING: Gemini API Key is NOT configured! 🔴🔴🔴\n');
    console.warn('  The AYUSH Virtual Garden AI features will fail.');
    console.warn('  To fix this, please follow these steps carefully:');
    console.warn('  1. In the project root directory, create a file named exactly .env');
    console.warn('  2. Add this line to it: GEMINI_API_KEY=YOUR_ACTUAL_API_KEY');
    console.warn('  3. Get a key from Google AI Studio: https://aistudio.google.com/app/apikey');
    console.warn('  4. IMPORTANT: You MUST restart your development server after editing the .env file.\n');
  }
  console.log('======================================================================');
}


export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
