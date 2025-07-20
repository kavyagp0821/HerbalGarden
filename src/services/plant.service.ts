// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion, TreflePlant } from '@/types';
// Keep quiz and tour data local for now as they are static.
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

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
    return fetchFromApi<Plant[]>('/api/plants');
  },

  async getPlant(id: string): Promise<Plant | null> {
    try {
        return await fetchFromApi<Plant>(`/api/plants/${id}`);
    } catch(e) {
        if (e instanceof Error && e.message.includes('404')) {
            return null;
        }
        console.error(`Failed to fetch plant ${id}`, e);
        return null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    try {
        const tours = await fetchFromApi<TourCategory[]>('/api/tours');
         // Map the string representation of the icon to the actual component
        return tours.map(tour => ({
          ...tour,
          icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
        }));
    } catch (e) {
        console.error('Failed to fetch tour categories', e);
        return [];
    }
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      try {
        const tour = await fetchFromApi<TourCategory>(`/api/tours/${id}`);
        if (!tour) return null;
        
        return {
          ...tour,
          icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
        };
      } catch(e) {
        console.error(`Failed to fetch tour category ${id}`, e);
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