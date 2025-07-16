
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Plant } from '@/types';
import PlantCard from './PlantCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FilterX } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PlantListProps {
  plants: Plant[];
}

const ALL_ITEMS_FILTER_VALUE = "__ALL_ITEMS__";

export default function PlantList({ plants: initialPlants }: PlantListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapeuticUse, setSelectedTherapeuticUse] = useState(ALL_ITEMS_FILTER_VALUE);
  const [selectedRegion, setSelectedRegion] = useState(ALL_ITEMS_FILTER_VALUE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    // This prevents hydration mismatches with client-side state and logic.
    setMounted(true);
  }, []);

  const therapeuticUses = useMemo(() => {
    const allUses = new Set<string>();
    initialPlants.forEach(plant => plant.therapeuticUses.forEach(use => allUses.add(use)));
    return Array.from(allUses).sort();
  }, [initialPlants]);

  const regions = useMemo(() => {
    const allRegions = new Set<string>();
    initialPlants.forEach(plant => allRegions.add(plant.region));
    return Array.from(allRegions).sort();
  }, [initialPlants]);

  const filteredPlants = useMemo(() => {
    return initialPlants.filter(plant => {
      const matchesSearchTerm = plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                plant.latinName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTherapeuticUse = (selectedTherapeuticUse === ALL_ITEMS_FILTER_VALUE) 
                                    ? true 
                                    : plant.therapeuticUses.includes(selectedTherapeuticUse);
      
      const matchesRegion = (selectedRegion === ALL_ITEMS_FILTER_VALUE)
                            ? true
                            : plant.region === selectedRegion;

      return matchesSearchTerm && matchesTherapeuticUse && matchesRegion;
    });
  }, [initialPlants, searchTerm, selectedTherapeuticUse, selectedRegion]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTherapeuticUse(ALL_ITEMS_FILTER_VALUE);
    setSelectedRegion(ALL_ITEMS_FILTER_VALUE);
  };
  
  const hasActiveFilters = searchTerm || selectedTherapeuticUse !== ALL_ITEMS_FILTER_VALUE || selectedRegion !== ALL_ITEMS_FILTER_VALUE;

  if (!mounted) {
    // Render a loading state or null until client-side hydration is complete
    // to avoid potential hydration mismatches with Select components.
    return (
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
              <CardTitle className="text-xl font-headline">Find Your Plant</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-96 bg-muted rounded-lg animate-pulse"></div>)}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl font-headline">Find Your Plant</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="search-plants" className="block text-sm font-medium text-foreground mb-1">
                    Search by Name
                    </label>
                    <div className="relative">
                    <Input
                        id="search-plants"
                        type="text"
                        placeholder="e.g., Tulsi, Ashwagandha..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                <div>
                    <label htmlFor="filter-therapeutic-use" className="block text-sm font-medium text-foreground mb-1">
                    Therapeutic Use
                    </label>
                    <Select value={selectedTherapeuticUse} onValueChange={setSelectedTherapeuticUse}>
                    <SelectTrigger id="filter-therapeutic-use">
                        <SelectValue placeholder="All Uses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_ITEMS_FILTER_VALUE}>All Uses</SelectItem>
                        {therapeuticUses.map(use => (
                        <SelectItem key={use} value={use}>{use}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="filter-region" className="block text-sm font-medium text-foreground mb-1">
                    Region
                    </label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger id="filter-region">
                        <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_ITEMS_FILTER_VALUE}>All Regions</SelectItem>
                        {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                {hasActiveFilters && (
                    <div className="lg:col-start-4">
                        <Button onClick={resetFilters} variant="ghost" className="w-full text-primary">
                            <FilterX className="mr-2 h-4 w-4" /> Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>

      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg shadow-sm">
          <p className="text-xl font-semibold text-foreground">No Plants Found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
           {hasActiveFilters && (
            <Button onClick={resetFilters} variant="link" className="mt-4">
                Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
