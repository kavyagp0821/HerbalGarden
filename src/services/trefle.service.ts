// src/services/trefle.service.ts
import type { TreflePlant } from '@/types';

// Use an absolute URL for server-side fetching, and a relative one for client-side.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path for API calls
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel deployment
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return 'http://localhost:9002'; // Local development
};


async function searchTrefle(query: string): Promise<TreflePlant[]> {
  if (!query) return [];
  try {
    const response = await fetch(`${getBaseUrl()}/api/trefle/search?q=${encodeURIComponent(query)}`);
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

export const trefleService = {
  search: searchTrefle,
};
