import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plants as allPlants, tourCategories } from '@/lib/plant-data';
import type { Plant } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TourCategoryPageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  return tourCategories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: TourCategoryPageProps) {
  const category = tourCategories.find(c => c.id === params.category);
  if (!category) {
    return { title: 'Tour Not Found' };
  }
  return {
    title: `${category.name} Tour | AYUSH Virtual Garden`,
    description: `Explore plants related to ${category.name.toLowerCase()} in this guided virtual tour.`,
  };
}

export default function TourCategoryPage({ params }: TourCategoryPageProps) {
  const category = tourCategories.find(c => c.id === params.category);

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

  const plantsInTour = allPlants.filter(plant => category.plantIds.includes(plant.id));

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="mb-8">
          <Link href="/tours" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All Tours
          </Link>
          <div className="flex items-center">
            {category.icon && <category.icon className="w-10 h-10 mr-3 text-primary" />}
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
