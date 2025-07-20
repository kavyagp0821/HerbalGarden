'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Orbit } from 'lucide-react';
import Model from './Model';

interface ThreeDViewerProps {
  modelPath?: string;
}

export default function ThreeDViewer({ modelPath }: ThreeDViewerProps) {
  if (!modelPath) {
    return (
      <Alert>
        <Orbit className="h-4 w-4" />
        <AlertTitle>3D Model Not Available</AlertTitle>
        <AlertDescription>An interactive 3D model for this plant has not been added yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg bg-muted border flex items-center justify-center">
      <Suspense fallback={<div className="animate-pulse text-center">Loading 3D model...</div>}>
        <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Environment preset="forest" />
          <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} />
          <Model modelPath={modelPath} />
        </Canvas>
      </Suspense>
    </div>
  );
}
