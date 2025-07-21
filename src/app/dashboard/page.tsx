
// src/app/dashboard/page.tsx
'use client';

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
      <div className="flex flex-col gap-12">
        <section className="relative rounded-lg overflow-hidden shadow-2xl h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1466096115517-eceec1de73df?q=80&w=1200&h=400&fit=crop"
            alt="Herbal Garden Banner"
            width={1200}
            height={400}
            className="w-full h-full object-cover"
            data-ai-hint="lush herbal garden"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 animate-fade-in-down">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-6 max-w-3xl animate-fade-in-up">
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

        {isLoading ? (
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Plant of the Day</h2>
                <Card className="grid md:grid-cols-2 overflow-hidden shadow-lg">
                    <Skeleton className="h-full w-full aspect-video md:aspect-auto" />
                    <div className="p-6 flex flex-col justify-center">
                         <CardHeader className="p-0 mb-4">
                            <Skeleton className="h-9 w-48 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="p-0 flex-grow mb-4 space-y-2">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                        <CardFooter className="p-0">
                           <Skeleton className="h-10 w-36" />
                        </CardFooter>
                    </div>
                </Card>
            </section>
        ) : plantOfTheDay ? (
            <section>
                 <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Plant of the Day</h2>
                <Card className="grid md:grid-cols-2 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative aspect-video md:aspect-auto">
                        <Image 
                            src={plantOfTheDay.imageSrc}
                            alt={plantOfTheDay.commonName}
                            fill
                            className="object-cover"
                             data-ai-hint={plantOfTheDay.imageHint || plantOfTheDay.commonName}
                        />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-3xl font-headline">{plantOfTheDay.commonName}</CardTitle>
                            <CardDescription className="italic text-md">{plantOfTheDay.latinName}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 text-foreground/80 flex-grow mb-4">
                            <p>{plantOfTheDay.description}</p>
                        </CardContent>
                        <CardFooter className="p-0">
                             <Link href={`/plants/${plantOfTheDay.id}`}>
                                <Button variant="default">
                                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </div>
                </Card>
            </section>
        ) : (
             <section>
                 <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Plant of the Day</h2>
                <Card className="text-center p-8 shadow-lg bg-primary/5 border-primary/20">
                    <CardTitle>Welcome to the Garden!</CardTitle>
                    <CardDescription className="mt-2 max-w-lg mx-auto">
                        It seems our garden is currently empty. Please check back later as we cultivate our collection.
                    </CardDescription>
                </Card>
            </section>
        )}

        <section>
          <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Discover Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Leaf className="w-8 h-8 text-primary" />}
              title="Explore Plants"
              description="Browse detailed information and 3D models of medicinal plants in our extensive collection."
              link="/plants"
            />
            <FeatureCard
              icon={<Route className="w-8 h-8 text-primary" />}
              title="Virtual Tours"
              description="Take guided tours through curated collections of plants based on themes like immunity."
              link="/tours"
            />
             <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="AI Recommendations"
              description="Get personalized plant suggestions from our AI based on your health and wellness goals."
              link="/recommendations"
            />
            <FeatureCard
              icon={<ScanSearch className="w-8 h-8 text-primary" />}
              title="Plant Recognition"
              description="Have a plant you can't identify? Use your camera to get instant information."
              link="/recognize"
            />
             <FeatureCard
              icon={<User className="w-8 h-8 text-primary" />}
              title="Your Progress"
              description="Track your learning journey, complete quizzes, and earn badges for your achievements."
              link="/profile"
            />
          </div>
        </section>

        <section>
            <Card className="bg-primary/10 border-primary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">About AYUSH</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 leading-relaxed max-w-4xl">
                        AYUSH stands for Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy. These are traditional and complementary systems of medicine practiced in India and other parts of the world. This platform aims to bridge this ancient knowledge with modern technology, making learning about these medicinal systems accessible, engaging, and interactive for everyone.
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
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col p-6 animate-fade-in-up">
        <CardHeader className="p-0 mb-4">
            <div className="mb-3">{icon}</div>
            <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
            <CardDescription>{description}</CardDescription>
        </CardContent>
        </Card>
    </Link>
  );
}
