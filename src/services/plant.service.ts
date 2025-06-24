// src/services/plant.service.ts
import { db } from '@/lib/firebase';
import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    const plantsCol = collection(db, 'plants');
    const plantSnapshot = await getDocs(plantsCol);
    const plantList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
    return plantList;
  },

  async getPlant(id: string): Promise<Plant | null> {
    const plantRef = doc(db, 'plants', id);
    const plantSnap = await getDoc(plantRef);
    if (plantSnap.exists()) {
      return { id: plantSnap.id, ...plantSnap.data() } as Plant;
    } else {
      return null;
    }
  },
  
  async getTourCategories(): Promise<TourCategory[]> {
    const categoriesCol = collection(db, 'tourCategories');
    const categorySnapshot = await getDocs(categoriesCol);
    // Note: Lucide icons cannot be stored in Firestore. They are mapped back here.
    // We will retrieve them from the static data for now.
    const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourCategory));
    return categoryList;
  },

  async getTourCategory(id: string): Promise<TourCategory | null> {
      const categoryRef = doc(db, 'tourCategories', id);
      const categorySnap = await getDoc(categoryRef);
      if (categorySnap.exists()) {
          return { id: categorySnap.id, ...categorySnap.data() } as TourCategory;
      } else {
          return null;
      }
  },

  async getPlantsForTour(plantIds: string[]): Promise<Plant[]> {
    if (!plantIds || plantIds.length === 0) return [];
    const plantsCol = collection(db, 'plants');
    // Firestore 'in' query is limited to 30 items. 
    // For more, you'd need multiple queries.
    const q = query(plantsCol, where('__name__', 'in', plantIds));
    const plantSnapshot = await getDocs(q);
    const plantList = plantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
    return plantList;
  },
  
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    const questionsCol = collection(db, 'quizQuestions');
    const questionSnapshot = await getDocs(questionsCol);
    const questionList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizQuestion));
    return questionList;
  },
};
