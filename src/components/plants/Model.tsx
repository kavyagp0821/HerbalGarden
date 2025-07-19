'use client';

import { useGLTF } from '@react-three/drei';

interface ModelProps {
    modelPath: string;
}

export default function Model({ modelPath }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}
