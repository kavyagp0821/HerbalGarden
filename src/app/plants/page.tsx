import AppLayout from '@/components/layout/AppLayout';
import TreflePlantCard from '@/components/trefle/TreflePlantCard';
import { trefleService } from '@/services/trefle.service';
import type { TreflePlant } from '@/types';

export const metadata = {
  title: 'Explore Plants | Virtual Vana',
  description: 'Explore a wide variety of plants from the Trefle database.',
};

// Revalidate this page every hour to fetch new data
export const revalidate = 3600;

export default async function PlantsPage() {
  // Fetching a general list of plants from Trefle
  const plants: TreflePlant[] = await trefleService.list();

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-headline font-semibold text-primary">Explore Our Plant Collection</h1>
             <p className="text-lg text-muted-foreground mt-2">
                Discover plants from around the world, powered by the Trefle database.
            </p>
        </header>

        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <TreflePlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <p className="text-xl font-semibold text-foreground">Could Not Load Plants</p>
            <p className="text-muted-foreground mt-2">There was an issue fetching plant data from the Trefle API. Please try again later.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
