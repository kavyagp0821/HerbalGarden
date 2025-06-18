import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Plant } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/plants/${plant.id}`} aria-label={`View details for ${plant.commonName}`}>
          <div className="aspect-[3/2] relative w-full overflow-hidden">
            <Image
              src={plant.imageSrc}
              alt={plant.commonName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={plant.imageHint || plant.commonName.toLowerCase()}
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
        <CardDescription className="italic text-sm text-muted-foreground mb-2">
          {plant.latinName}
        </CardDescription>
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
          {plant.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {plant.therapeuticUses.slice(0, 3).map((use) => (
            <Badge key={use} variant="secondary" className="text-xs">{use}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/plants/${plant.id}`} className="w-full">
          <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
