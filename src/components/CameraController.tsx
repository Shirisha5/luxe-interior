import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  progress: number;
  introDone: boolean;
}

export function CameraController({
  progress,
  introDone: _introDone,
}: CameraControllerProps) {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.targetX, 0.04);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.targetY, 0.04);

    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    // Framing adjustment based on viewport aspect ratio
    const aspect = size.width / Math.max(size.height, 1);
    const zoomMult = aspect < 0.65 ? 1.42 : aspect < 1.0 ? 1.25 : aspect < 1.3 ? 1.12 : 1.0;
    const yShift = aspect < 1.0 ? 0.35 : 0;

    // Initial isometric perspective
    const pAngle = new THREE.Vector3(-14.5 * (aspect < 1.0 ? 0.95 : 1.0), 6.0 + yShift, 16.5 * zoomMult);
    const lAngle = new THREE.Vector3(1.2, 2.6 + yShift * 0.5, 0.5);

    // Straight-on one-point elevation
    const pStraight = new THREE.Vector3(0, 3.4 + yShift, 13.8 * zoomMult);
    const lStraight = new THREE.Vector3(0, 2.7 + yShift * 0.5, -2.0);

    const P_CAM_END = 0.22;
    const t = THREE.MathUtils.clamp(progress, 0, 1);

    if (t < P_CAM_END) {
      const scrollT = t / P_CAM_END;
      const ease = THREE.MathUtils.smoothstep(scrollT, 0, 1);
      targetPos.lerpVectors(pAngle, pStraight, ease);
      targetLook.lerpVectors(lAngle, lStraight, ease);
    } else {
      targetPos.copy(pStraight);
      targetLook.copy(lStraight);
    }

    const parallaxX = mouse.current.x * (aspect < 1.0 ? 0.15 : 0.35);
    const parallaxY = -mouse.current.y * (aspect < 1.0 ? 0.1 : 0.2);

    camera.position.set(
      targetPos.x + parallaxX,
      targetPos.y + parallaxY,
      targetPos.z
    );

    camera.lookAt(targetLook.x, targetLook.y, targetLook.z);
  });

  return null;
}

