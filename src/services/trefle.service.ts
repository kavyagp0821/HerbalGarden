// src/services/trefle.service.ts
import type { TrefleSearchResponse } from '@/types';

const TREFLE_API_URL = 'https://trefle.io/api/v1';
const API_KEY = process.env.TREFLE_API_KEY;

if (!API_KEY || API_KEY === '<YOUR_TREFLE_API_KEY>') {
  console.warn('--- TREFLE API KEY WARNING ---');
  console.warn('TREFLE_API_KEY is not set in your .env file.');
  console.warn('The Trefle search feature will not work.');
  console.warn('Get a key from https://trefle.io/ and add it to your .env file.');
  console.warn('--- END WARNING ---');
}

export const trefleService = {
  async search(query: string): Promise<TrefleSearchResponse> {
    if (!API_KEY || API_KEY === '<YOUR_TREFLE_API_KEY>') {
      throw new Error('Trefle API key is not configured.');
    }

    try {
      const response = await fetch(`${TREFLE_API_URL}/plants/search?token=${API_KEY}&q=${query}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Trefle API request failed with status ${response.status}`);
      }

      const data: TrefleSearchResponse = await response.json();
      // Filter out results without an image URL for better display
      data.data = data.data.filter(plant => plant.image_url);
      return data;

    } catch (error) {
      console.error('Error fetching from Trefle API:', error);
      throw new Error('Failed to fetch data from Trefle API.');
    }
  },
};
