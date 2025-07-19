
// src/components/plants/SeedButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sprout, Loader2 } from 'lucide-react';

export default function SeedButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSeed = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/plants/seed', {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to seed database');
            }
            
            toast({
                title: "Database Seeded!",
                description: data.message,
            });

            // Refresh the page to show the new plants
            router.refresh();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({
                title: "Seeding Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleSeed} disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                </>
            ) : (
                <>
                    <Sprout className="mr-2 h-4 w-4" />
                    Click Here to Seed the Garden
                </>
            )}
        </Button>
    );
}
