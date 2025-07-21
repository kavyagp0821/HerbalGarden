
// src/app/page.tsx (Landing Page)
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold font-headline">Virtual Vana</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full h-[calc(100vh-3.5rem)] flex items-center justify-center">
           <Image
              src="https://images.unsplash.com/photo-1524807409243-519a74a1a677?q=80&w=1974&auto=format&fit=crop"
              alt="A sunlit path through a lush garden"
              fill
              className="object-cover z-0 brightness-[0.9]"
              priority
              data-ai-hint="garden path"
            />
          <div className="relative z-10 container px-4 md:px-6 text-center animate-fade-in-up">
            <div className="space-y-4 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
                A Journey into Nature's Wisdom
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover the ancient secrets of AYUSH. Explore, identify, and learn about medicinal plants through an immersive digital experience.
              </p>
              <div className="space-x-4 pt-4">
                <Link
                  href="/login"
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6">
                    Enter the Garden <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
