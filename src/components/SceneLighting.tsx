import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface SceneLightingProps {
  progress: number;
  nightFactor?: number;
}

export function SceneLighting({ progress, nightFactor = 0 }: SceneLightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const lampSpotRef = useRef<THREE.SpotLight>(null);
  const lampPointRef = useRef<THREE.PointLight>(null);

  const smoothedNight = useRef(0);

  const lampTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-1.4, 0.1, -2.6);
    return obj;
  }, []);

  useEffect(() => {
    if (lampSpotRef.current) {
      lampSpotRef.current.target = lampTarget;
    }
  }, [lampTarget]);

  useFrame(() => {
    smoothedNight.current = THREE.MathUtils.lerp(smoothedNight.current, nightFactor, 0.06);
    const n = smoothedNight.current;
    const t = THREE.MathUtils.clamp(progress, 0, 1);

    if (ambientLightRef.current) {
      const dayAmbient = new THREE.Color('#ffe8d0');
      const nightAmbient = new THREE.Color('#0f1724');
      const targetAmbient = new THREE.Color().lerpColors(dayAmbient, nightAmbient, n);
      ambientLightRef.current.color.copy(targetAmbient);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.8, 1.25, t),
        0.28,
        n
      );
    }

    if (dirLightRef.current) {
      const daySunColor = new THREE.Color('#fff1db');
      const nightMoonColor = new THREE.Color('#384c68');
      dirLightRef.current.color.lerpColors(daySunColor, nightMoonColor, n);
      const baseSunIntensity = THREE.MathUtils.lerp(0.5, 3.2, t);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(baseSunIntensity, 0.06, n);
    }

    if (spotLightRef.current) {
      const baseSpot = THREE.MathUtils.lerp(0.0, 3.8, Math.max(0, (t - 0.2) / 0.8));
      spotLightRef.current.intensity = THREE.MathUtils.lerp(baseSpot, 0.4, n);
    }

    if (lampSpotRef.current) {
      lampSpotRef.current.intensity = THREE.MathUtils.lerp(
        lampSpotRef.current.intensity,
        n * 16.0,
        0.08
      );
    }
    if (lampPointRef.current) {
      lampPointRef.current.intensity = THREE.MathUtils.lerp(
        lampPointRef.current.intensity,
        n * 5.0,
        0.08
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} />

      <directionalLight
        ref={dirLightRef}
        position={[12, 18, 14]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        color="#fff1db"
      />

      <spotLight
        ref={spotLightRef}
        position={[0, 8, 0]}
        angle={0.7}
        penumbra={0.8}
        decay={2}
        distance={25}
        color="#ffdca8"
        castShadow
      />

      <primitive object={lampTarget} />
      <spotLight
        ref={lampSpotRef}
        position={[-2.95, 2.05, -4.80]}
        angle={Math.PI / 2.5}
        penumbra={0.85}
        decay={2}
        distance={18}
        color="#ffaa44"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
      />

      <pointLight
        ref={lampPointRef}
        position={[-2.95, 1.95, -4.80]}
        distance={7.0}
        decay={2}
        color="#ff9933"
        intensity={0}
      />
    </>
  );
}


