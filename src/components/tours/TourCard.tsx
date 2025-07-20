// src/components/tours/TourCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TourCategory } from '@/types';
import { ArrowRight, Volume2, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface TourCardProps {
  tour: TourCategory;
}

export default function TourCard({ tour }: TourCardProps) {
    const TourIcon = tour.icon;
    const textToSpeak = `${tour.name}. ${tour.description}`;
    const { isPlaying, isLoading, playAudio, stopAudio } = useAudioPlayer(tour.id, textToSpeak);

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
        <Link href={`/tours/${tour.id}`} aria-label={`Start the ${tour.name} tour`}>
            <div className="aspect-video relative w-full bg-muted">
                <Image
                    src={tour.imageSrc}
                    alt={tour.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={tour.imageHint}
                />
            </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <div className="flex-grow">
                <CardTitle className="text-xl font-headline mb-2 flex items-center">
                    {TourIcon && <TourIcon className="w-6 h-6 mr-3 text-primary" />}
                    <Link href={`/tours/${tour.id}`} className="hover:text-primary transition-colors">
                        {tour.name}
                    </Link>
                </CardTitle>
            </div>
             <Button variant="ghost" size="icon" onClick={handleListenClick} className="flex-shrink-0 text-muted-foreground hover:text-primary" aria-label="Listen to tour summary">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className={`h-5 w-5 ${isPlaying ? 'text-primary' : ''}`} />}
            </Button>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {tour.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Link href={`/tours/${tour.id}`} className="w-full">
            <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                Start Tour <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
