// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (!db.app) {
        console.warn("Firestore not configured. No plants can be fetched.");
        return Promise.resolve([]);
    }
    
    try {
        const plantsCollection = collection(db, 'plants');
        const plantSnapshot = await getDocs(plantsCollection);
        if (plantSnapshot.empty) {
            console.log("No plants found in Firestore. The database might be empty.");
            return [];
        }
        const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));
        return plantsList;
    } catch (error) {
        console.error("Error fetching plants from Firestore:", error);
        return [];
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
     if (!db.app) {
        console.warn("Firestore not configured. Cannot fetch plant.");
        return Promise.resolve(null);
    }
     try {
        const plantRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantRef);
        return plantSnap.exists() ? { id: plantSnap.id, ...plantSnap.data() } as Plant : null;
    } catch (error) {
        console.error(`Error fetching plant ${id} from Firestore:`, error);
        return null;
    }
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
    
    // Find plants from Firestore that match the IDs for the tour.
    // The `plantIds` in `plant-data.ts` should be the common name slugs (e.g., 'tulsi')
    // after the seeding script has run. We match by `id`.
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },
};
