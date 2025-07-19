// src/app/add/page.tsx
'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PlusCircle, Search, CheckCircle } from 'lucide-react';
import { trefleService } from '@/services/trefle.service';
import type { TreflePlant, Plant } from '@/types';
import Image from 'next/image';

export default function AddPlantPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<TreflePlant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [addedPlants, setAddedPlants] = useState<Set<number>>(new Set());

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            const results = await trefleService.search(searchTerm);
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddPlant = async (treflePlant: TreflePlant) => {
        try {
            // Trefle plants don't have 3D models, so threeDModelSrc is omitted.
            const newPlant: Omit<Plant, 'id'> = {
                commonName: treflePlant.common_name || treflePlant.scientific_name,
                latinName: treflePlant.scientific_name,
                description: `A plant from the family ${treflePlant.family}, genus ${treflePlant.genus}.`,
                therapeuticUses: ['Medicinal'], // Default value
                region: 'Global',
                classification: `${treflePlant.family} / ${treflePlant.genus}`,
                imageSrc: treflePlant.image_url || `https://placehold.co/600x400.png`,
                imageHint: treflePlant.common_name || treflePlant.scientific_name,
                ayushUses: "To be determined."
            };

            const response = await fetch('/api/plants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlant),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add plant');
            }
            
            setAddedPlants(prev => new Set(prev).add(treflePlant.id));

        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred while adding the plant.');
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
                            Search the Trefle.io database to find plants and add them to your own curated collection in Firestore.
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

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((plant) => (
                        <Card key={plant.id}>
                            {plant.image_url ? (
                                <div className="aspect-square relative w-full bg-muted">
                                    <Image src={plant.image_url} alt={plant.common_name || plant.scientific_name} fill objectFit="cover" />
                                </div>
                            ) : (
                                <div className="aspect-square bg-muted flex items-center justify-center">
                                    <p className="text-sm text-muted-foreground p-2 text-center">{plant.common_name || plant.scientific_name}</p>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-base">{plant.common_name}</CardTitle>
                                <CardDescription>{plant.scientific_name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => handleAddPlant(plant)} disabled={addedPlants.has(plant.id)} className="w-full">
                                    {addedPlants.has(plant.id) ? <CheckCircle className="mr-2"/> : <PlusCircle className="mr-2"/>}
                                    {addedPlants.has(plant.id) ? 'Added' : 'Add to Collection'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
