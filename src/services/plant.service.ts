// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { collection, getDocs, getDoc, doc, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper to decide whether to use Firestore.
const shouldUseFirestore = () => db && db.app && db.app.options.apiKey;

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (shouldUseFirestore()) {
      try {
        const plantsCollection = collection(db, 'plants');
        const plantSnapshot = await getDocs(plantsCollection);
        if (!plantSnapshot.empty) {
            const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
            plantsList.forEach(p => {
              if (p.commonName) {
                p.commonName = p.commonName.charAt(0).toUpperCase() + p.commonName.slice(1);
              }
            });
            plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));
            return plantsList;
        }
      } catch (error) {
        console.error("Error fetching plants from Firestore, falling back to local data:", error);
      }
    }
    
    // Fallback to local data
    console.log("Using local mock data for plants.");
    return Promise.resolve(initialPlants);
  },

  async getPlant(id: string): Promise<Plant | null> {
    if (shouldUseFirestore()) {
      try {
        const plantRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantRef);
        if (plantSnap.exists()) {
          const plantData = { id: plantSnap.id, ...plantSnap.data() } as Plant;
           if (plantData.commonName) {
            plantData.commonName = plantData.commonName.charAt(0).toUpperCase() + plantData.commonName.slice(1);
          }
          return plantData;
        }
      } catch (error) {
         console.error(`Error fetching plant ${id} from Firestore, falling back to local data:`, error);
      }
    }
    
    // Fallback to local data
    const localPlant = initialPlants.find(p => p.id === id) || null;
    if (localPlant) {
        console.log(`Found plant with id "${id}" in local data.`);
    } else {
        console.warn(`Plant with id "${id}" not found in Firestore or local data.`);
    }
    return Promise.resolve(localPlant);
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    // Tour categories are static due to icon components, so we return local data.
    return Promise.resolve(tourCategories.map(t => ({...t, icon: t.icon as any})));
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
    const tourData = tourCategories.find(t => t.id === id) || null;
    if (!tourData) return null;
    return Promise.resolve({...tourData, icon: tourData.icon as any });
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    const allPlants = await this.getPlants(); // This will use Firestore or fallback to local
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },

  async findPlantByCommonName(commonName: string): Promise<Plant | null> {
     // This will check firestore first, then local data via getPlants()
     const allPlants = await this.getPlants();
     return allPlants.find(p => p.commonName.toLowerCase() === commonName.toLowerCase()) || null;
  }
};
