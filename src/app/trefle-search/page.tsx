// src/app/trefle-search/page.tsx
'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TreflePlant } from '@/types';
import { trefleService } from '@/services/trefle.service';
import TreflePlantCard from '@/components/trefle/TreflePlantCard';

export default function TrefleSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<TreflePlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Search term required',
        description: 'Please enter a plant name to search.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await trefleService.search(searchTerm);
      setResults(searchResults);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Search Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              Trefle Plant Database Search
            </CardTitle>
            <CardDescription>
              Explore a vast collection of plants from the Trefle.io database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="e.g., Coconut, Rose, Sunflower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isLoading}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">{isLoading ? 'Searching...' : 'Search'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>Error: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Searching the Trefle database...</p>
          </div>
        ) : hasSearched && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((plant) => (
              <TreflePlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : hasSearched && (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <p className="text-xl font-semibold text-foreground">No Plants Found</p>
            <p className="text-muted-foreground mt-2">Try a different search term.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
