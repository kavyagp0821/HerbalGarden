
// src/app/plants/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
            <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
                <Leaf className="w-8 h-8 mr-3" />
                Explore Our Plant Collection
            </h1>
             <p className="text-lg text-muted-foreground mt-2">
                Discover our curated collection of medicinal plants, complete with detailed information and interactive 3D models.
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
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">It looks like the plant collection is currently empty. Please check back later as we cultivate our virtual garden.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
