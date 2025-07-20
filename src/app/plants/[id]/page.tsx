// src/app/plants/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import type { Plant } from '@/types';
import PlantInteractions from '@/components/plants/PlantInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Milestone, Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { plantService } from '@/services/plant.service';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface PlantPageProps {
  params: { id: string };
}

export default function PlantOverviewPage({ params }: PlantPageProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchPlant() {
      const fetchedPlant = await plantService.getPlant(params.id);
      if (fetchedPlant) {
        setPlant(fetchedPlant);
        // Track viewed plants for the user's progress
        try {
          const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
          const viewedPlants = progress.viewedPlants || {};
          if (!viewedPlants[fetchedPlant.id]) {
            viewedPlants[fetchedPlant.id] = fetchedPlant.commonName;
            progress.viewedPlants = viewedPlants;
            localStorage.setItem('userProgress', JSON.stringify(progress));
          }
        } catch (error) {
          console.error("Failed to update user progress for viewed plants.", error);
        }
      } else {
        notFound();
      }
    }
    fetchPlant();
  }, [params.id]);


  if (!plant) {
    return <PlantOverviewSkeleton />;
  }

  const handleListen = async () => {
    setIsGeneratingAudio(true);
    setAudioSrc(null);
    try {
        const textToListen = `${plant.commonName}. ${plant.description}`;
        const result = await textToSpeech(textToListen);
        setAudioSrc(result.audioDataUri);
    } catch (error) {
        console.error("TTS Generation Error:", error);
        toast({
            title: "Audio Generation Failed",
            description: "Could not generate audio for this plant. Please try again later.",
            variant: "destructive"
        });
    } finally {
        setIsGeneratingAudio(false);
    }
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
        <Card>
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-headline">Description</CardTitle>
            </div>
              <Button onClick={handleListen} variant="outline" size="icon" className="flex-shrink-0" disabled={isGeneratingAudio}>
                  {isGeneratingAudio ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                      <Volume2 className="h-5 w-5" />
                  )}
                  <span className="sr-only">Listen to description</span>
              </Button>
          </CardHeader>
          <CardContent>
             {audioSrc && (
              <div className="mb-4">
                  <audio controls autoPlay src={audioSrc} className="w-full h-10">
                      Your browser does not support the audio element.
                  </audio>
              </div>
              )}
            
            <p className="text-foreground/80 leading-relaxed mt-2">{plant.description}</p>

            {plant.ayushUses && (
              <>
              <Separator className="my-4" />
              <h3 className="font-semibold mb-2 text-primary">Traditional AYUSH Uses</h3>
              <p className="text-foreground/80 leading-relaxed">{plant.ayushUses}</p>
              </>
            )}
          </CardContent>
        </Card>
        
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

function PlantOverviewSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
                 <Card className="shadow-lg h-96">
                     <CardContent className="p-0 h-full">
                         <Skeleton className="h-full w-full rounded-t-lg" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-2/5" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/5" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/5" />
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
