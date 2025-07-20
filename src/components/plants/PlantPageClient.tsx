// src/components/plants/PlantPageClient.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Plant } from '@/types';
import PlantInteractions from '@/components/plants/PlantInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Milestone, Orbit, Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import ThreeDViewer from './ThreeDViewer';
import { Button } from '../ui/button';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';


interface PlantPageClientProps {
  plant: Plant;
}

export default function PlantPageClient({ plant }: PlantPageClientProps) {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const handleListen = async () => {
    setIsGeneratingAudio(true);
    try {
        const fullText = `${plant.commonName}. ${plant.latinName}. ${plant.description} ${plant.ayushUses ? `Traditional AYUSH Uses: ${plant.ayushUses}` : ''}`;
        const result = await textToSpeech(fullText);
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
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">{plant.commonName}</h1>
        <p className="text-xl text-muted-foreground italic mt-1">{plant.latinName}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                    <div className="aspect-video relative bg-muted flex items-center justify-center">
                        <Image
                            src={plant.imageSrc}
                            alt={`Visual representation of ${plant.commonName}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            data-ai-hint={plant.imageHint || `botanical illustration ${plant.commonName.toLowerCase()}`}
                            priority
                        />
                    </div>
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
                {plant.therapeuticUses.map((use, index) => (
                  <Badge key={index} variant="secondary">{use}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-headline">Description</CardTitle>
                <Button onClick={handleListen} variant="outline" size="sm" disabled={isGeneratingAudio}>
                    {isGeneratingAudio ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Volume2 className="mr-2 h-4 w-4" />
                    )}
                    Listen
                </Button>
            </CardHeader>
            <CardContent>
               {audioSrc && (
                <div className="mb-4">
                    <audio controls autoPlay src={audioSrc} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
                )}
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
          
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                    <Orbit className="w-5 h-5 mr-2 text-primary" />
                    Interactive 3D Model
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ThreeDViewer modelPath={plant.threeDModelSrc} />
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
