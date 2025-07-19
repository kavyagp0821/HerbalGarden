// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
// Keep quiz and tour data local for now as they are static.
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    // Directly return the static data instead of fetching from an API
    return Promise.resolve(initialPlants);
  },

  async getPlant(id: string): Promise<Plant | null> {
    const plant = initialPlants.find(p => p.id === id) || null;
    return Promise.resolve(plant);
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    // Map the string representation of the icon to the actual component
    const toursWithIcons = tourCategories.map(tour => ({
      ...tour,
      icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
    }));
    return Promise.resolve(toursWithIcons);
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      const tour = tourCategories.find(t => t.id === id);
      if (!tour) return Promise.resolve(null);
      
      const tourWithIcon = {
        ...tour,
        icon: lucideIconMapping[tour.icon as unknown as keyof typeof lucideIconMapping] || tour.icon
      };
      return Promise.resolve(tourWithIcon);
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const plants = initialPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plants);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static.
    return Promise.resolve(quizQuestions);
  },
};
