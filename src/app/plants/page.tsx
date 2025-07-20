// src/app/plants/page.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PlantCard from '@/components/plants/PlantCard';
import { plantService } from '@/services/plant.service';
import type { Plant } from '@/types';
import { Leaf, AlertTriangle, RotateCw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedUse, setSelectedUse] = useState('all');


  const loadPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPlants = await plantService.getPlants();
      setPlants(fetchedPlants);
    } catch (error) {
      console.error('Failed to load plants:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const { uniqueRegions, uniqueUses } = useMemo(() => {
    const regions = new Set<string>();
    const uses = new Set<string>();
    plants.forEach((plant) => {
      regions.add(plant.region);
      plant.therapeuticUses.forEach((use) => uses.add(use));
    });
    return {
      uniqueRegions: Array.from(regions).sort(),
      uniqueUses: Array.from(uses).sort(),
    };
  }, [plants]);

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const nameMatch =
        plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.latinName.toLowerCase().includes(searchTerm.toLowerCase());
      const regionMatch = selectedRegion === 'all' || plant.region === selectedRegion;
      const useMatch =
        selectedUse === 'all' || plant.therapeuticUses.includes(selectedUse);
      return nameMatch && regionMatch && useMatch;
    });
  }, [plants, searchTerm, selectedRegion, selectedUse]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('all');
    setSelectedUse('all');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Plants</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{error}</p>
            <Button onClick={loadPlants} variant="secondary" size="sm">
              <RotateCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (filteredPlants.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      );
    }
    
    if (plants.length > 0 && filteredPlants.length === 0) {
       return (
            <div className="text-center py-16 bg-card rounded-lg shadow-sm col-span-full">
                <p className="text-xl font-semibold text-foreground">No Plants Match Your Filters</p>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what you're looking for.
                </p>
                 <Button onClick={resetFilters} variant="link" className="mt-2">
                    Reset Filters
                </Button>
            </div>
       )
    }

    return (
      <div className="text-center py-16 bg-card rounded-lg shadow-sm">
        <p className="text-xl font-semibold text-foreground">The Garden is Being Prepared</p>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          It looks like the plant collection is currently empty. The data may be loading or is not yet available.
        </p>
      </div>
    );
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center">
            <Leaf className="w-10 h-10 mr-4" />
            Explore the Garden
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
            Discover our curated collection of medicinal plants. Click on any plant to see its detailed profile, including therapeutic uses and cultivation information.
          </p>
        </header>

        <Card className="p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label htmlFor="search-plant" className="text-sm font-medium text-muted-foreground">Search by Name</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="search-plant"
                            placeholder="Search for Tulsi, Ashwagandha..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="region-filter" className="text-sm font-medium text-muted-foreground">Filter by Region</label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger id="region-filter">
                            <SelectValue placeholder="All Regions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            {uniqueRegions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="use-filter" className="text-sm font-medium text-muted-foreground">Filter by Use</label>
                    <Select value={selectedUse} onValueChange={setSelectedUse}>
                        <SelectTrigger id="use-filter">
                            <SelectValue placeholder="All Uses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Uses</SelectItem>
                            {uniqueUses.map(use => <SelectItem key={use} value={use}>{use}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
        
        {renderContent()}

      </div>
    </AppLayout>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col h-full overflow-hidden shadow-lg rounded-lg border bg-card">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 flex-grow">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>
            <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}
