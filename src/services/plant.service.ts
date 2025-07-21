
// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper to decide whether to use Firestore or local data.
const shouldUseFirestore = () => db && db.app && db.app.options.apiKey;

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (shouldUseFirestore()) {
      try {
        const plantsCollection = collection(db, 'plants');
        const plantSnapshot = await getDocs(plantsCollection);
        // If Firestore is empty, fall back to initial local data.
        if (plantSnapshot.empty) {
          console.log("Firestore 'plants' collection is empty. Falling back to local data.");
          return initialPlants;
        }
        const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));
        return plantsList;
      } catch (error) {
        console.error("Error fetching plants from Firestore, falling back to local data:", error);
        return initialPlants; // Fallback on error
      }
    }
    // If Firebase is not configured, use local data.
    console.log("Firebase not configured. Using local plant data.");
    return initialPlants;
  },

  async getPlant(id: string): Promise<Plant | null> {
    if (shouldUseFirestore()) {
      try {
        const plantRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantRef);
        if (plantSnap.exists()) {
          return { id: plantSnap.id, ...plantSnap.data() } as Plant;
        }
        // If not found in Firestore, try finding it in the local data.
        console.log(`Plant with id "${id}" not found in Firestore. Checking local data.`);
      } catch (error) {
        console.error(`Error fetching plant ${id} from Firestore, falling back to local data:`, error);
        // Fall through to local data search on error
      }
    }
    // Fallback for unconfigured Firebase or if not found in DB
    const plant = initialPlants.find(p => p.id === id) || null;
    if (!plant) {
        console.warn(`Plant with id "${id}" not found anywhere.`);
    }
    return plant;
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    // Tour categories are static due to icon components, so we return local data.
    return Promise.resolve(tourCategories);
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
    const tour = tourCategories.find(t => t.id === id) || null;
    return Promise.resolve(tour);
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return Promise.resolve([]);
    const allPlants = await this.getPlants(); // Use getPlants to respect DB or local data
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },
};
