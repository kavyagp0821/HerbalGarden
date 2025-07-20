// src/app/plants/[id]/gallery/page.tsx
import Image from "next/image";
import { plantService } from "@/services/plant.service";
import { notFound } from "next/navigation";

interface GalleryPageProps {
  params: { id: string };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const plant = await plantService.getPlant(params.id);

  if (!plant) {
    notFound();
  }
  
  const placeholderImages = [
    { src: plant.imageSrc, alt: `Main image of ${plant.commonName}`, hint: plant.imageHint || plant.commonName },
    { src: 'https://placehold.co/400x600.png', alt: 'A close-up of a plant flower', hint: 'plant flower' },
    { src: 'https://placehold.co/600x400.png', alt: 'The plant growing in its natural habitat', hint: 'plant habitat' },
    { src: 'https://placehold.co/600x400.png', alt: 'Dried herbs from the plant', hint: 'dried herbs' },
    { src: 'https://placehold.co/400x600.png', alt: 'A botanical illustration of the plant', hint: 'botanical illustration' },
    { src: 'https://placehold.co/600x400.png', alt: 'The roots of the plant', hint: 'plant roots' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {placeholderImages.map((image, index) => (
        <div key={index} className="group relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={image.hint}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
