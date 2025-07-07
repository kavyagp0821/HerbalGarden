// src/app/trefle-search/page.tsx
'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TreflePlantCard from '@/components/trefle/TreflePlantCard';
import type { TrefleSearchResponse } from '@/types';

export default function TrefleSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TrefleSearchResponse | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length < 3) {
      toast({
        title: "Search term too short",
        description: "Please enter at least 3 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch(`/api/trefle/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch search results.');
      }
      const data: TrefleSearchResponse = await response.json();
      setResults(data);
      if (data.data.length === 0) {
        toast({
            title: "No results found",
            description: `Your search for "${searchTerm}" did not return any plants.`,
        });
      }
    } catch (error) {
      console.error("Trefle search failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Globe className="w-7 h-7 mr-2 text-primary" />
              Search the Trefle Plant Database
            </CardTitle>
            <CardDescription>
              Explore a vast database of plants from around the world using the Trefle.io API. Found something you like? Save it to your personal garden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder="e.g., Coconut, Sunflower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="min-w-fit">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="h-[400px]">
                        <div className="w-full h-full bg-muted animate-pulse rounded-lg"></div>
                    </Card>
                ))}
            </div>
        )}

        {results && results.data.length > 0 && (
          <div>
            <h2 className="text-2xl font-headline mb-4">
              Found {results.meta.total} results for &quot;{searchTerm}&quot;
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.data.map((plant) => (
                <TreflePlantCard key={plant.id} treflePlant={plant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
