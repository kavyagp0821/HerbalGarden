// src/app/add/page.tsx
'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PlusCircle, Search, CheckCircle, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { trefleService } from '@/services/trefle.service';
import type { TreflePlant, Plant } from '@/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Helper to convert a Trefle plant to our Plant format
const adaptTrefleToPlant = (treflePlant: TreflePlant): Omit<Plant, 'id'> => {
    return {
        commonName: treflePlant.common_name || treflePlant.scientific_name,
        latinName: treflePlant.scientific_name,
        description: `A plant from the family ${treflePlant.family || 'Unknown'}, genus ${treflePlant.genus || 'Unknown'}. Further details can be researched.`,
        therapeuticUses: [], // Needs to be populated manually or via another AI call
        region: 'Varies',
        classification: `${treflePlant.family || 'N/A'} / ${treflePlant.genus || 'N/A'}`,
        imageSrc: treflePlant.image_url || 'https://placehold.co/600x400.png',
        imageHint: treflePlant.common_name || treflePlant.scientific_name,
        ayushUses: 'To be determined.',
    };
};


export default function AddPlantPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<TreflePlant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [addedPlants, setAddedPlants] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            const results = await trefleService.search(searchTerm);
            setSearchResults(results);
            if (results.length === 0) {
                toast({
                    title: "No Results Found",
                    description: `No plants matching "${searchTerm}" were found in the Trefle database.`,
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            toast({
                title: "Search Error",
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddPlant = async (treflePlant: TreflePlant) => {
        setIsAdding(treflePlant.id);
        try {
            const newPlantData = adaptTrefleToPlant(treflePlant);
            const response = await fetch('/api/plants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlantData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add plant to database.');
            }

            const result = await response.json();
            setAddedPlants(prev => new Set(prev).add(treflePlant.id));
            toast({
                title: "Plant Added!",
                description: `${newPlantData.commonName} has been added to your collection.`,
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast({
                title: "Error Adding Plant",
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsAdding(null);
        }
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center">
                            <PlusCircle className="w-7 h-7 mr-2 text-primary" />
                            Add Plants to Your Collection
                        </CardTitle>
                        <CardDescription>
                            Search the Trefle.io database to find new plants and add them to your collection in Firestore.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search for a plant..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {error && !isLoading && (
                    <Alert variant="destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((plant) => (
                        <Card key={plant.id}>
                            <div className="aspect-square relative w-full bg-muted">
                                <Image 
                                    src={plant.image_url || 'https://placehold.co/400x400.png'} 
                                    alt={plant.common_name || plant.scientific_name} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-base">{plant.common_name || 'N/A'}</CardTitle>
                                <CardDescription>{plant.scientific_name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => handleAddPlant(plant)} disabled={addedPlants.has(plant.id) || isAdding === plant.id} className="w-full">
                                    {isAdding === plant.id ? <Loader2 className="mr-2 animate-spin"/> :
                                     addedPlants.has(plant.id) ? <CheckCircle className="mr-2"/> : <PlusCircle className="mr-2"/>
                                    }
                                    {isAdding === plant.id ? 'Adding...' : addedPlants.has(plant.id) ? 'Added' : 'Add to Collection'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
