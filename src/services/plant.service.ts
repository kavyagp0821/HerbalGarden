// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
// Keep quiz and tour data local, as the focus of the change is on plants.
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

// Use an absolute URL for server-side fetching, and a relative one for client-side.
// The `typeof window` check determines if the code is running in the browser or on the server.
const BASE_URL = typeof window !== 'undefined' 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api` : 'http://localhost:9002/api');


export const plantService = {
  async getPlants(): Promise<Plant[]> {
    try {
      // The base URL needs to be absolute when fetching on the server side (e.g., during build).
      const res = await fetch(`${BASE_URL}/plants`, { next: { revalidate: 3600 } }); // Revalidate every hour
      if (!res.ok) {
        // Log the detailed error message from the API if available
        const errorBody = await res.text();
        console.error(`Failed to fetch plants: ${res.status} ${res.statusText}`, errorBody);
        return [];
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching plants:', error);
      return [];
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
    try {
      const res = await fetch(`${BASE_URL}/plants/${id}`, { next: { revalidate: 3600 } }); // Revalidate every hour
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        const errorBody = await res.text();
        console.error(`Failed to fetch plant with id: ${id}: ${res.status} ${res.statusText}`, errorBody);
        return null;
      }
      return res.json();
    } catch (error) {
      console.error(`Error fetching plant with id: ${id}:`, error);
      return null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    try {
      const res = await fetch(`${BASE_URL}/tours`, { next: { revalidate: 3600 }});
      if (!res.ok) throw new Error("Failed to fetch tour categories");
      const tours = await res.json();
      
      // Map the icon string from the response to the actual Lucide icon component
      return tours.map((tour: any) => ({
        ...tour,
        icon: lucideIconMapping[tour.icon as keyof typeof lucideIconMapping]
      }));

    } catch (error) {
      console.error("Error fetching tour categories", error);
      return [];
    }
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      try {
        const res = await fetch(`${BASE_URL}/tours/${id}`, { next: { revalidate: 3600 }});
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
    // This is less efficient as it fetches all plants first.
    // A future optimization could be an API endpoint like `/api/plants?ids=id1,id2`.
    const allPlants = await this.getPlants();
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // This data remains static for now.
    return Promise.resolve(quizQuestions);
  },
};
