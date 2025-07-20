// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
// Keep quiz and tour data local for now as they are static.
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

const areFirebaseCredsAvailable = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

async function fetchFromApi<T>(url: string): Promise<T> {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // Browser should use relative path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002'; // Local development
  };
  
  const response = await fetch(`${getBaseUrl()}${url}`);
  
  if (!response.ok) {
    let errorMessage = `API call failed with status ${response.status}`;
    try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // Ignore if response body is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (!areFirebaseCredsAvailable) {
        console.warn("Firebase not configured, falling back to local data.");
        return [...initialPlants].sort((a, b) => a.commonName.localeCompare(b.commonName));
    }
    try {
        return await fetchFromApi<Plant[]>('/api/plants');
    } catch (error) {
        console.error("API fetch failed, falling back to local data:", error);
        return [...initialPlants].sort((a, b) => a.commonName.localeCompare(b.commonName));
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
    if (!areFirebaseCredsAvailable) {
        console.warn(`Firebase not configured, fetching plant ${id} from local data.`);
        return initialPlants.find(p => p.id === id) || null;
    }
    try {
        return await fetchFromApi<Plant>(`/api/plants/${id}`);
    } catch(e) {
        console.warn(`API fetch for plant ${id} failed, falling back to local data:`, e);
        if (e instanceof Error && e.message.includes('404')) {
            return null;
        }
        return initialPlants.find(p => p.id === id) || null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    // Tours are static and don't require Firebase for this version.
    try {
      return tourCategories.map(tour => ({
        ...tour,
        icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
      }));
    } catch (e) {
        console.error('Failed to load local tour categories', e);
        return [];
    }
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
    // Tours are static and don't require Firebase for this version.
      try {
        const tour = tourCategories.find(t => t.id === id);
        if (!tour) return null;
        
        return {
          ...tour,
          icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
        };
      } catch(e) {
        console.error(`Failed to fetch local tour category ${id}`, e);
        return null;
      }
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const allPlants = await this.getPlants();
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return plantsInTour;
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static for this app version.
    return Promise.resolve(quizQuestions);
  },
};
