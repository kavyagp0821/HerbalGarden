import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Orbit, ZoomIn, ZoomOut, Move3d } from 'lucide-react';

interface ThreeDViewerPlaceholderProps {
  plantName: string;
  imageSrc: string;
  threeDModelSrc?: string;
  imageHint?: string;
}

export default function ThreeDViewerPlaceholder({ plantName, imageSrc, threeDModelSrc, imageHint }: ThreeDViewerPlaceholderProps) {
  if (!threeDModelSrc) {
    return (
       <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="aspect-video relative bg-muted flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={`Visual representation of ${plantName}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                data-ai-hint={imageHint || `botanical illustration ${plantName.toLowerCase()}`}
              />
            </div>
          </CardContent>
       </Card>
    )
  }
  
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-video relative bg-muted flex flex-col items-center justify-center text-center p-4">
          <Image
            src={imageSrc}
            alt={`Visual representation of ${plantName}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain opacity-50 blur-sm"
            data-ai-hint={imageHint || `botanical illustration ${plantName.toLowerCase()}`}
          />
          <div className="z-10 bg-background/80 p-6 rounded-lg shadow-xl text-center flex flex-col items-center">
            <Orbit className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Interactive 3D Model: {plantName}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              This is a placeholder for an interactive 3D model. A full implementation would allow you to rotate, zoom, and explore the plant's structure.
            </p>
            <div className="flex space-x-4 mt-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                    <Move3d className="w-4 h-4" />
                    <span className="text-xs">Rotate</span>
                </div>
                 <div className="flex items-center space-x-1">
                    <ZoomIn className="w-4 h-4" />
                    <span className="text-xs">Zoom In</span>
                </div>
                 <div className="flex items-center space-x-1">
                    <ZoomOut className="w-4 h-4" />
                    <span className="text-xs">Zoom Out</span>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
