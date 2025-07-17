// src/components/plants/PlantPageClient.tsx
'use client';

import { useEffect } from 'react';
import type { Plant } from '@/types';
import ThreeDViewerPlaceholder from '@/components/plants/ThreeDViewerPlaceholder';
import PlantInteractions from '@/components/plants/PlantInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Milestone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PlantPageClientProps {
  plant: Plant;
}

export default function PlantPageClient({ plant }: PlantPageClientProps) {
  
  useEffect(() => {
    // Track viewed plants for the user's progress
    try {
      const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      const viewedPlants = progress.viewedPlants || {};
      if (!viewedPlants[plant.id]) {
        viewedPlants[plant.id] = plant.commonName;
        progress.viewedPlants = viewedPlants;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      }
    } catch (error) {
      console.error("Failed to update user progress for viewed plants.", error);
    }
  }, [plant.id, plant.commonName]);


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">{plant.commonName}</h1>
        <p className="text-xl text-muted-foreground italic mt-1">{plant.latinName}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ThreeDViewerPlaceholder 
            plantName={plant.commonName}
            imageSrc={plant.imageSrc}
            imageHint={plant.imageHint}
          />
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Leaf className="w-5 h-5 mr-2 text-primary" />
                Therapeutic Uses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plant.therapeuticUses.map((use, index) => (
                  <Badge key={index} variant="secondary">{use}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed">{plant.description}</p>
              {plant.ayushUses && (
                <>
                <Separator className="my-4" />
                <h3 className="font-semibold mb-2">Traditional AYUSH Uses</h3>
                <p className="text-foreground/90 leading-relaxed">{plant.ayushUses}</p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-headline">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Region & Habitat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{plant.region}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-headline">
                  <Milestone className="w-5 h-5 mr-2 text-primary" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{plant.classification}</p>
              </CardContent>
            </Card>
          </div>

          <PlantInteractions plantId={plant.id} plantName={plant.commonName} />
        </div>
      </div>
    </div>
  );
}
