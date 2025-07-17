
'use client';

import { useEffect } from 'react';
import type { Plant, UserProgress } from '@/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Leaf, MapPin, Tag, Video, Info, Pill } from 'lucide-react';
import ThreeDViewerPlaceholder from '@/components/plants/ThreeDViewerPlaceholder';
import PlantInteractions from '@/components/plants/PlantInteractions';

interface PlantPageClientProps {
  plant: Plant;
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content?: string;
  children?: React.ReactNode;
}

function InfoCard({ icon, title, content, children }: InfoCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content && <p className="text-sm text-foreground/80">{content}</p>}
        {children}
      </CardContent>
    </Card>
  );
}

export default function PlantPageClient({ plant }: PlantPageClientProps) {
  
  useEffect(() => {
    document.title = `${plant.commonName} | Virtual Vana`;
    
    // Update user progress in localStorage
    try {
      const progress: UserProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      const viewedPlants = progress.viewedPlants || {};
      if (!viewedPlants[plant.id]) {
          viewedPlants[plant.id] = plant.commonName;
          progress.viewedPlants = viewedPlants;
          localStorage.setItem('userProgress', JSON.stringify(progress));
      }
    } catch (error) {
      console.error("Failed to update user progress in localStorage", error);
    }
  }, [plant]);

  return (
    <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">{plant.commonName}</h1>
          <p className="text-xl italic text-muted-foreground">{plant.latinName}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video relative w-full">
                <Image
                  src={plant.imageSrc}
                  alt={plant.commonName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 67vw, 50vw"
                  className="object-cover"
                  data-ai-hint={plant.imageHint || plant.commonName.toLowerCase()}
                  priority
                />
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <InfoCard icon={<Info className="w-5 h-5 text-primary" />} title="Description" content={plant.description} />
            <InfoCard icon={<Pill className="w-5 h-5 text-primary" />} title="Therapeutic Uses">
              <div className="flex flex-wrap gap-2">
                {plant.therapeuticUses.map(use => <Badge key={use} variant="secondary">{use}</Badge>)}
              </div>
            </InfoCard>
          </div>
        </div>
        
        {plant.ayushUses && (
          <Card className="mb-8 bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center text-primary">
                <Leaf className="w-6 h-6 mr-2" />
                AYUSH Significance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{plant.ayushUses}</p>
            </CardContent>
          </Card>
        )}

        <ThreeDViewerPlaceholder 
            plantName={plant.commonName} 
            imageSrc={plant.imageSrc}
            imageHint={plant.imageHint ? `sketch ${plant.imageHint}` : `sketch ${plant.commonName.toLowerCase()}`} 
        />
        
        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <InfoCard icon={<MapPin className="w-5 h-5 text-primary" />} title="Region" content={plant.region} />
          <InfoCard icon={<Tag className="w-5 h-5 text-primary" />} title="Classification" content={plant.classification} />
        </div>

        {plant.videoSrc && (
          <section className="mb-8">
            <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center">
              <Video className="w-6 h-6 mr-2 text-primary" />
              Learn More Visually
            </h2>
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video">
                <video controls className="w-full h-full" poster={plant.imageSrc}>
                  <source src={plant.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <CardContent className="p-4">
                <CardDescription>Watch this video to learn more about {plant.commonName}.</CardDescription>
              </CardContent>
            </Card>
          </section>
        )}
        
        <Separator className="my-8" />

        <PlantInteractions plantId={plant.id} plantName={plant.commonName} />
      </div>
  );
}
