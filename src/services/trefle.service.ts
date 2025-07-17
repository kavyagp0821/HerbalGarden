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
    console.error('Error in trefleService.search:', error);
    throw error;
  }
}

async function listPlants(): Promise<TreflePlant[]> {
    try {
        // We call the same API route, but without the `q` parameter
        const response = await fetch(`/api/trefle/search`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Trefle API error:', errorData.message);
            throw new Error(errorData.message || 'Failed to list plants from Trefle API');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in trefleService.list:', error);
        // Return empty array on failure so the page can still render
        return [];
    }
}


export const trefleService = {
  search: searchTrefle,
  list: listPlants,
};
