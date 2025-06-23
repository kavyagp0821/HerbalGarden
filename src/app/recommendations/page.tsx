
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Wand2, Leaf } from 'lucide-react';
import { recommendPlants, RecommendPlantsOutput, RecommendPlantsInput } from '@/ai/flows/recommend-plants-flow';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  healthInterest: z.string().min(3, {
    message: "Please enter at least 3 characters for your health interest.",
  }),
});

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendPlantsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      healthInterest: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const recommendationResult = await recommendPlants({ healthInterest: values.healthInterest });
      setResult(recommendationResult);
      toast({
        title: "Recommendations Ready!",
        description: "Here are some plants you might find interesting.",
      });
    } catch (e) {
      console.error('Recommendation error:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
        title: "Recommendation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Sparkles className="w-7 h-7 mr-2 text-primary" />
              AI Plant Recommendations
            </CardTitle>
            <CardDescription>
              Tell us a health interest (e.g., "better sleep", "digestion", "skin health"), and our AI expert will suggest relevant AYUSH plants for you to explore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="healthInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Health Interest</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., stress relief, immunity..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Thinking...' : 'Get Recommendations'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && result.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Plants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.recommendations.map((plant, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-primary" />
                      {plant.commonName}
                    </CardTitle>
                    <CardDescription>{plant.latinName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 mb-3"><strong className="text-foreground">Reason:</strong> {plant.reason}</p>
                    {plant.id && (
                        <Link href={`/plants/${plant.id}`}>
                            <Button variant="outline" size="sm">Explore this plant</Button>
                        </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
