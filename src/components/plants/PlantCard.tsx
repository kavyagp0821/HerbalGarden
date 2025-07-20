// src/components/plants/PlantCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Plant } from '@/types';
import { ArrowRight, Volume2, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { translateContent } from '@/ai/flows/translate-content-flow';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

interface PlantCardProps {
  plant: Plant;
  targetLanguage: string;
}

interface TranslatedContent {
    commonName: string;
    latinName: string;
    therapeuticUses: string[];
}

export default function PlantCard({ plant, targetLanguage }: PlantCardProps) {
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (targetLanguage === 'English') {
        setTranslatedContent({
            commonName: plant.commonName,
            latinName: plant.latinName,
            therapeuticUses: plant.therapeuticUses,
        });
        return;
      }

      setIsTranslating(true);
      try {
        const contentToTranslate = [
          plant.commonName,
          plant.latinName,
          ...plant.therapeuticUses,
        ].join(' || ');

        const result = await translateContent({
          content: contentToTranslate,
          targetLanguage: targetLanguage,
        });

        const parts = result.translatedText.split(' || ');
        setTranslatedContent({
          commonName: parts[0] || plant.commonName,
          latinName: parts[1] || plant.latinName,
          therapeuticUses: parts.slice(2).length > 0 ? parts.slice(2) : plant.therapeuticUses,
        });

      } catch (error) {
        console.error('Translation failed', error);
        // Fallback to original content
        setTranslatedContent({
            commonName: plant.commonName,
            latinName: plant.latinName,
            therapeuticUses: plant.therapeuticUses,
        });
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [plant, targetLanguage]);

  const displayedContent = useMemo(() => {
    return isTranslating || !translatedContent ? {
        commonName: <Skeleton className="h-6 w-3/4" />,
        latinName: <Skeleton className="h-4 w-1/2" />,
        therapeuticUses: Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-5 w-16" />)
    } : {
        commonName: <>{translatedContent.commonName}</>,
        latinName: <>{translatedContent.latinName}</>,
        therapeuticUses: translatedContent.therapeuticUses.slice(0, 3).map((use) => (
            <Badge key={use} variant="outline" className="text-xs">{use}</Badge>
        ))
    }
  }, [isTranslating, translatedContent]);


  const textToSpeak = `${plant.commonName}. Uses include: ${plant.therapeuticUses.join(', ')}.`;
  const { isPlaying, isLoading, playAudio, stopAudio } = useAudioPlayer(plant.id, textToSpeak);

  const handleListenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="p-0 relative">
        <Link href={`/plants/${plant.id}`} aria-label={`View details for ${plant.commonName}`}>
            <div className="aspect-video relative w-full bg-muted">
                <Image
                    src={plant.imageSrc}
                    alt={plant.commonName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={plant.imageHint || plant.commonName}
                />
            </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <div className="flex-grow space-y-2">
                <CardTitle className="text-xl font-headline mb-1">
                    <Link href={`/plants/${plant.id}`} className="hover:text-primary transition-colors">
                        {displayedContent.commonName}
                    </Link>
                </CardTitle>
                <CardDescription className="italic text-sm text-muted-foreground mb-3">
                  {displayedContent.latinName}
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleListenClick} className="flex-shrink-0 text-muted-foreground hover:text-primary" aria-label="Listen to plant summary">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className={`h-5 w-5 ${isPlaying ? 'text-primary' : ''}`} />}
            </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {displayedContent.therapeuticUses}
          {translatedContent && translatedContent.therapeuticUses.length > 3 && <Badge variant="outline" className="text-xs">...</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Link href={`/plants/${plant.id}`} className="w-full">
            <Button variant="default" className="w-full">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
