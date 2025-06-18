import AppLayout from '@/components/layout/AppLayout';
import PlantList from '@/components/plants/PlantList';
import { plants } from '@/lib/plant-data';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata = {
  title: 'Explore Medicinal Plants | AYUSH Virtual Garden',
  description: 'Search, filter, and explore a wide variety of medicinal plants used in AYUSH systems.',
};

export default function PlantsPage() {
  return (
    <AppLayout>
        <h1 className="text-3xl font-headline font-semibold mb-8 text-primary">Explore Our Herbal Collection</h1>
        <PlantList plants={plants} />
    </AppLayout>
  );
}
