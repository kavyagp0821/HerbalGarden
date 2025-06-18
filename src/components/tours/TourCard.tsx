import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TourCategory } from '@/types';
import { ArrowRight } from 'lucide-react';

interface TourCardProps {
  tourCategory: TourCategory;
}

export default function TourCard({ tourCategory }: TourCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/tours/${tourCategory.id}`} aria-label={`Start tour: ${tourCategory.name}`}>
          <div className="aspect-video relative w-full overflow-hidden">
             <Image
              src={tourCategory.imageSrc}
              alt={tourCategory.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={tourCategory.imageHint || tourCategory.name.toLowerCase()}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          {tourCategory.icon && <tourCategory.icon className="w-6 h-6 mr-2 text-primary" />}
          <CardTitle className="text-xl font-headline">
            <Link href={`/tours/${tourCategory.id}`} className="hover:text-primary transition-colors">
              {tourCategory.name}
            </Link>
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-foreground/80 line-clamp-3">
          {tourCategory.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/tours/${tourCategory.id}`} className="w-full">
          <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
            Start Tour <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
