// src/app/tours/[id]/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf } from 'lucide-react';
import { lucideIconMapping } from '@/lib/icon-mapping';

interface TourPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TourPageProps) {
  const tour = await plantService.getTourCategory(params.id);
  if (!tour) {
    return { title: 'Tour Not Found | Virtual Vana' };
  }
  return {
    title: `${tour.name} Tour | Virtual Vana`,
    description: tour.description,
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const tour = await plantService.getTourCategory(params.id);

  if (!tour) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-primary mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the tour you were looking for.
          </p>
          <Link href="/tours">
            <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Tours
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const plantsInTour = await plantService.getPlantsForTour(tour.plantIds);
  const TourIcon = typeof tour.icon === 'string' ? lucideIconMapping[tour.icon] || Leaf : tour.icon || Leaf;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
            <Link href="/tours" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Tours
            </Link>
          <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
            {TourIcon && <TourIcon className="w-8 h-8 mr-3" />}
            {tour.name}
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
            {tour.description}
          </p>
        </header>

        {plantsInTour.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plantsInTour.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <p className="text-xl font-semibold text-foreground">No Plants in this Tour Yet</p>
            <p className="text-muted-foreground mt-2">
                The plants for this tour are being curated. Please check back later.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
