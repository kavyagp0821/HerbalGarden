import AppLayout from '@/components/layout/AppLayout';
import TourCard from '@/components/tours/TourCard';
import { tourCategories } from '@/lib/plant-data';

export const metadata = {
  title: 'Virtual Tours | AYUSH Virtual Garden',
  description: 'Explore guided virtual tours of medicinal plants based on health categories.',
};

export default function ToursPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-semibold text-primary">Guided Virtual Tours</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore collections of medicinal plants grouped by their health benefits and traditional uses.
          </p>
        </header>

        {tourCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourCategories.map(category => (
              <TourCard key={category.id} tourCategory={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No virtual tours available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
