// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { collection, getDocs, getDoc, doc, query, where, limit } from 'firebase/firestore';
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
        // Capitalize common name for display
        plantsList.forEach(p => {
          if (p.commonName) {
            p.commonName = p.commonName.charAt(0).toUpperCase() + p.commonName.slice(1);
          }
        });
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
          const plantData = { id: plantSnap.id, ...plantSnap.data() } as Plant;
          // Capitalize common name for display
          if (plantData.commonName) {
            plantData.commonName = plantData.commonName.charAt(0).toUpperCase() + plantData.commonName.slice(1);
          }
          return plantData;
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

  async getPlantsForTour(plantNames: string[]): Promise<Plant[]> {
    if (!shouldUseFirestore() || !plantNames || plantNames.length === 0) {
      return Promise.resolve([]);
    }
    const allPlants = await this.getPlants(); // Use getPlants to respect DB and transformations
    // Filter plants whose common name (in lowercase) is in the plantNames array
    const plantsInTour = allPlants.filter(plant => plantNames.includes(plant.commonName.toLowerCase()));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },

  async findPlantByCommonName(commonName: string): Promise<Plant | null> {
    if (!shouldUseFirestore()) return null;
    try {
        const q = query(collection(db, "plants"), where("commonName", "==", commonName.toLowerCase()), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Plant;
        }
        return null;
    } catch (error) {
        console.error(`Error finding plant by name ${commonName}:`, error);
        return null;
    }
  }
};
