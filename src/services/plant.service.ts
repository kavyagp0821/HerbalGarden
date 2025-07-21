
// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper to decide whether to use Firestore.
const shouldUseFirestore = () => db && db.app && db.app.options.apiKey;

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (!shouldUseFirestore()) {
        console.warn("Firebase not configured. Plant service will not fetch data.");
        return [];
    }
    
    try {
        const plantsCollection = collection(db, 'plants');
        const plantSnapshot = await getDocs(plantsCollection);
        if (plantSnapshot.empty) {
            console.log("Firestore 'plants' collection is empty. Run the seeding process at /api/fetch-and-seed.");
            return [];
        }
        const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));
        return plantsList;
    } catch (error) {
        console.error("Error fetching plants from Firestore:", error);
        return []; // Return empty array on error
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
    if (!shouldUseFirestore()) {
        console.warn("Firebase not configured. Plant service will not fetch data.");
        return null;
    }
      
    try {
        const plantRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantRef);
        if (plantSnap.exists()) {
          return { id: plantSnap.id, ...plantSnap.data() } as Plant;
        }
        console.warn(`Plant with id "${id}" not found in Firestore.`);
        return null;
    } catch (error) {
        console.error(`Error fetching plant ${id} from Firestore:`, error);
        return null;
    }
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
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const allPlants = await this.getPlants(); // Use getPlants to respect DB
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },
};
