// src/services/plant.service.ts
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { initialPlants } from '@/lib/initial-plant-data';
import { tourCategories, quizQuestions } from '@/lib/plant-data';
import { lucideIconMapping } from '@/lib/icon-mapping';
import { collection, getDocs, getDoc, doc, query, where, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This flag prevents re-seeding on every hot reload in development
let isSeeding = false;
let hasSeeded = false;

// --- Seeding Logic for Firestore ---
async function seedDatabase() {
    if (isSeeding || hasSeeded) return;
    if (!db.app) { // Check if db is a valid Firestore instance
        console.log("Firestore not configured, skipping database seeding.");
        return;
    }
    isSeeding = true;
    console.log("Checking if database needs seeding...");

    try {
        const metaRef = doc(db, 'meta', 'seeded');
        const metaSnap = await getDoc(metaRef);
        
        if (metaSnap.exists()) {
            console.log("Database has already been seeded.");
            hasSeeded = true;
            isSeeding = false;
            return;
        }

        console.log("Seeding database with initial plant data...");
        const batch = writeBatch(db);
        
        initialPlants.forEach((plant) => {
            const plantRef = doc(db, 'plants', plant.id);
            const plantWithTimestamp = {
                ...plant,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            batch.set(plantRef, plantWithTimestamp);
        });

        // Set the seeding flag in Firestore
        batch.set(metaRef, { status: true, seededAt: serverTimestamp() });
        
        await batch.commit();
        console.log("Database seeded successfully!");
        hasSeeded = true;
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        isSeeding = false;
    }
}

// Automatically try to seed the database when the service is initialized
seedDatabase();


export const plantService = {
  async getPlants(): Promise<Plant[]> {
    if (!db.app) {
        console.warn("Firestore not configured. Returning local data.");
        return Promise.resolve(initialPlants as Plant[]);
    }
    
    try {
        const plantsCollection = collection(db, 'plants');
        const plantSnapshot = await getDocs(plantsCollection);
        if (plantSnapshot.empty) {
            console.log("No plants found in Firestore, returning local fallback.");
            return initialPlants as Plant[];
        }
        const plantsList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        plantsList.sort((a, b) => a.commonName.localeCompare(b.commonName));
        return plantsList;
    } catch (error) {
        console.error("Error fetching plants from Firestore, returning local data:", error);
        return initialPlants as Plant[];
    }
  },

  async getPlant(id: string): Promise<Plant | null> {
     if (!db.app) {
        console.warn("Firestore not configured. Returning local data.");
        return Promise.resolve(initialPlants.find(p => p.id === id) as Plant || null);
    }
     try {
        const plantRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantRef);
        return plantSnap.exists() ? { id: plantSnap.id, ...plantSnap.data() } as Plant : null;
    } catch (error) {
        console.error(`Error fetching plant ${id} from Firestore, returning local data:`, error);
        return initialPlants.find(p => p.id === id) as Plant || null;
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
    const plantsInTour = allPlants.filter(plant => plantIds.includes(plant.id));
    return Promise.resolve(plantsInTour);
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    // Quiz questions are static, so we return local data.
    return Promise.resolve(quizQuestions);
  },
};
