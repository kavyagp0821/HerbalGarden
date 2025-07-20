// src/app/plants/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { Leaf } from 'lucide-react';

export const metadata = {
  title: 'Explore Plants | Virtual Vana',
  description: 'Explore our curated collection of medicinal plants.',
};

// Revalidate this page every hour to fetch new data
export const revalidate = 3600;

export default async function PlantsPage() {
  const plants: Plant[] = await plantService.getPlants();

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center">
                <Leaf className="w-10 h-10 mr-4" />
                Explore the Garden
            </h1>
             <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
                Discover our curated collection of medicinal plants. Click on any plant to see its detailed profile, including an interactive 3D model, therapeutic uses, and cultivation information.
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
            <p className="text-xl font-semibold text-foreground">The Garden is Being Prepared</p>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">It looks like the plant collection is currently empty. The data may be loading or is not yet available.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
