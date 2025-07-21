
// src/app/page.tsx
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default async function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
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

      <main className="flex-1 flex items-center justify-center">
        {/* Hero Section - Simplified */}
        <section className="w-full py-12 flex flex-col items-center justify-center text-center">
          <div className="container px-4 md:px-6 space-y-8">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-primary">
              Virtual Vana
            </h1>
            
            <div className="space-y-6">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Enter the Garden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">
                  Unlock the Year 8 of
                </p>
                <p className="text-2xl font-semibold text-primary">
                  Medieval Plants
                </p>
              </div>
              
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" className="font-medium">
                    Start Exploring Now
                  </Button>
                </Link>
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
        </div>
      </footer>
    </div>
  );
}
