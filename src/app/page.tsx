import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Waypoints, ScanSearch, ClipboardCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section className="relative rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Herbal Garden Banner"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="lush herbal garden"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-4">
              Welcome to the AYUSH Virtual Garden
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl">
              Discover the ancient wisdom of AYUSH medicinal plants through an immersive and interactive experience.
            </p>
            <Link href="/plants">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Explore Plants Now
                <Leaf className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-headline font-semibold mb-6 text-primary">Discover Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Leaf className="w-10 h-10 text-primary" />}
              title="3D Plant Viewer"
              description="Explore detailed 3D models of medicinal plants. Zoom, rotate, and learn about their unique structures."
              link="/plants"
              linkText="View Plants"
            />
            <FeatureCard
              icon={<Waypoints className="w-10 h-10 text-primary" />}
              title="Guided Virtual Tours"
              description="Take curated tours based on health benefits like immunity, digestion, and stress relief."
              link="/tours"
              linkText="Start a Tour"
            />
            <FeatureCard
              icon={<ScanSearch className="w-10 h-10 text-primary" />}
              title="Plant Recognition"
              description="Use your camera to identify plants and get instant information about their properties."
              link="/recognize"
              linkText="Identify a Plant"
            />
            <FeatureCard
              icon={<ClipboardCheck className="w-10 h-10 text-primary" />}
              title="Interactive Quizzes"
              description="Test your knowledge about AYUSH plants with our engaging quizzes and track your learning."
              link="/quizzes"
              linkText="Take a Quiz"
            />
          </div>
        </section>

        <section>
            <Card className="bg-primary-foreground shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">About AYUSH</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                        AYUSH stands for Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy. These are traditional and complementary systems of medicine practiced in India and other parts of the world. This platform aims to bridge traditional knowledge with modern technology to make learning about these medicinal systems accessible and engaging.
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
  linkText: string;
}

function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="items-center text-center">
        <div className="p-3 rounded-full bg-primary/10 mb-2">
            {icon}
        </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardContent className="text-center">
        <Link href={link}>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
            {linkText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
