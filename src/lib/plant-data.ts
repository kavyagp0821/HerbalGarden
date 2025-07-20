
// IMPORTANT: This file is the source of truth for all plant-related data in the application.
// When moving to a database, this data would be migrated.

import type { Plant, TourCategory, QuizQuestion } from '@/types';
import { Leaf, ShieldHalf, Activity, Brain, Users, Sparkles, Filter, Wind, Sun, HeartPulse, Soup, Waves } from 'lucide-react';

// We keep this static data here because Lucide icons (functions) cannot be stored in Firestore.
// The tour data will be fetched from Firestore, and then the icon will be mapped from this list.
export const tourCategories: TourCategory[] = [
  {
    id: 'immunity-boosters',
    name: 'Immunity Boosters',
    description: 'Explore plants renowned for strengthening the immune system.',
    icon: ShieldHalf,
    plantIds: ['tulsi', 'amla', 'giloy', 'moringa', 'turmeric', 'ginger', 'echinacea', 'elderberry'],
    imageSrc: 'https://images.unsplash.com/photo-1579113800035-7a0342a43f11?q=80&w=400&auto=format&fit=crop',
    imageHint: 'immune system'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    description: 'Discover herbs that help calm the mind and reduce stress.',
    icon: Waves,
    plantIds: ['tulsi', 'ashwagandha', 'brahmi', 'vetiver', 'sandalwood', 'lemongrass', 'lavender', 'chamomile'],
    imageSrc: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop',
    imageHint: 'calm meditation'
  },
  {
    id: 'cognitive-enhancers',
    name: 'Cognitive Enhancers',
    description: 'Learn about plants that support brain health and cognitive function.',
    icon: Brain,
    plantIds: ['ashwagandha', 'brahmi', 'gotu-kola', 'ginkgo-biloba', 'rosemary'],
    imageSrc: 'https://images.unsplash.com/photo-1531592618329-9e8753235338?q=80&w=400&auto=format&fit=crop',
    imageHint: 'brain function'
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    description: 'Find plants that aid digestion and soothe the stomach.',
    icon: Soup,
    plantIds: ['turmeric', 'ginger', 'licorice', 'peppermint', 'fennel', 'cardamom', 'marshmallow-root'],
    imageSrc: 'https://images.unsplash.com/photo-1544558000-85c8a41755da?q=80&w=400&auto=format&fit=crop',
    imageHint: 'herbal tea'
  },
];


export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which plant is known as the "elixir of life" in Ayurveda?',
    options: ['Ashwagandha', 'Tulsi (Holy Basil)', 'Turmeric', 'Amla'],
    correctAnswer: 'Tulsi (Holy Basil)',
    plantId: 'tulsi',
  },
  {
    id: 'q2',
    question: 'What is the primary active compound in Turmeric that gives it anti-inflammatory properties?',
    options: ['Gingerol', 'Piperine', 'Curcumin', 'Withanolides'],
    correctAnswer: 'Curcumin',
    plantId: 'turmeric',
  },
  {
    id: 'q3',
    question: 'Ashwagandha is best known for which of the following properties?',
    options: ['Stimulant', 'Diuretic', 'Adaptogen', 'Expectorant'],
    correctAnswer: 'Adaptogen',
    plantId: 'ashwagandha',
  },
  {
    id: 'q4',
    question: 'Which herb is often called a "brain tonic" and is used to enhance memory?',
    options: ['Brahmi', 'Giloy', 'Moringa', 'Licorice'],
    correctAnswer: 'Brahmi',
    plantId: 'brahmi',
  },
  {
    id: 'q5',
    question: 'Amla (Indian Gooseberry) is an extremely rich source of which vitamin?',
    options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 'Vitamin C',
    plantId: 'amla',
  },
  {
    id: 'q6',
    question: 'The name of which herb translates to "she who possesses a hundred husbands" in Ayurveda?',
    options: ['Neem', 'Gotu Kola', 'Shatavari', 'Ginkgo Biloba'],
    correctAnswer: 'Shatavari',
    plantId: 'shatavari',
  },
  {
    id: 'q7',
    question: 'Which part of the Ginger plant is most commonly used as a spice and medicine?',
    options: ['Leaf', 'Flower', 'Stem', 'Rhizome (Root)'],
    correctAnswer: 'Rhizome (Root)',
    plantId: 'ginger',
  },
  {
    id: 'q8',
    question: 'The essential oil from which plant is known as the "oil of tranquility"?',
    options: ['Lemongrass', 'Eucalyptus', 'Vetiver', 'Sandalwood'],
    correctAnswer: 'Vetiver',
    plantId: 'vetiver',
  },
  {
    id: 'q9',
    question: 'Neem is well-known in traditional medicine for which primary benefit?',
    options: ['Boosting energy', 'Improving eyesight', 'Antibacterial and skin health', 'Enhancing flavor'],
    correctAnswer: 'Antibacterial and skin health',
    plantId: 'neem',
  },
  {
    id: 'q10',
    question: 'Which plant, often called the "miracle tree", is a powerhouse of nutrients?',
    options: ['Moringa', 'Cardamom', 'Fennel', 'Sandalwood'],
    correctAnswer: 'Moringa',
    plantId: 'moringa',
  },
  {
    id: 'q11',
    question: 'Which of these plants is NOT in the Lamiaceae (mint) family?',
    options: ['Tulsi (Holy Basil)', 'Peppermint', 'Rosemary', 'Sandalwood'],
    correctAnswer: 'Sandalwood',
    plantId: 'sandalwood',
  },
  {
    id: 'q12',
    question: 'Giloy (Guduchi) is most praised in Ayurveda for its ability to do what?',
    options: ['Improve skin complexion', 'Boost immunity and reduce fever', 'Increase muscle mass', 'Sweeten food'],
    correctAnswer: 'Boost immunity and reduce fever',
    plantId: 'giloy',
  },
  {
    id: 'q13',
    question: 'The root of which plant is used to soothe sore throats and ulcers due to its demulcent properties?',
    options: ['Turmeric', 'Licorice', 'Moringa', 'Ginger'],
    correctAnswer: 'Licorice',
    plantId: 'licorice',
  },
  {
    id: 'q14',
    question: 'Peppermint is a hybrid of which two types of mint?',
    options: ['Spearmint and Applemint', 'Watermint and Spearmint', 'Horsemint and Watermint', 'Chocolatemint and Orangemint'],
    correctAnswer: 'Watermint and Spearmint',
    plantId: 'peppermint',
  },
  {
    id: 'q15',
    question: 'Which plant is often used in aromatherapy for its calming and sleep-promoting effects?',
    options: ['Rosemary', 'Neem', 'Lavender', 'Echinacea'],
    correctAnswer: 'Lavender',
    plantId: 'lavender',
  },
  {
    id: 'q16',
    question: 'Echinacea, or purple coneflower, is popularly used to treat what?',
    options: ['The common cold and flu', 'High blood pressure', 'Hair loss', 'Joint pain'],
    correctAnswer: 'The common cold and flu',
    plantId: 'echinacea',
  },
  {
    id: 'q17',
    question: 'Which plant\'s scent is traditionally used to improve memory and concentration?',
    options: ['Chamomile', 'Rosemary', 'Shatavari', 'Amla'],
    correctAnswer: 'Rosemary',
    plantId: 'rosemary',
  },
  {
    id: 'q18',
    question: 'The high mucilage content of Marshmallow Root makes it effective for what?',
    options: ['Stimulating the nervous system', 'Soothing irritated tissues', 'Improving blood circulation', 'Strengthening bones'],
    correctAnswer: 'Soothing irritated tissues',
    plantId: 'marshmallow-root',
  },
  {
    id: 'q19',
    question: 'Which plant is NOT native to the Indian Subcontinent?',
    options: ['Tulsi', 'Neem', 'Amla', 'Echinacea'],
    correctAnswer: 'Echinacea',
    plantId: 'echinacea',
  },
  {
    id: 'q20',
    question: 'Chamomile tea is most commonly consumed for which of the following reasons?',
    options: ['To increase energy', 'To aid digestion and promote sleep', 'To improve athletic performance', 'To sharpen vision'],
    correctAnswer: 'To aid digestion and promote sleep',
    plantId: 'chamomile',
  },
];


