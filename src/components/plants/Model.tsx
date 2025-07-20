'use client';

import { useGLTF } from '@react-three/drei';

interface ModelProps {
  modelPath: string;
}

export default function Model({ modelPath }: ModelProps) {
  // useGLTF.preload(modelPath); // Optional: preload the model
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1.5} />;
}
