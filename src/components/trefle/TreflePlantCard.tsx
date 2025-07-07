// src/components/trefle/TreflePlantCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, CheckCircle } from 'lucide-react';
import type { TreflePlant, Plant as AppPlant } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TreflePlantCardProps {
  treflePlant: TreflePlant;
}

// Helper function to convert Trefle data to our app's Plant format
const trefleDataToAppPlant = (treflePlant: TreflePlant): AppPlant => {
    return {
        id: `trefle-${treflePlant.id}`, // Create a unique ID
        commonName: treflePlant.common_name || 'Unknown',
        latinName: treflePlant.scientific_name,
        description: `A plant from the family ${treflePlant.family_common_name || treflePlant.family}. Found in the Trefle database.`,
        therapeuticUses: [], // Trefle basic search doesn't provide this
        region: 'Unknown', // Trefle basic search doesn't provide this
        classification: treflePlant.family || 'Unknown',
        imageSrc: treflePlant.image_url,
        imageHint: treflePlant.common_name?.toLowerCase(),
        ayushUses: 'Not specified in Trefle basic data. Further research may be needed to determine AYUSH significance.',
    };
};

export default function TreflePlantCard({ treflePlant }: TreflePlantCardProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { toast } = useToast();

    const handleSaveToGarden = async () => {
        setIsSaving(true);
        const plantData = trefleDataToAppPlant(treflePlant);

        try {
            const response = await fetch('/api/plants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plantData),
            });

            if (response.status === 409) { // Conflict - already exists
                toast({
                    title: "Already in Garden",
                    description: `${plantData.commonName} is already in your database.`,
                });
                setIsSaved(true);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save plant.');
            }
            
            toast({
                title: "Plant Saved!",
                description: `${plantData.commonName} has been added to your garden database.`,
            });
            setIsSaved(true);

        } catch (error) {
            console.error("Failed to save plant:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
             toast({
                title: "Error Saving Plant",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
                <div className="aspect-[3/2] relative w-full overflow-hidden">
                    <Image
                        src={treflePlant.image_url}
                        alt={treflePlant.common_name || treflePlant.scientific_name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-xl font-headline mb-1">
                    {treflePlant.common_name || 'N/A'}
                </CardTitle>
                <CardDescription className="italic text-sm text-muted-foreground mb-2">
                    {treflePlant.scientific_name}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                        Family: {treflePlant.family_common_name || treflePlant.family}
                    </Badge>
                     <Badge variant="secondary" className="text-xs">
                        Year: {treflePlant.year}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button 
                    onClick={handleSaveToGarden} 
                    disabled={isSaving || isSaved}
                    className="w-full"
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaved && <CheckCircle className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : (isSaved ? 'Saved to Garden' : 'Save to My Garden')}
                </Button>
            </CardFooter>
        </Card>
    );
}
