
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Plant } from '@/types';
import PlantCard from './PlantCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FilterX } from 'lucide-react';
import { Button } from '../ui/button';

interface PlantListProps {
  plants: Plant[];
}

const ALL_ITEMS_FILTER_VALUE = "__ALL_ITEMS__";

export default function PlantList({ plants: initialPlants }: PlantListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapeuticUse, setSelectedTherapeuticUse] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
      
      const matchesTherapeuticUse = (!selectedTherapeuticUse || selectedTherapeuticUse === ALL_ITEMS_FILTER_VALUE) 
                                    ? true 
                                    : plant.therapeuticUses.includes(selectedTherapeuticUse);
      
      const matchesRegion = (!selectedRegion || selectedRegion === ALL_ITEMS_FILTER_VALUE)
                            ? true
                            : plant.region === selectedRegion;

      return matchesSearchTerm && matchesTherapeuticUse && matchesRegion;
    });
  }, [initialPlants, searchTerm, selectedTherapeuticUse, selectedRegion]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTherapeuticUse('');
    setSelectedRegion('');
  };
  
  if (!mounted) {
    // Render a loading state or null until client-side hydration is complete
    // to avoid potential hydration mismatches with Select components.
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-96 bg-muted rounded-lg animate-pulse"></div>)}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-plants" className="block text-sm font-medium text-foreground mb-1">
              Search Plants
            </label>
            <div className="relative">
              <Input
                id="search-plants"
                type="text"
                placeholder="Search by common or Latin name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="filter-therapeutic-use" className="block text-sm font-medium text-foreground mb-1">
              Filter by Therapeutic Use
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
              Filter by Region
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
          {(searchTerm || selectedTherapeuticUse || selectedRegion) && (
            <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto lg:mt-7">
              <FilterX className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          )}
        </div>
      </div>

      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No plants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
