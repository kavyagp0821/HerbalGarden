// src/app/models/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { Box } from 'lucide-react';

export const metadata = {
  title: '3D Plant Models | Virtual Vana',
  description: 'Explore interactive 3D models of medicinal plants from our collection.',
};

// Revalidate this page every hour to fetch new data
export const revalidate = 3600;

export default async function ModelsPage() {
  const plants: Plant[] = await plantService.getPlants();

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
                <Box className="w-8 h-8 mr-3" />
                3D Plant Models
            </h1>
             <p className="text-lg text-muted-foreground mt-2">
                Discover and interact with 3D models from our curated collection of medicinal plants.
            </p>
        </header>

        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <p className="text-xl font-semibold text-foreground">Could Not Load Plant Models</p>
            <p className="text-muted-foreground mt-2">There was an issue fetching plant data from the database. Please try again later.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
