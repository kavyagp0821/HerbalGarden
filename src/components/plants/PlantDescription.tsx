// src/components/plants/PlantDescription.tsx
'use client';

import type { Plant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PlantDescriptionProps {
  plant: Plant;
}

export default function PlantDescription({ plant }: PlantDescriptionProps) {
  const textToListen = `${plant.commonName}. ${plant.description}`;
  const { isPlaying, isLoading, playAudio, stopAudio } = useAudioPlayer(plant.id, textToListen);

  const handleListenClick = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
            <CardTitle className="text-2xl font-headline">Description</CardTitle>
        </div>
          <Button onClick={handleListenClick} variant="outline" size="icon" className="flex-shrink-0" disabled={isLoading}>
              {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                  <Volume2 className={`h-5 w-5 ${isPlaying ? 'text-primary' : ''}`} />
              )}
              <span className="sr-only">Listen to description</span>
          </Button>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 leading-relaxed">{plant.description}</p>

        {plant.ayushUses && (
          <>
          <Separator className="my-4" />
          <h3 className="font-semibold mb-2 text-primary">Traditional AYUSH Uses</h3>
          <p className="text-foreground/80 leading-relaxed">{plant.ayushUses}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
