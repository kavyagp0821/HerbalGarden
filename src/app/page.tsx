// src/app/page.tsx
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, BookOpen, Globe, HeartPulse } from 'lucide-react';

export default async function LandingPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold font-headline text-lg">Virtual Vana</span>
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
        <section className="relative w-full py-24 md:py-32 lg:py-40 flex items-center justify-center text-center">
          <Image
            src="https://images.unsplash.com/photo-1466096115517-eceec1de73df?q=80&w=1200&h=400&fit=crop"
            alt="A lush herbal garden"
            fill
            className="object-cover z-0 brightness-[0.6]"
            priority
            data-ai-hint="lush herbal garden"
          />
          <div className="relative z-10 container px-4 md:px-6 animate-fade-in-up">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary-foreground font-headline">
                Unlock the Secrets of Medicinal Plants
              </h1>
              <p className="mx-auto text-lg md:text-xl text-primary-foreground/90">
                Discover the ancient secrets of AYUSH. Explore, identify, and learn about medicinal plants in an immersive digital garden.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6">
                    Start Exploring Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Explore Section */}
        <section id="why-explore" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Why Explore Virtual Vana?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is meticulously designed for students, herbalists, and nature lovers to dive deep into the world of medicinal plants.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="flex flex-col gap-1 text-center p-6 rounded-lg bg-card shadow-md animate-fade-in">
                <BookOpen className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-xl font-bold font-headline">Authentic Knowledge</h3>
                <p className="text-sm text-muted-foreground flex-grow">Learn the medicinal uses, cultural significance, and history of each plant based on AYUSH principles.</p>
              </div>
              <div className="flex flex-col gap-1 text-center p-6 rounded-lg bg-card shadow-md animate-fade-in" style={{animationDelay: '200ms'}}>
                <Globe className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-xl font-bold font-headline">Interactive Exploration</h3>
                <p className="text-sm text-muted-foreground flex-grow">Utilize our AI tools for plant recognition, get personalized recommendations, and take guided tours.</p>
              </div>
              <div className="flex flex-col gap-1 text-center p-6 rounded-lg bg-card shadow-md animate-fade-in" style={{animationDelay: '400ms'}}>
                <HeartPulse className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-xl font-bold font-headline">For Everyone</h3>
                <p className="text-sm text-muted-foreground flex-grow">Whether you're a curious beginner or a seasoned herbalist, Virtual Vana offers a rich learning experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline text-primary">How It Works</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Getting started is as easy as a walk in the garden.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary text-primary-foreground mb-2">
                    <span className="font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-bold text-xl font-headline">Explore</h3>
                  <p className="text-sm text-muted-foreground">Navigate our extensive collection of plants through the gallery, tours, or search.</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                   <div className="p-3 rounded-full bg-primary text-primary-foreground mb-2">
                    <span className="font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-bold text-xl font-headline">Learn</h3>
                  <p className="text-sm text-muted-foreground">Select any plant to view its detailed profile, including uses, cultivation, and 3D models.</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                   <div className="p-3 rounded-full bg-primary text-primary-foreground mb-2">
                    <span className="font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-bold text-xl font-headline">Interact</h3>
                  <p className="text-sm text-muted-foreground">Save your favorite plants, take notes, and test your knowledge with quizzes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Leaf className="h-6 w-6 text-primary"/>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built for the modern herbalist.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">About</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
