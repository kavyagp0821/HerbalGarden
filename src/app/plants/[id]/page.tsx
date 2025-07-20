// src/app/plants/[id]/page.tsx
import { notFound } from 'next/navigation';
import type { Plant } from '@/types';
import PlantInteractions from '@/components/plants/PlantInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Milestone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { plantService } from '@/services/plant.service';
import Image from 'next/image';
import PlantDescription from '@/components/plants/PlantDescription';

interface PlantPageProps {
  params: { id: string };
}

export default async function PlantOverviewPage({ params }: PlantPageProps) {
  const plant = await plantService.getPlant(params.id);
  
  if (!plant) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-0">
             <div className="aspect-video relative w-full">
                <Image
                    src={plant.imageSrc}
                    alt={plant.commonName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover rounded-t-lg"
                    data-ai-hint={plant.imageHint || plant.commonName}
                    priority
                />
            </div>
          </CardContent>
        </Card>
        <PlantInteractions plantId={plant.id} plantName={plant.commonName} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <PlantDescription plant={plant} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              <Leaf className="w-5 h-5 mr-2 text-primary" />
              Therapeutic Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plant.therapeuticUses.map((use) => (
                <Badge key={use} variant="secondary" className="text-sm">{use}</Badge>
              ))}
            </div>
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
      </div>
    </div>
  );
}
