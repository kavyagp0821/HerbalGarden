// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, HeartPulse, ArrowRight, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Authentic Knowledge',
      description: 'Learn the medicinal uses, cultural significance, and history of each plant based on AYUSH principles.',
    },
    {
      icon: Globe,
      title: 'Interactive Exploration',
      description: 'Utilize our AI tools for plant recognition, get personalized recommendations, and take guided tours.',
    },
    {
      icon: HeartPulse,
      title: 'For Everyone',
      description: "Whether you're a curious beginner or a seasoned herbalist, Virtual Vana offers a rich learning experience.",
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Explore',
      description: 'Navigate our extensive collection of plants through the gallery, tours, or search.',
    },
    {
      step: 2,
      title: 'Learn',
      description: 'Select any plant to view its detailed profile, including uses, cultivation, and 3D models.',
    },
    {
      step: 3,
      title: 'Interact',
      description: 'Save your favorite plants, take notes, and test your knowledge with quizzes.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold text-lg">Virtual Vana</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/login">
            <Button>
              Enter the Garden
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-card">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1466096115517-eceec1de73df?q=80&w=1800&auto=format&fit=crop"
              alt="A lush herbal garden"
              fill
              className="object-cover brightness-[0.6]"
              priority
              data-ai-hint="lush herbal garden"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>

          <div className="relative z-10 container px-4 md:px-6 animate-fade-in-up">
            <div className="space-y-4 max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-primary-foreground">
                Unlock the Secrets of Medicinal Plants
              </h1>
              <p className="mx-auto text-lg md:text-xl text-primary-foreground/90">
                Discover the ancient secrets of AYUSH. Explore, identify, and learn about medicinal plants in an immersive digital garden.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6">
                    Start Exploring Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Explore Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6 animate-fade-in-up">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">Why Explore Virtual Vana?</h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Our platform is meticulously designed for students, herbalists, and nature lovers to dive deep into the world of medicinal plants.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col text-center items-center p-6 bg-card/80 backdrop-blur-sm shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="p-0">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2 flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6 animate-fade-in-up">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">How It Works</h2>
               <p className="max-w-xl mx-auto text-lg text-muted-foreground">
                Getting started is as easy as a walk in the garden.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {steps.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center p-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Leaf className="h-6 w-6 text-primary"/>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built for the modern herbalist.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <Link href="#" className="underline-offset-4 hover:underline">About</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
