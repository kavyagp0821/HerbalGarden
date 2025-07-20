// src/app/plants/[id]/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import type { Plant } from '@/types';
import PlantInteractions from '@/components/plants/PlantInteractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Milestone, Orbit, Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import { plantService } from '@/services/plant.service';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translateContent } from '@/ai/flows/translate-content-flow';


interface PlantPageProps {
  params: { id: string };
}

interface TranslatedContent {
    description: string;
    ayushUses: string;
    therapeuticUses: string[];
    region: string;
    classification: string;
}

export default function PlantOverviewPage({ params }: PlantPageProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();
  const { targetLanguage } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
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

  useEffect(() => {
    if (!plant) return;

    const translate = async () => {
        if (targetLanguage === 'English') {
            setTranslatedContent({
                description: plant.description,
                ayushUses: plant.ayushUses || '',
                therapeuticUses: plant.therapeuticUses,
                region: plant.region,
                classification: plant.classification,
            });
            return;
        }

        setIsTranslating(true);
        try {
            const contentToTranslate = [
                plant.description,
                plant.ayushUses || 'Not applicable.',
                plant.region,
                plant.classification,
                ...plant.therapeuticUses
            ].join(' || ');

            const result = await translateContent({
                content: contentToTranslate,
                targetLanguage: targetLanguage,
            });

            const parts = result.translatedText.split(' || ');
            const numStaticParts = 4; // description, ayushUses, region, classification
            setTranslatedContent({
                description: parts[0] || plant.description,
                ayushUses: parts[1] !== 'Not applicable.' ? (parts[1] || plant.ayushUses || '') : '',
                region: parts[2] || plant.region,
                classification: parts[3] || plant.classification,
                therapeuticUses: parts.slice(numStaticParts).length > 0 ? parts.slice(numStaticParts) : plant.therapeuticUses,
            });
        } catch (error) {
            console.error('Translation failed', error);
            // Fallback to original content
            setTranslatedContent({
                description: plant.description,
                ayushUses: plant.ayushUses || '',
                therapeuticUses: plant.therapeuticUses,
                region: plant.region,
                classification: plant.classification,
            });
             toast({
                title: "Translation Failed",
                description: "Could not translate content. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsTranslating(false);
        }
    };
    translate();
  }, [plant, targetLanguage, toast]);


  if (!plant) {
    return <PlantOverviewSkeleton />;
  }
  
  const displayedContent = useMemo(() => {
    const content = translatedContent || plant;
    const isLoading = isTranslating || !translatedContent;
    
    return {
        description: isLoading ? <Skeleton className="h-24 w-full" /> : <p className="text-foreground/80 leading-relaxed mt-2">{content.description}</p>,
        ayushUses: isLoading ? <Skeleton className="h-16 w-full" /> : <p className="text-foreground/80 leading-relaxed">{content.ayushUses}</p>,
        therapeuticUses: isLoading ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-8 w-20" />) : content.therapeuticUses.map((use, index) => <Badge key={index} variant="secondary" className="text-sm">{use}</Badge>),
        region: isLoading ? <Skeleton className="h-5 w-3/4" /> : <p className="text-sm text-foreground/80">{content.region}</p>,
        classification: isLoading ? <Skeleton className="h-5 w-3/4" /> : <p className="text-sm text-foreground/80">{content.classification}</p>,
    }
  }, [isTranslating, translatedContent, plant]);

  const handleListen = async () => {
    setIsGeneratingAudio(true);
    setAudioSrc(null);
    try {
        const textToListen = translatedContent ? `${plant.commonName}. ${translatedContent.description}` : `${plant.commonName}. ${plant.description}`;
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
              <Button onClick={handleListen} variant="outline" size="icon" className="flex-shrink-0" disabled={isGeneratingAudio || isTranslating}>
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
            
            {displayedContent.description}

            {(translatedContent?.ayushUses || plant.ayushUses) && (
              <>
              <Separator className="my-4" />
              <h3 className="font-semibold mb-2 text-primary">Traditional AYUSH Uses</h3>
              {displayedContent.ayushUses}
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
              {displayedContent.therapeuticUses}
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
              {displayedContent.region}
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
              {displayedContent.classification}
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
