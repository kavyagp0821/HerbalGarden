// src/app/plants/[id]/layout.tsx
'use client';

import AppLayout from "@/components/layout/AppLayout";
import PlantDetailNav from "@/components/plants/PlantDetailNav";
import { plantService } from "@/services/plant.service";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import type { Plant } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageProvider } from "@/context/LanguageContext";

interface PlantDetailLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function PlantDetailLayout({ children, params }: PlantDetailLayoutProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlantData() {
        const fetchedPlant = await plantService.getPlant(params.id);
        if (fetchedPlant) {
            setPlant(fetchedPlant);
        } else {
            notFound();
        }
        setIsLoading(false);
    }
    fetchPlantData();
  }, [params.id]);
  
  // This is a bit of a workaround to avoid a separate metadata function
  useEffect(() => {
    if (plant) {
        document.title = `${plant.commonName} | Virtual Vana`;
    }
  }, [plant]);


  if (isLoading || !plant) {
    // A simple loader while waiting for plant data
    return <AppLayout><div className="text-center p-10">Loading plant details...</div></AppLayout>;
  }

  return (
    <LanguageProvider value={{ targetLanguage, setTargetLanguage }}>
        <AppLayout>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Link href="/plants" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Explore
                </Link>
                 <div>
                    <label htmlFor="language-select" className="sr-only">Language</label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger id="language-select" className="w-[180px]">
                             <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <header>
                <h1 className="text-4xl font-headline font-bold text-primary">{plant.commonName}</h1>
                <p className="text-xl text-muted-foreground italic mt-1">{plant.latinName}</p>
            </header>

            <PlantDetailNav plantId={plant.id} />
            
            <Separator />
            
            <main>{children}</main>
        </div>
        </AppLayout>
    </LanguageProvider>
  );
}
