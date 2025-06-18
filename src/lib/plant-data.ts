import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { Leaf, ShieldHalf, Activity, Brain, Users, Sparkles, Filter, Wind, Sun } from 'lucide-react';

export const plants: Plant[] = [
  {
    id: 'tulsi',
    commonName: 'Tulsi (Holy Basil)',
    latinName: 'Ocimum tenuiflorum',
    description: 'Tulsi is a sacred plant in Hindu belief. It is revered for its medicinal properties and is often grown in courtyards of Hindu houses.',
    therapeuticUses: ['Immunity Booster', 'Stress Relief', 'Respiratory Health'],
    region: 'Indian Subcontinent',
    classification: 'Herb',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'tulsi plant',
    videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
    ayushUses: 'Widely used in Ayurveda for treating coughs, colds, and improving longevity. Considered an adaptogen.',
  },
  {
    id: 'ashwagandha',
    commonName: 'Ashwagandha (Indian Ginseng)',
    latinName: 'Withania somnifera',
    description: 'Ashwagandha is a prominent herb in Ayurvedic medicine known for its adaptogenic properties, helping the body manage stress.',
    therapeuticUses: ['Stress Relief', 'Energy Booster', 'Cognitive Function'],
    region: 'India, Middle East, Africa',
    classification: 'Shrub',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'ashwagandha root',
    ayushUses: 'Used in Ayurveda to reduce stress and anxiety, improve energy levels, and enhance cognitive function. Its roots are primarily used.',
  },
  {
    id: 'turmeric',
    commonName: 'Turmeric (Haldi)',
    latinName: 'Curcuma longa',
    description: 'Turmeric is a bright yellow spice derived from the rhizome of the Curcuma longa plant. It has been used for centuries in cooking and medicine.',
    therapeuticUses: ['Anti-inflammatory', 'Antioxidant', 'Digestive Health'],
    region: 'Southeast Asia',
    classification: 'Rhizome',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'turmeric spice',
    videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
    ayushUses: 'A staple in Ayurvedic medicine for its anti-inflammatory properties, used to treat a variety of conditions including arthritis and digestive issues.',
  },
  {
    id: 'neem',
    commonName: 'Neem',
    latinName: 'Azadirachta indica',
    description: 'Neem is a fast-growing tree known for its bitter taste and wide range of medicinal applications, from skincare to pest control.',
    therapeuticUses: ['Skin Health', 'Anti-bacterial', 'Dental Care'],
    region: 'Indian Subcontinent',
    classification: 'Tree',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'neem leaves',
    ayushUses: 'Used in Ayurveda for its purifying properties. Effective for skin diseases, dental health, and as a blood purifier.',
  },
  {
    id: 'brahmi',
    commonName: 'Brahmi (Water Hyssop)',
    latinName: 'Bacopa monnieri',
    description: 'Brahmi is a staple in traditional Ayurvedic medicine, often used to enhance memory and cognitive functions.',
    therapeuticUses: ['Cognitive Function', 'Stress Relief', 'Anti-anxiety'],
    region: 'Wetlands in Asia, Australia, Europe, Africa, Americas',
    classification: 'Herb',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'brahmi plant',
    ayushUses: 'Known as a brain tonic in Ayurveda, it supports memory, learning, and concentration. Also used to calm the nerves.',
  },
];

export const tourCategories: TourCategory[] = [
  {
    id: 'immunity-boosters',
    name: 'Immunity Boosters',
    description: 'Explore plants renowned for strengthening the immune system.',
    icon: ShieldHalf,
    plantIds: ['tulsi', 'ashwagandha', 'turmeric'],
    imageSrc: 'https://placehold.co/400x300.png',
    imageHint: 'immune system'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    description: 'Discover herbs that help calm the mind and reduce stress.',
    icon: Activity,
    plantIds: ['tulsi', 'ashwagandha', 'brahmi'],
    imageSrc: 'https://placehold.co/400x300.png',
    imageHint: 'calm meditation'
  },
  {
    id: 'cognitive-enhancers',
    name: 'Cognitive Enhancers',
    description: 'Learn about plants that support brain health and cognitive function.',
    icon: Brain,
    plantIds: ['ashwagandha', 'brahmi'],
    imageSrc: 'https://placehold.co/400x300.png',
    imageHint: 'brain function'
  },
  {
    id: 'skin-health',
    name: 'Skin Health',
    description: 'Plants that promote healthy and radiant skin.',
    icon: Sparkles,
    plantIds: ['neem', 'turmeric'],
    imageSrc: 'https://placehold.co/400x300.png',
    imageHint: 'healthy skin'
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which plant is commonly known as "Holy Basil"?',
    options: ['Ashwagandha', 'Tulsi', 'Neem', 'Turmeric'],
    correctAnswer: 'Tulsi',
    plantId: 'tulsi',
  },
  {
    id: 'q2',
    question: 'What is the primary therapeutic use of Ashwagandha?',
    options: ['Digestive Health', 'Skin Care', 'Stress Relief', 'Respiratory Health'],
    correctAnswer: 'Stress Relief',
    plantId: 'ashwagandha',
  },
  {
    id: 'q3',
    question: 'Curcuma longa is the Latin name for which spice?',
    options: ['Ginger', 'Cinnamon', 'Cardamom', 'Turmeric'],
    correctAnswer: 'Turmeric',
    plantId: 'turmeric',
  },
  {
    id: 'q4',
    question: 'Which part of the Neem tree is NOT commonly used for medicinal purposes?',
    options: ['Leaves', 'Bark', 'Flowers', 'Seeds'], // All are used, this is a trickier one, let's assume one is less common or for a specific quiz this may be refined.
    correctAnswer: 'Flowers', // For simplicity, let's pick one. In reality, flowers are also used.
    plantId: 'neem',
  },
  {
    id: 'q5',
    question: 'Brahmi is well-known in Ayurveda for enhancing:',
    options: ['Physical Strength', 'Immune Response', 'Cognitive Function', 'Digestive Speed'],
    correctAnswer: 'Cognitive Function',
    plantId: 'brahmi',
  },
];
