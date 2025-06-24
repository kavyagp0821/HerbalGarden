import AppLayout from '@/components/layout/AppLayout';
import PlantList from '@/components/plants/PlantList';
import { plantService } from '@/services/plant.service';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata = {
  title: 'Explore Medicinal Plants | AYUSH Virtual Garden',
  description: 'Search, filter, and explore a wide variety of medicinal plants used in AYUSH systems.',
};

// Revalidate this page every hour to fetch new data from Firestore
export const revalidate = 3600;

export default async function PlantsPage() {
  const plants = await plantService.getPlants();

  return (
    <AppLayout>
        <h1 className="text-3xl font-headline font-semibold mb-8 text-primary">Explore Our Herbal Collection</h1>
        <PlantList plants={plants} />
    </AppLayout>
  );
}
