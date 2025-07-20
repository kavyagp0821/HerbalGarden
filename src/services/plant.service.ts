// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion, TreflePlant } from '@/types';
// Keep quiz and tour data local for now as they are static.
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';
import { trefleService } from './trefle.service';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    // Directly return the static data instead of fetching from an API
    return Promise.resolve(initialPlants);
  },

  async getPlant(id: string): Promise<Plant | null> {
    const plant = initialPlants.find(p => p.id === id) || null;
    if (plant) {
        return Promise.resolve(plant);
    }
    // Fallback to searching Trefle if not in initial data
    const treflePlants = await trefleService.search(id.replace('-', ' '));
    if (treflePlants.length > 0) {
        const treflePlant = treflePlants[0];
        // Adapt TreflePlant to Plant
        return {
            id: String(treflePlant.id),
            commonName: treflePlant.common_name || treflePlant.scientific_name,
            latinName: treflePlant.scientific_name,
            description: `A plant from the family ${treflePlant.family}, genus ${treflePlant.genus}.`,
            therapeuticUses: ['Medicinal'], // Default value
            region: 'Global',
            classification: `${treflePlant.family} / ${treflePlant.genus}`,
            imageSrc: treflePlant.image_url || `https://placehold.co/600x400.png`,
            imageHint: treflePlant.common_name || treflePlant.scientific_name,
            ayushUses: "To be determined."
        }
    }
    return Promise.resolve(null);
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