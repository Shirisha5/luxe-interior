import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface ArchitecturalGridProps {
  progress: number;
}

export function ArchitecturalGrid({ progress }: ArchitecturalGridProps) {
  const gridHelperRef = useRef<THREE.GridHelper>(null);

  useFrame(() => {
    if (gridHelperRef.current) {
      const opacity = THREE.MathUtils.clamp((1.0 - progress * 2.5) * 0.7, 0, 0.7);
      const mat = gridHelperRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = opacity;
        gridHelperRef.current.visible = opacity > 0.005;
      }
    }
  });

  return (
    <group position={[0, -0.02, 0]}>
      <gridHelper
        ref={gridHelperRef}
        args={[50, 50, '#c8aa80', '#1a2230']}
        position={[0, 0, 0]}
      />
    </group>
  );
}

