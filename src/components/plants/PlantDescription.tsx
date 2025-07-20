// src/components/plants/PlantDescription.tsx
'use client';

import { useState } from 'react';
import type { Plant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PlantDescriptionProps {
  plant: Plant;
}

export default function PlantDescription({ plant }: PlantDescriptionProps) {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();

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
  )
}
