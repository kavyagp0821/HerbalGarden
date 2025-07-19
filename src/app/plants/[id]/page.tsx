// src/app/plants/[id]/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantPageClient from '@/components/plants/PlantPageClient';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

// This function can be used to pre-render pages at build time
// for better performance, but it's optional.
// export async function generateStaticParams() {
//   const plants = await plantService.getPlants();
//   return plants.map((plant) => ({
//     id: plant.id,
//   }));
// }

// This page will be server-rendered for each plant
export default async function PlantPage({ params }: PlantPageProps) {
  const plant = await plantService.getPlant(params.id);

  if (!plant) {
    // This is a more graceful way to handle missing plants.
    // It will show a "Not Found" page instead of crashing the server.
    return (
      <AppLayout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-primary mb-4">Plant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the plant you were looking for. It might not be in our database yet.
          </p>
          <Link href="/plants">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
        <Link href="/plants" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
        </Link>
      <PlantPageClient plant={plant} />
    </AppLayout>
  );
}
