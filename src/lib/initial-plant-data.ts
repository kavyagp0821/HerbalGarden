
// src/lib/initial-plant-data.ts
import type { Plant } from '@/types';

// This file contains the initial static data for the plants.
// It's used as a fallback if the Firestore database is empty.
export const initialPlants: Plant[] = [
  {
    id: 'tulsi',
    commonName: 'Tulsi (Holy Basil)',
    latinName: 'Ocimum sanctum',
    description: 'A sacred plant in Hinduism, revered for its medicinal properties. It is considered an adaptogen, balancing different processes in the body, and helpful for adapting to stress.',
    therapeuticUses: ['Stress Relief', 'Immunity Booster', 'Respiratory Health', 'Anti-inflammatory'],
    region: 'Native to the Indian subcontinent',
    classification: 'Lamiaceae / Ocimum',
    imageSrc: 'https://images.unsplash.com/photo-1604146482173-467f3b593f83?q=80&w=600&h=400&fit=crop',
    imageHint: 'tulsi plant',
    ayushUses: 'In Ayurveda, Tulsi is used for a variety of ailments including common cold, inflammation, malaria, heart disease, and as an antimicrobial.',
    source: 'local'
  },
  {
    id: 'ashwagandha',
    commonName: 'Ashwagandha',
    latinName: 'Withania somnifera',
    description: 'Known as "Indian Ginseng," Ashwagandha is an ancient medicinal herb classified as an adaptogen, meaning it can help your body manage stress.',
    therapeuticUses: ['Stress Relief', 'Anxiety Reduction', 'Cognitive Function', 'Strength & Vitality'],
    region: 'India, Middle East, and parts of Africa',
    classification: 'Solanaceae / Withania',
    imageSrc: 'https://images.unsplash.com/photo-1630985489998-a6e37c52a324?q=80&w=600&h=400&fit=crop',
    imageHint: 'ashwagandha root',
    ayushUses: 'Used in Ayurveda to increase energy, reduce stress, and improve concentration. It is considered a Rasayana (rejuvenator).',
    source: 'local'
  },
  {
    id: 'turmeric',
    commonName: 'Turmeric',
    latinName: 'Curcuma longa',
    description: 'A bright yellow spice from the ginger family, Turmeric contains curcumin, a substance with powerful anti-inflammatory and antioxidant properties.',
    therapeuticUses: ['Anti-inflammatory', 'Antioxidant', 'Joint Health', 'Digestive Health'],
    region: 'Southeast Asia',
    classification: 'Zingiberaceae / Curcuma',
    imageSrc: 'https://images.unsplash.com/photo-1582723028323-9a3b683b5b69?q=80&w=600&h=400&fit=crop',
    imageHint: 'turmeric root spice',
    ayushUses: 'A cornerstone of Ayurvedic medicine, used as a potent anti-inflammatory agent, for digestive issues, skin diseases, and as a blood purifier.',
    source: 'local'
  },
  {
    id: 'brahmi',
    commonName: 'Brahmi',
    latinName: 'Bacopa monnieri',
    description: 'A staple plant in traditional Ayurvedic medicine, Brahmi is often used to enhance memory, reduce anxiety, and treat epilepsy. It\'s considered a nootropic herb.',
    therapeuticUses: ['Cognitive Enhancement', 'Memory Booster', 'Anxiety Reduction', 'Anti-epileptic'],
    region: 'Wetlands of southern and Eastern India, Australia, Europe, Africa, Asia, and North and South America',
    classification: 'Plantaginaceae / Bacopa',
    imageSrc: 'https://bs.floristic.org/image/o/8a6382b6b82d4f295b9d2889d8f3739a815a5196',
    imageHint: 'brahmi plant',
    ayushUses: 'Known in Ayurveda as a "brain tonic" (Medhya Rasayana), it is used to improve memory, intellect, and overall cognitive function.',
    source: 'local'
  },
  {
    id: 'amla',
    commonName: 'Amla (Indian Gooseberry)',
    latinName: 'Phyllanthus emblica',
    description: 'Amla is a fruit tree known for its incredibly high vitamin C content. It is a potent antioxidant and is used for a wide range of health benefits.',
    therapeuticUses: ['Rich in Vitamin C', 'Immunity Booster', 'Hair & Skin Health', 'Digestive Aid'],
    region: 'India, Middle East, and some southeast Asian countries',
    classification: 'Phyllanthaceae / Phyllanthus',
    imageSrc: 'https://images.unsplash.com/photo-1623979434685-617a233b2a2a?q=80&w=600&h=400&fit=crop',
    imageHint: 'amla fruit',
    ayushUses: 'A key ingredient in many Ayurvedic formulations, including the famous Chyawanprash. It is used for rejuvenation, as an antioxidant, and to balance all three doshas.',
    source: 'local'
  },
  {
    id: 'giloy',
    commonName: 'Giloy (Guduchi)',
    latinName: 'Tinospora cordifolia',
    description: 'Giloy is a climbing shrub that is highly valued in Ayurveda for its wide range of medicinal benefits, especially for boosting immunity and treating fevers.',
    therapeuticUses: ['Immunity Booster', 'Fever Reducer (Antipyretic)', 'Detoxification', 'Arthritis Relief'],
    region: 'Tropical regions of India, Myanmar, and Sri Lanka',
    classification: 'Menispermaceae / Tinospora',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'giloy vine',
    ayushUses: 'Referred to as "Amrita" (the root of immortality) in Ayurveda. It is a powerful immunomodulator and is used to treat chronic fevers, diabetes, and respiratory issues.',
    source: 'local'
  },
   {
    id: 'moringa',
    commonName: 'Moringa',
    latinName: 'Moringa oleifera',
    description: 'Often called the "drumstick tree" or "miracle tree," Moringa is a nutritional powerhouse. Its leaves, pods, and seeds are packed with vitamins, minerals, and proteins.',
    therapeuticUses: ['Nutrient-Rich Superfood', 'Antioxidant', 'Anti-inflammatory', 'Energy Booster'],
    region: 'Native to the sub-Himalayan areas of India, Pakistan, Bangladesh, and Afghanistan',
    classification: 'Moringaceae / Moringa',
    imageSrc: 'https://images.unsplash.com/photo-1607532204786-9a5c9a0b1f1e?q=80&w=600&h=400&fit=crop',
    imageHint: 'moringa leaves',
    ayushUses: 'Used in Ayurveda and Siddha medicine for its nutritional benefits and to treat conditions like anemia, arthritis, and skin infections.',
    source: 'local'
  },
  {
    id: 'neem',
    commonName: 'Neem',
    latinName: 'Azadirachta indica',
    description: 'Known as the "village pharmacy," nearly every part of the neem tree has medicinal properties. It is especially known for its antibacterial and skin-soothing benefits.',
    therapeuticUses: ['Antibacterial', 'Skin Health', 'Dental Care', 'Blood Purifier'],
    region: 'Native to the Indian subcontinent',
    classification: 'Meliaceae / Azadirachta',
    imageSrc: 'https://images.unsplash.com/photo-1616690326929-23a5796c80c2?q=80&w=600&h=400&fit=crop',
    imageHint: 'neem leaves',
    ayushUses: 'Widely used in Ayurveda for its purifying and detoxifying properties. It is used for skin disorders, dental hygiene, and as a potent antimicrobial agent.',
    source: 'local'
  },
];
