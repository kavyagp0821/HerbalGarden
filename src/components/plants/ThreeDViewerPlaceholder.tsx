import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Orbit } from 'lucide-react'; // Using Orbit as a placeholder for 3D interaction

interface ThreeDViewerPlaceholderProps {
  plantName: string;
  imageSrc: string;
  imageHint?: string;
}

export default function ThreeDViewerPlaceholder({ plantName, imageSrc, imageHint }: ThreeDViewerPlaceholderProps) {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-video relative bg-muted flex flex-col items-center justify-center text-center p-4">
          <Image
            src={imageSrc}
            alt={`Visual representation of ${plantName}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain opacity-50"
            data-ai-hint={imageHint || `botanical illustration ${plantName.toLowerCase()}`}
          />
          <div className="z-10 bg-background/80 p-4 rounded-lg">
            <Orbit className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Interactive 3D Model: {plantName}</h3>
            <p className="text-sm text-muted-foreground">Rotate, zoom, and explore the plant structure in 3D.</p>
            <p className="text-xs text-muted-foreground mt-2">(3D Model Viewer Placeholder)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
