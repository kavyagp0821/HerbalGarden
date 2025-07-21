// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1491841573634-28140fc7b634?q=80&w=2070&auto=format&fit=crop"
          alt="Lush herbal garden with sunlight streaming through."
          fill
          className="object-cover"
          priority
          data-ai-hint="lush herbal garden"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center text-white max-w-4xl animate-fade-in-up">
        <Leaf className="w-20 h-20 mb-6 text-green-300" />
        
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 leading-tight">
          Welcome to Virtual Vana
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">
          Discover the ancient wisdom of AYUSH medicinal plants through an immersive, interactive journey.
        </p>
        
        <Link href="/login">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12 py-8 rounded-full shadow-lg transition-transform hover:scale-105">
            Enter the Garden
          </Button>
        </Link>
      </div>

      <footer className="absolute bottom-4 text-center w-full text-white/70 text-sm z-10">
        <p>&copy; {new Date().getFullYear()} Virtual Vana. All rights reserved.</p>
      </footer>
    </main>
  );
}
