// src/lib/plantAdapter.ts
import type { TreflePlant, Plant } from '@/types';

export function adaptTrefleToPlant(treflePlant: TreflePlant): Omit<Plant, 'id'> {
  return {
    commonName: treflePlant.common_name || treflePlant.scientific_name,
    latinName: treflePlant.scientific_name,
    description: `A plant from the family ${treflePlant.family || 'Unknown'}.`,
    therapeuticUses: [],
    region: 'Global',
    classification: `${treflePlant.family || 'Unknown'} / ${treflePlant.genus || 'Unknown'}`,
    imageSrc: treflePlant.image_url || 'https://placehold.co/600x400.png',
    imageHint: treflePlant.common_name || treflePlant.scientific_name,
    ayushUses: 'Research needed',
  };
}