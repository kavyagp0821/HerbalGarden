'use client';

import { useGLTF } from '@react-three/drei';

interface ModelProps {
    modelPath: string;
}

export default function Model({ modelPath }: ModelProps) {
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} />;
  } catch(e) {
    console.error("Failed to load 3D model", e);
    // Fallback to a simple cube if model loading fails
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
}
