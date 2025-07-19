// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
// Keep quiz and tour data local for now as they are static.
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

// Use an absolute URL for server-side fetching, and a relative one for client-side.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '/api'; // Browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`; // Vercel deployment
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
  return 'http://localhost:9002/api'; // Local development
};

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/plants`, { 
        cache: 'no-store', // Always fetch latest data from Firestore
      });
      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Failed to fetch plants: ${res.status} ${res.statusText}`, { body: errorBody });
        return [];
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching plants service:', error);
      return [];
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
    try {
      const res = await fetch(`${getBaseUrl()}/plants/${id}`, { next: { revalidate: 3600 } });
      if (!res.ok) {
        if (res.status === 404) return null;
        const errorBody = await res.text();
        console.error(`Failed to fetch plant with id: ${id}: ${res.status} ${res.statusText}`, { body: errorBody });
        return null;
      }
      return res.json();
    } catch (error) {
      console.error(`Error fetching plant service with id: ${id}:`, error);
      return null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    try {
      // This data remains static for now, so we can fetch it via API or use it directly.
      const res = await fetch(`${getBaseUrl()}/tours`, { next: { revalidate: 3600 }});
      if (!res.ok) throw new Error("Failed to fetch tour categories");
      const tours = await res.json();
      
      // Map the string representation of the icon to the actual component
      return tours.map((tour: any) => ({
        ...tour,
        icon: lucideIconMapping[tour.icon as keyof typeof lucideIconMapping]
      }));

    } catch (error) {
      console.error("Error fetching tour categories", error);
      // Fallback to local data if API fails
      return tourCategories;
    }
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      try {
        const res = await fetch(`${getBaseUrl()}/tours/${id}`, { next: { revalidate: 3600 }});
        if (!res.ok) return null;
        const tour = await res.json();
        return {
          ...tour,
          icon: lucideIconMapping[tour.icon as keyof typeof lucideIconMapping]
        }
      } catch (error) {
        console.error(`Error fetching tour category with id: ${id}`, error);
        return null;
      }
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    try {
      const allPlants = await this.getPlants();
      return allPlants.filter(plant => plantIds.includes(plant.id));
    } catch (error) {
      console.error("Error fetching plants for tour", error);
      return [];
    }
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static for now.
    return Promise.resolve(quizQuestions);
  },
};
