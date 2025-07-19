'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

// Preload the models
useGLTF.preload('/models/tulsi.glb');
useGLTF.preload('/models/ashwagandha.glb');
useGLTF.preload('/models/turmeric.glb');
useGLTF.preload('/models/brahmi.glb');
useGLTF.preload('/models/amla.glb');
useGLTF.preload('/models/neem.glb');
useGLTF.preload('/models/shatavari.glb');
useGLTF.preload('/models/ginger.glb');
useGLTF.preload('/models/giloy.glb');
useGLTF.preload('/models/moringa.glb');
useGLTF.preload('/models/vetiver.glb');
useGLTF.preload('/models/sandalwood.glb');
useGLTF.preload('/models/licorice.glb');
useGLTF.preload('/models/peppermint.glb');
useGLTF.preload('/models/lemongrass.glb');
useGLTF.preload('/models/chamomile.glb');
useGLTF.preload('/models/lavender.glb');
useGLTF.preload('/models/rosemary.glb');
useGLTF.preload('/models/echinacea.glb');
useGLTF.preload('/models/marshmallow-root.glb');


interface ThreeDViewerProps {
  modelPath: string;
}

export default function ThreeDViewer({ modelPath }: ThreeDViewerProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 50 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
      <Suspense fallback={null}>
        <Model modelPath={modelPath} />
        <Environment preset="forest" />
      </Suspense>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

// Error boundary specific to the 3D viewer
function ThreeDViewerErrorBoundary({ children }: { children: React.ReactNode }) {
    // This is a simplified boundary. In a real app, you might use a library like 'react-error-boundary'.
    try {
        return <>{children}</>;
    } catch (error) {
        console.error("3D Viewer Error:", error);
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Could Not Load 3D Model</AlertTitle>
                    <AlertDescription>
                        There was an error loading the interactive model. Please ensure you are online and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
}
