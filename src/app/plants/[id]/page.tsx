
import AppLayout from '@/components/layout/AppLayout';
import { plantService } from '@/services/plant.service';
import PlantPageClient from '@/components/plants/PlantPageClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface PlantPageProps {
  params: { id: string };
}

// This function runs at build time to generate static pages for each plant
export async function generateStaticParams() {
    const plants = await plantService.getPlants();
    return plants.map((plant) => ({
      id: plant.id,
    }));
}

// This function generates metadata for the page (e.g., title) on the server
export async function generateMetadata({ params }: PlantPageProps): Promise<Metadata> {
  const plant = await plantService.getPlant(params.id);
  if (!plant) {
    return {
      title: 'Plant Not Found'
    }
  }
  return {
    title: `${plant.commonName} | AYUSH Virtual Garden`,
    description: plant.description,
  }
}

// Revalidate this page every hour to fetch new data from Firestore
export const revalidate = 3600;

// This is the main Server Component for the page
export default async function PlantPage({ params }: PlantPageProps) {
  const plant = await plantService.getPlant(params.id);

  if (!plant) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Plant Not Found</h1>
          <p className="text-muted-foreground">Sorry, we couldn't find the plant you're looking for.</p>
           <Link href="/plants" className="mt-6 inline-block">
            <Button>Back to Plants</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PlantPageClient plant={plant} />
    </AppLayout>
  );
}
