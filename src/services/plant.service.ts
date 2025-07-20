// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

// This service now uses local data exclusively.

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    console.log("Fetching plants from local data.");
    // Sort plants alphabetically by common name
    const sortedPlants = [...initialPlants].sort((a, b) => a.commonName.localeCompare(b.commonName));
    return Promise.resolve(sortedPlants as Plant[]);
  },

  async getPlant(id: string): Promise<Plant | null> {
    console.log(`Fetching plant ${id} from local data.`);
    const plant = initialPlants.find(p => p.id === id) || null;
    return Promise.resolve(plant as Plant | null);
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    console.log("Fetching tour categories from local data.");
    try {
      const tours = tourCategories.map(tour => {
        const { icon, ...rest } = tour;
        const iconName = (icon as any).displayName || (icon as any).name || 'Leaf';
        return {
          ...rest,
          icon: iconName,
        };
      });
      return Promise.resolve(tours as TourCategory[]);
    } catch (e) {
        console.error('Failed to load local tour categories', e);
        return Promise.resolve([]);
    }
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
    console.log(`Fetching tour category ${id} from local data.`);
    try {
      const tour = tourCategories.find(t => t.id === id);
      if (!tour) return Promise.resolve(null);
      
      const { icon, ...rest } = tour;
      const iconName = (icon as any).displayName || (icon as any).name || 'Leaf';

      const tourWithIconName = {
        ...rest,
        icon: iconName,
      };
      return Promise.resolve(tourWithIconName as TourCategory);
    } catch(e) {
      console.error(`Failed to fetch local tour category ${id}`, e);
      return Promise.resolve(null);
    }
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    console.log("Fetching plants for tour from local data.");
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const plantsInTour = initialPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour as Plant[]);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    console.log("Fetching quiz questions from local data.");
    return Promise.resolve(quizQuestions);
  },
};
