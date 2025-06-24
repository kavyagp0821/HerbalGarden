
// IMPORTANT: Plant data is now fetched from Firebase Firestore.
// This file is kept as a reference for data structures and for providing
// static data like icons that cannot be stored in Firestore.

import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { Leaf, ShieldHalf, Activity, Brain, Users, Sparkles, Filter, Wind, Sun, HeartPulse, Soup } from 'lucide-react';

// This array is now empty. Data is in Firestore "plants" collection.
export const plants: Plant[] = [];

// This array is now empty. Data is in Firestore "quizQuestions" collection.
export const quizQuestions: QuizQuestion[] = [];

// We keep this static data here because Lucide icons (functions) cannot be stored in Firestore.
// The tour data will be fetched from Firestore, and then the icon will be mapped from this list.
export const tourCategories: TourCategory[] = [
  {
    id: 'immunity-boosters',
    name: 'Immunity Boosters',
    description: 'Explore plants renowned for strengthening the immune system.',
    icon: ShieldHalf,
    plantIds: ['tulsi', 'amla', 'giloy', 'moringa'],
    imageSrc: 'https://images.unsplash.com/photo-1579113800035-7a0342a43f11?q=80&w=400&auto=format&fit=crop',
    imageHint: 'immune system'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    description: 'Discover herbs that help calm the mind and reduce stress.',
    icon: Activity,
    plantIds: ['tulsi', 'ashwagandha', 'brahmi', 'vetiver', 'sandalwood', 'lemongrass'],
    imageSrc: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop',
    imageHint: 'calm meditation'
  },
  {
    id: 'cognitive-enhancers',
    name: 'Cognitive Enhancers',
    description: 'Learn about plants that support brain health and cognitive function.',
    icon: Brain,
    plantIds: ['ashwagandha', 'brahmi', 'gotu-kola'],
    imageSrc: 'https://images.unsplash.com/photo-1531592618329-9e8753235338?q=80&w=400&auto=format&fit=crop',
    imageHint: 'brain function'
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    description: 'Find plants that aid digestion and soothe the stomach.',
    icon: Soup,
    plantIds: ['turmeric', 'ginger', 'licorice', 'peppermint', 'fennel', 'cardamom'],
    imageSrc: 'https://images.unsplash.com/photo-1544558000-85c8a41755da?q=80&w=400&auto=format&fit=crop',
    imageHint: 'herbal tea'
  },
];
