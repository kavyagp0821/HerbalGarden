// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Leaf, User, ScanSearch, Sparkles, Route, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { plantService } from '@/services/plant.service';
import { useEffect, useState } from 'react';
import type { Plant } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [plantOfTheDay, setPlantOfTheDay] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlant() {
      setIsLoading(true);
      try {
        const plants = await plantService.getPlants();
        if (plants.length > 0) {
          // Simple logic to pick a new plant each day based on the day of the year
          const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
          setPlantOfTheDay(plants[dayOfYear % plants.length]);
        }
      } catch (error) {
        console.error("Could not fetch plants for Plant of the Day.", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlant();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section className="relative rounded-xl overflow-hidden shadow-2xl h-[350px] animate-fade-in">
          <Image
            src="https://wallpaperaccess.com/full/735812.jpg"
            alt="Herbal Garden Banner"
            fill
            className="w-full h-full object-cover"
            data-ai-hint="lush green foliage"
            priority
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
              Welcome to the Herbal Garden
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl animate-fade-in-up">
              Discover the ancient wisdom of AYUSH medicinal plants through an immersive, interactive experience.
            </p>
            <Link href="/plants">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6">
                Explore the Garden
                <Leaf className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="animate-fade-in-up">
          <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Plant of the Day</h2>
          {isLoading ? (
            <Card className="overflow-hidden shadow-lg">
              <div className="md:flex">
                <Skeleton className="md:w-1/3 h-64 md:h-auto" />
                <div className="p-6 md:w-2/3">
                  <Skeleton className="h-8 w-4/5 mb-2" />
                  <Skeleton className="h-5 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </Card>
          ) : plantOfTheDay ? (
             <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                    <div className="md:w-1/3 relative h-64 md:h-auto">
                        <Image
                            src={plantOfTheDay.imageSrc}
                            alt={plantOfTheDay.commonName}
                            fill
                            className="object-cover"
                            data-ai-hint={plantOfTheDay.imageHint || plantOfTheDay.commonName}
                        />
                    </div>
                    <div className="md:w-2/3 flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{plantOfTheDay.commonName}</CardTitle>
                            <CardDescription className="italic text-base">{plantOfTheDay.latinName}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-foreground/80 text-base line-clamp-3">{plantOfTheDay.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/plants/${plantOfTheDay.id}`} className="w-full">
                                <Button variant="default" className="w-full">
                                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </div>
                </div>
            </Card>
          ) : (
            <Card className="text-center p-8 shadow-lg bg-primary/5 border-primary/20">
              <CardTitle>Welcome to the Garden!</CardTitle>
              <CardDescription className="mt-2 max-w-lg mx-auto">
                It seems our garden is currently empty. Please check back later.
              </CardDescription>
            </Card>
          )}
        </section>

        <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Discover Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Leaf />}
              title="Explore Plants"
              description="Browse our extensive collection of medicinal plants."
              link="/plants"
            />
            <FeatureCard
              icon={<Route />}
              title="Virtual Tours"
              description="Take guided tours through curated collections."
              link="/tours"
            />
            <FeatureCard
              icon={<Sparkles />}
              title="Get Recommendation"
              description="Get personalized plant suggestions from our AI."
              link="/recommendations"
            />
            <FeatureCard
              icon={<ScanSearch />}
              title="Plant Recognition"
              description="Identify plants instantly with your camera."
              link="/recognize"
            />
            <FeatureCard
              icon={<User />}
              title="Your Progress"
              description="Track your journey, complete quizzes, and earn badges."
              link="/profile"
            />
          </div>
        </section>

        <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Card className="bg-primary/10 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">About AYUSH</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed max-w-4xl">
                AYUSH stands for Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy. These are traditional and complementary systems of medicine practiced in India. This platform aims to bridge this ancient knowledge with modern technology.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Link href={link} className="group">
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex items-start gap-4 p-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
          </div>
          <div className="flex-1">
            <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </Card>
    </Link>
  );
}
