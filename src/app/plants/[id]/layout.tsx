// src/app/plants/[id]/layout.tsx
import AppLayout from "@/components/layout/AppLayout";
import PlantDetailNav from "@/components/plants/PlantDetailNav";
import { plantService } from "@/services/plant.service";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface PlantDetailLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: PlantDetailLayoutProps) {
  const plant = await plantService.getPlant(params.id);
  if (!plant) {
    return { title: 'Plant Not Found | Virtual Vana' };
  }
  return {
    title: `${plant.commonName} | Virtual Vana`,
    description: `Learn about ${plant.commonName}: its uses, habitat, and more.`,
  };
}

export default async function PlantDetailLayout({ children, params }: PlantDetailLayoutProps) {
  const plant = await plantService.getPlant(params.id);

  if (!plant) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link href="/plants" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
        </Link>
        <header>
            <h1 className="text-4xl font-headline font-bold text-primary">{plant.commonName}</h1>
            <p className="text-xl text-muted-foreground italic mt-1">{plant.latinName}</p>
        </header>

        <PlantDetailNav plantId={plant.id} />
        
        <Separator />
        
        <main>{children}</main>
      </div>
    </AppLayout>
  );
}
