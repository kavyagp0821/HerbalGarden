// src/services/trefle.service.ts
import type { TreflePlant } from '@/types';

async function searchTrefle(query: string): Promise<TreflePlant[]> {
  if (!query) return [];
  try {
    const response = await fetch(`/api/trefle/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Trefle API error:', errorData.message);
      throw new Error(errorData.message || 'Failed to fetch data from Trefle API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in trefleService:', error);
    throw error;
  }
}

export const trefleService = {
  search: searchTrefle,
};
