// src/services/trefle.service.ts
import type { TreflePlant } from '@/types';

// Use an absolute URL for server-side fetching, and a relative one for client-side.
const BASE_URL = typeof window !== 'undefined' 
    ? '' 
    : (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002');


async function searchTrefle(query: string): Promise<TreflePlant[]> {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/api/trefle/search?q=${encodeURIComponent(query)}`);
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
        const response = await fetch(`${BASE_URL}/api/trefle/search`);
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
