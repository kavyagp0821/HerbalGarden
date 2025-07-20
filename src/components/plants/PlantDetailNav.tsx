// src/components/plants/PlantDetailNav.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { LayoutGrid, Sprout, Images } from 'lucide-react';

interface PlantDetailNavProps {
  plantId: string;
}

export default function PlantDetailNav({ plantId }: PlantDetailNavProps) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', href: `/plants/${plantId}`, icon: LayoutGrid },
    { name: 'Cultivation', href: `/plants/${plantId}/cultivation`, icon: Sprout },
    { name: 'Gallery', href: `/plants/${plantId}/gallery`, icon: Images },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm',
              pathname === item.href
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <item.icon className="-ml-0.5 mr-2 h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
