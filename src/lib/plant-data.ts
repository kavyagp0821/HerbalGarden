// IMPORTANT: This file is the source of truth for all plant-related data in the application.
// When moving to a database, this data would be migrated.

import type { TourCategory, QuizQuestion } from '@/types';
import { ShieldHalf, Brain, Soup, Waves } from 'lucide-react';

// We keep this static data here because Lucide icons (functions) cannot be stored in Firestore.
// The tour data will be fetched from Firestore, and then the icon will be mapped from this list.
export const tourCategories: Omit<TourCategory, 'icon'> & { icon: string }[] = [
  {
    id: 'immunity-boosters',
    name: 'Immunity Boosters',
    description: 'Explore plants renowned for strengthening the immune system.',
    icon: 'ShieldHalf',
    plantIds: ['tulsi', 'amla', 'giloy', 'moringa', 'turmeric'],
    imageSrc: 'https://images.unsplash.com/photo-1579113800035-7a0342a43f11?q=80&w=400&auto=format&fit=crop',
    imageHint: 'immune system'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    description: 'Discover herbs that help calm the mind and reduce stress.',
    icon: 'Waves',
    plantIds: ['tulsi', 'ashwagandha', 'brahmi'],
    imageSrc: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop',
    imageHint: 'calm meditation'
  },
  {
    id: 'cognitive-enhancers',
    name: 'Cognitive Enhancers',
    description: 'Learn about plants that support brain health and cognitive function.',
    icon: 'Brain',
    plantIds: ['ashwagandha', 'brahmi'],
    imageSrc: 'https://images.unsplash.com/photo-1531592618329-9e8753235338?q=80&w=400&auto=format&fit=crop',
    imageHint: 'brain function'
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    description: 'Find plants that aid digestion and soothe the stomach.',
    icon: 'Soup',
    plantIds: ['turmeric', 'amla'],
    imageSrc: 'https://images.unsplash.com/photo-1544558000-85c8a41755da?q=80&w=400&auto=format&fit=crop',
    imageHint: 'herbal tea'
  },
];


export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which plant is known as an adaptogen and helps the body manage stress?',
    options: ['Tulsi', 'Turmeric', 'Neem', 'Amla'],
    correctAnswer: 'Tulsi',
    plantId: 'tulsi',
  },
  {
    id: 'q2',
    question: 'What is the primary active compound in Turmeric?',
    options: ['Curcumin', 'Piperine', 'Withanolides', 'Ginsenoside'],
    correctAnswer: 'Curcumin',
    plantId: 'turmeric',
  },
  {
    id: 'q3',
    question: 'Which herb is commonly referred to as "Indian Ginseng"?',
    options: ['Brahmi', 'Ashwagandha', 'Giloy', 'Moringa'],
    correctAnswer: 'Ashwagandha',
    plantId: 'ashwagandha',
  },
  {
    id: 'q4',
    question: 'Brahmi is most famous for its benefits to which part of the body?',
    options: ['The heart', 'The lungs', 'The brain', 'The skin'],
    correctAnswer: 'The brain',
    plantId: 'brahmi',
  },
  {
    id: 'q5',
    question: 'Amla (Indian Gooseberry) is an exceptionally rich source of which vitamin?',
    options: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin B12'],
    correctAnswer: 'Vitamin C',
    plantId: 'amla',
  },
   {
    id: 'q6',
    question: 'Giloy is often praised in Ayurveda for its ability to do what?',
    options: ['Improve skin tone', 'Boost immunity', 'Increase height', 'Sweeten food'],
    correctAnswer: 'Boost immunity',
    plantId: 'giloy',
  },
   {
    id: 'q7',
    question: 'Which plant is often called the "miracle tree" for its nutrient-dense leaves?',
    options: ['Neem', 'Moringa', 'Tulsi', 'Ashwagandha'],
    correctAnswer: 'Moringa',
    plantId: 'moringa',
  },
  {
    id: 'q8',
    question: 'Neem is well-known for what primary property?',
    options: ['Soothing scent', 'Bright flowers', 'Antibacterial', 'Spicy flavor'],
    correctAnswer: 'Antibacterial',
    plantId: 'neem',
  },
];
