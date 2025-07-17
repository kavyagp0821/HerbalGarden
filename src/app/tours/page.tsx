import AppLayout from '@/components/layout/AppLayout';
import TourCard from '@/components/tours/TourCard';
import { tourCategories as staticTours } from '@/lib/plant-data'; // For icons
import { plantService } from '@/services/plant.service';

export const metadata = {
  title: 'Virtual Tours | Virtual Vana',
  description: 'Explore guided virtual tours of medicinal plants based on health categories.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ToursPage() {
  const tourCategories = await plantService.getTourCategories();

  // Map icons from static data since they can't be stored in Firestore
  const toursWithIcons = tourCategories.map(dbTour => {
    const staticTour = staticTours.find(st => st.id === dbTour.id);
    return {
      ...dbTour,
      icon: staticTour?.icon,
    };
  });


  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-semibold text-primary">Guided Virtual Tours</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore collections of medicinal plants grouped by their health benefits and traditional uses.
          </p>
        </header>

        {toursWithIcons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toursWithIcons.map(category => (
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
