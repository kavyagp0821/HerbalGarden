// src/components/plants/PlantCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Plant } from '@/types';
import { ArrowRight } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/plants/${plant.id}`} aria-label={`View details for ${plant.commonName}`}>
            <div className="aspect-video relative w-full bg-muted">
                <Image
                    src={plant.imageSrc}
                    alt={plant.commonName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={plant.imageHint || plant.commonName}
                />
            </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1">
            <Link href={`/plants/${plant.id}`} className="hover:text-primary transition-colors">
                {plant.commonName}
            </Link>
        </CardTitle>
        <CardDescription className="italic text-sm text-muted-foreground mb-3">
          {plant.latinName}
        </CardDescription>
        <div className="flex flex-wrap gap-1">
          {plant.therapeuticUses.slice(0, 3).map((use) => (
            <Badge key={use} variant="outline" className="text-xs">{use}</Badge>
          ))}
          {plant.therapeuticUses.length > 3 && <Badge variant="outline" className="text-xs">...</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Link href={`/plants/${plant.id}`} className="w-full">
            <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
