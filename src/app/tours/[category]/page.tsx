import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import { tourCategories as staticTours } from '@/lib/plant-data'; // For icons
import type { Plant } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TourCategoryPageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  const categories = await plantService.getTourCategories();
  return categories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: TourCategoryPageProps) {
  const category = await plantService.getTourCategory(params.category);
  if (!category) {
    return { title: 'Tour Not Found' };
  }
  return {
    title: `${category.name} Tour | AYUSH Virtual Garden`,
    description: `Explore plants related to ${category.name.toLowerCase()} in this guided virtual tour.`,
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TourCategoryPage({ params }: TourCategoryPageProps) {
  const category = await plantService.getTourCategory(params.category);
  
  if (!category) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Tour Category Not Found</h1>
          <p className="text-muted-foreground">Sorry, we couldn't find the tour category you're looking for.</p>
           <Link href="/tours" className="mt-6 inline-block">
            <Button>Back to Tours</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const plantsInTour = await plantService.getPlantsForTour(category.plantIds);
  const staticTour = staticTours.find(st => st.id === category.id);
  const TourIcon = staticTour?.icon;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="mb-8">
          <Link href="/tours" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All Tours
          </Link>
          <div className="flex items-center">
            {TourIcon && <TourIcon className="w-10 h-10 mr-3 text-primary" />}
            <div>
              <h1 className="text-3xl font-headline font-semibold text-primary">{category.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{category.description}</p>
            </div>
          </div>
        </header>

        {plantsInTour.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plantsInTour.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No plants found in this tour category.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
