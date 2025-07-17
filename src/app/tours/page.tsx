// src/app/tours/page.tsx
import AppLayout from '@/components/layout/AppLayout';
import TourCard from '@/components/tours/TourCard';
import { plantService } from '@/services/plant.service';
import { Route } from 'lucide-react';

export const metadata = {
  title: 'Virtual Tours | Virtual Vana',
  description: 'Take a guided virtual tour through our themed plant collections.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ToursPage() {
  const tours = await plantService.getTourCategories();

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
            <Route className="w-8 h-8 mr-3" />
            Virtual Tours
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore our curated collections of medicinal plants based on different themes and health benefits.
          </p>
        </header>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <p className="text-xl font-semibold text-foreground">Could Not Load Virtual Tours</p>
            <p className="text-muted-foreground mt-2">There was an issue fetching the tours. Please try again later.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
