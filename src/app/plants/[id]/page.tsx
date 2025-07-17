// src/app/plants/[id]/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantPageClient from '@/components/plants/PlantPageClient';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { notFound } from 'next/navigation';

interface PlantPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PlantPageProps) {
  const plant = await plantService.getPlant(params.id);
  if (!plant) {
    return { title: 'Plant Not Found | Virtual Vana' };
  }
  return {
    title: `${plant.commonName} | Virtual Vana`,
    description: `Learn about ${plant.commonName}: its uses, habitat, and more.`,
  };
}

// This page will be server-rendered for each plant
export default async function PlantPage({ params }: PlantPageProps) {
  const plant = await plantService.getPlant(params.id);

  if (!plant) {
    notFound();
  }

  return (
    <AppLayout>
      <PlantPageClient plant={plant} />
    </AppLayout>
  );
}
