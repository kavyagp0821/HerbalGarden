// src/components/tours/TourCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TourCategory } from '@/types';
import { ArrowRight } from 'lucide-react';

interface TourCardProps {
  tour: TourCategory;
}

export default function TourCard({ tour }: TourCardProps) {
    const TourIcon = tour.icon;

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
        <CardTitle className="text-xl font-headline mb-2 flex items-center">
             {TourIcon && <TourIcon className="w-6 h-6 mr-3 text-primary" />}
            <Link href={`/tours/${tour.id}`} className="hover:text-primary transition-colors">
                {tour.name}
            </Link>
        </CardTitle>
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
