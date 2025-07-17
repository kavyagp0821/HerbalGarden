// src/components/trefle/TreflePlantCard.tsx
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TreflePlant } from '@/types';
import { Calendar, Sprout, Globe } from 'lucide-react';
import Link from 'next/link';

interface TreflePlantCardProps {
  plant: TreflePlant;
}

export default function TreflePlantCard({ plant }: TreflePlantCardProps) {
  const placeholderImage = 'https://placehold.co/600x400.png';
  const plantId = plant.scientific_name.toLowerCase().replace(/ /g, '-');

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/plants/${plantId}`} prefetch={false}>
            <div className="aspect-video relative w-full bg-muted">
            <Image
                src={plant.image_url || placeholderImage}
                alt={plant.common_name || plant.scientific_name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={plant.common_name || plant.scientific_name}
                unoptimized={!!plant.image_url} // Trefle images may not need Next.js optimization
            />
            </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">
          <Link href={`/plants/${plantId}`} prefetch={false} className="hover:text-primary">
            {plant.common_name || 'Unknown Common Name'}
          </Link>
        </CardTitle>
        <CardDescription className="italic text-sm text-muted-foreground mb-3">
          {plant.scientific_name}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">Family: {plant.family || 'N/A'}</Badge>
            <Badge variant="secondary" className="text-xs">Genus: {plant.genus || 'N/A'}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
         <div className="flex items-center gap-1" title="Rank">
            <Sprout className="w-3 h-3"/>
            <span>{plant.rank}</span>
        </div>
        {plant.year && (
             <div className="flex items-center gap-1" title="Year Discovered">
                <Calendar className="w-3 h-3"/>
                <span>{plant.year}</span>
            </div>
        )}
         <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(plant.scientific_name)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-primary"
            title="Search on Google"
        >
            <Globe className="w-3 h-3"/>
            <span>More Info</span>
        </a>
      </CardFooter>
    </Card>
  );
}
