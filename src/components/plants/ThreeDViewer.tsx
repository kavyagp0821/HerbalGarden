'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';

// Import using absolute path to avoid any relative import issues
const IsolatedThreeScene = dynamic(
  () => import('@/components/three/IsolatedThreeScene'),
  { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />
  }
);

const Model = dynamic(() => import('@/components/plants/Model'), {
  ssr: false,
  loading: () => null,
});

interface ThreeDViewerProps {
  modelPath: string;
}

export default function ThreeDViewer({ modelPath }: ThreeDViewerProps) {
  return (
    <IsolatedThreeScene>
      <Model modelPath={modelPath} />
    </IsolatedThreeScene>
  );
}
