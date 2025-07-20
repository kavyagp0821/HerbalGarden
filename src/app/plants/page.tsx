// src/app/plants/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { Leaf, AlertTriangle, RotateCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPlants = await plantService.getPlants();
      setPlants(fetchedPlants);
    } catch (error) {
      console.error("Failed to load plants:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Plants</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{error}</p>
            <Button onClick={loadPlants} variant="secondary" size="sm">
              <RotateCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (plants.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-16 bg-card rounded-lg shadow-sm">
        <p className="text-xl font-semibold text-foreground">The Garden is Being Prepared</p>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          It looks like the plant collection is currently empty. The data may be loading or is not yet available.
        </p>
      </div>
    );
  };


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
        
        {renderContent()}

      </div>
    </AppLayout>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col h-full overflow-hidden shadow-lg rounded-lg border bg-card">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 flex-grow">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>
            <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}
