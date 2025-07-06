// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
// Keep quiz and tour data local, as the focus of the change is on plants.
import { tourCategories, quizQuestions } from '@/lib/plant-data';

const BASE_URL = typeof window !== 'undefined' ? '/api' : 'http://localhost:9002/api';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    try {
      // The base URL needs to be absolute when fetching on the server side (e.g., during build).
      const res = await fetch(`${BASE_URL}/plants`, { next: { revalidate: 3600 } }); // Revalidate every hour
      if (!res.ok) {
        console.error('Failed to fetch plants:', res.statusText);
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
        console.error(`Failed to fetch plant with id: ${id}`, res.statusText);
        return null;
      }
      return res.json();
    } catch (error) {
      console.error(`Error fetching plant with id: ${id}:`, error);
      return null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    // This data remains static for now.
    return Promise.resolve(tourCategories);
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      const category = tourCategories.find(c => c.id === id) || null;
      return Promise.resolve(category);
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
