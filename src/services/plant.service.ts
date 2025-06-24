// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { plants, tourCategories, quizQuestions } from '@/lib/plant-data';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    // Simulate async operation
    return Promise.resolve(plants);
  },

  async getPlant(id: string): Promise<Plant | null> {
    const plant = plants.find(p => p.id === id) || null;
    return Promise.resolve(plant);
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    return Promise.resolve(tourCategories);
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      const category = tourCategories.find(c => c.id === id) || null;
      return Promise.resolve(category);
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const plantsInTour = plants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return Promise.resolve(quizQuestions);
  },
};
