// src/app/admin/add-plant/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Plant } from '@/types';

const formSchema = z.object({
  id: z.string().min(3, 'ID must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with hyphens only'),
  commonName: z.string().min(3, 'Common name is required'),
  latinName: z.string().min(3, 'Latin name is required'),
  description: z.string().min(10, 'Description is required'),
  therapeuticUses: z.string().min(3, 'Enter at least one therapeutic use'),
  region: z.string().min(3, 'Region is required'),
  classification: z.string().min(3, 'Classification is required'),
  imageSrc: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
  ayushUses: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddPlantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      commonName: '',
      latinName: '',
      description: '',
      therapeuticUses: '',
      region: '',
      classification: '',
      imageSrc: 'https://placehold.co/600x400.png',
      imageHint: '',
      ayushUses: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    
    const plantData: Plant = {
      ...values,
      therapeuticUses: values.therapeuticUses.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add plant');
      }

      toast({
        title: "Plant Added!",
        description: `Successfully added ${values.commonName} to the database.`,
      });
      form.reset();
    } catch (e) {
      console.error('Failed to add plant:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
        title: "Error",
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
              <Leaf className="w-7 h-7 mr-2 text-primary" />
              Add a New Plant to the Database
            </CardTitle>
            <CardDescription>
              Fill out this form to add a new plant to the MongoDB collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="commonName" render={({ field }) => (
                    <FormItem><FormLabel>Common Name</FormLabel><FormControl><Input placeholder="e.g., Tulsi (Holy Basil)" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="latinName" render={({ field }) => (
                    <FormItem><FormLabel>Latin Name</FormLabel><FormControl><Input placeholder="e.g., Ocimum tenuiflorum" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="id" render={({ field }) => (
                    <FormItem><FormLabel>Unique ID</FormLabel><FormControl><Input placeholder="e.g., tulsi-holy-basil" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the plant..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="therapeuticUses" render={({ field }) => (
                    <FormItem><FormLabel>Therapeutic Uses (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., Immunity Booster, Stress Relief" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="region" render={({ field }) => (
                        <FormItem><FormLabel>Region</FormLabel><FormControl><Input placeholder="e.g., Indian Subcontinent" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="classification" render={({ field }) => (
                        <FormItem><FormLabel>Classification</FormLabel><FormControl><Input placeholder="e.g., Lamiaceae family" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="imageSrc" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input type="url" placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageHint" render={({ field }) => (
                    <FormItem><FormLabel>Image Hint (optional)</FormLabel><FormControl><Input placeholder="e.g., tulsi leaves" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="ayushUses" render={({ field }) => (
                    <FormItem><FormLabel>AYUSH Significance (optional)</FormLabel><FormControl><Textarea placeholder="Describe the plant's use in AYUSH systems..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                  {isLoading ? 'Adding...' : 'Add Plant to Database'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
