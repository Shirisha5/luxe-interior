import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  createTransitionUniforms,
  injectTransitionShader,
} from '../shaders/transitionShader';
import { THEME } from '../theme/colors';

interface InteriorModelProps {
  progress: number;
  introProgress: number;
  silhouetteAlpha?: number;
  nightFactor?: number;
}

export function InteriorModel({
  progress,
  introProgress,
  silhouetteAlpha = 0,
  nightFactor = 0,
}: InteriorModelProps) {
  const { scene } = useGLTF('/models/interior.glb');
  const lampEmissiveMeshRef = useRef<THREE.Mesh>(null);
  const lampGlowMeshRef = useRef<THREE.Mesh>(null);
  const wireUniforms = useRef({
    uWireframeDrawProgress: { value: 0.0 },
    uWireframeMaxY: { value: 5.0 },
    uProgress: { value: 0.0 },
    uBBoxMin: { value: new THREE.Vector3() },
    uBBoxMax: { value: new THREE.Vector3() },
  });

  const { uniforms, groupPosition, groupScale, modelMaxY, normMin, normMax } = useMemo(() => {
    const rawBox = new THREE.Box3().setFromObject(scene);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const rawCenter = rawBox.getCenter(new THREE.Vector3());

    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z) || 1;
    const targetScale = 20 / maxDim;

    const groupPos: [number, number, number] = [
      -rawCenter.x * targetScale,
      -rawBox.min.y * targetScale,
      -rawCenter.z * targetScale,
    ];

    const nMin = new THREE.Vector3(
      (rawBox.min.x - rawCenter.x) * targetScale,
      0,
      (rawBox.min.z - rawCenter.z) * targetScale
    );
    const nMax = new THREE.Vector3(
      (rawBox.max.x - rawCenter.x) * targetScale,
      rawSize.y * targetScale,
      (rawBox.max.z - rawCenter.z) * targetScale
    );

    const uni = createTransitionUniforms(nMin, nMax);
    uni.uScanColor.value.set(THEME.accentCTA);
    uni.uSketchBaseColor.value.set(THEME.background);
    uni.uSketchLineColor.value.set(THEME.primaryTextWireframe);

    return {
      uniforms: uni,
      groupPosition: groupPos,
      groupScale: targetScale,
      modelMaxY: nMax.y,
      normMin: nMin,
      normMax: nMax,
    };
  }, [scene]);

  useEffect(() => {
    wireUniforms.current.uWireframeMaxY.value = modelMaxY;
    wireUniforms.current.uBBoxMin.value.copy(normMin);
    wireUniforms.current.uBBoxMax.value.copy(normMax);
  }, [modelMaxY, normMin, normMax]);

  useEffect(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !child.userData.isWireframeMesh) {
        const mesh = child as THREE.Mesh;
        meshes.push(mesh);

        const isLampShade = child.parent?.name === 'Cylinder' || child.name === 'Cylinder';
        if (isLampShade) {
          lampEmissiveMeshRef.current = mesh;

          if (!mesh.userData.hasLampGlow) {
            mesh.userData.hasLampGlow = true;
            const glowMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color('#ffe29a'),
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            const glowMesh = new THREE.Mesh(mesh.geometry.clone(), glowMat);
            glowMesh.scale.set(1.002, 1.002, 1.002);
            glowMesh.userData.isWireframeMesh = true;
            mesh.add(glowMesh);
            lampGlowMeshRef.current = glowMesh;
          }
        }
      }
    });

    meshes.forEach((mesh) => {
      const isLampShade = mesh.parent?.name === 'Cylinder' || mesh.name === 'Cylinder';
      mesh.castShadow = !isLampShade;
      mesh.receiveShadow = true;

      if (!mesh.userData.hasTransitionShader && mesh.material) {
        mesh.userData.hasTransitionShader = true;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => {
            const m = mat.clone();
            injectTransitionShader(m, uniforms);
            return m;
          });
        } else {
          const m = mesh.material.clone();
          injectTransitionShader(m, uniforms);
          mesh.material = m;
        }
      }

      if (!mesh.userData.wireframeChild) {
        const wireMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(THEME.primaryTextWireframe),
          wireframe: true,
          transparent: true,
          opacity: 0.88,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });

        wireMat.onBeforeCompile = (shader) => {
          shader.uniforms.uWireframeDrawProgress = wireUniforms.current.uWireframeDrawProgress;
          shader.uniforms.uWireframeMaxY = wireUniforms.current.uWireframeMaxY;
          shader.uniforms.uProgress = wireUniforms.current.uProgress;
          shader.uniforms.uBBoxMin = wireUniforms.current.uBBoxMin;
          shader.uniforms.uBBoxMax = wireUniforms.current.uBBoxMax;

          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
            #include <common>
            varying vec3 vWorldWirePos;
            `
          );

          shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            `
            #include <worldpos_vertex>
            vWorldWirePos = (modelMatrix * vec4(transformed, 1.0)).xyz;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
            #include <common>
            uniform float uWireframeDrawProgress;
            uniform float uWireframeMaxY;
            uniform float uProgress;
            uniform vec3 uBBoxMin;
            uniform vec3 uBBoxMax;
            varying vec3 vWorldWirePos;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>

            float cutoffY = uWireframeDrawProgress * (uWireframeMaxY + 0.5);
            if (vWorldWirePos.y > cutoffY) {
              discard;
            }

            float sweepMin = uBBoxMin.z;
            float sweepMax = uBBoxMax.z;
            float sweepSpan = max(0.001, sweepMax - sweepMin);
            float zNorm = clamp((vWorldWirePos.z - sweepMin) / sweepSpan, 0.0, 1.0);

            float ySpan = max(0.001, uBBoxMax.y - uBBoxMin.y);
            float yNorm = clamp((vWorldWirePos.y - uBBoxMin.y) / ySpan, 0.0, 1.0);

            float pWall = 0.15;
            float wallDepth = 0.06;

            float tReach;
            if (zNorm <= wallDepth) {
              float wallZFactor = zNorm / wallDepth;
              float yReach = yNorm * pWall;
              float zReach = pWall + wallZFactor * 0.02;
              tReach = mix(yReach, zReach, wallZFactor * 0.35);
            } else {
              float forwardT = (zNorm - wallDepth) / (1.0 - wallDepth);
              tReach = pWall + forwardT * (1.0 - pWall);
            }

            float waveP = uProgress * 1.14;

            if ((uProgress > 0.02 && tReach < waveP) || uProgress >= 0.94) {
              discard;
            }

            float distFromEdge = tReach - waveP;
            float edgeFade = smoothstep(0.0, 0.025, distFromEdge);
            gl_FragColor.a *= edgeFade;

            float edgeDist = abs(vWorldWirePos.y - cutoffY);
            if (edgeDist < 0.25 && uWireframeDrawProgress < 0.98) {
              gl_FragColor.rgb += vec3(0.5, 0.4, 0.2) * (1.0 - edgeDist / 0.25);
            }
            `
          );
        };

        const wireMesh = new THREE.Mesh(mesh.geometry, wireMat);
        wireMesh.userData.isWireframeMesh = true;
        mesh.userData.wireframeChild = wireMesh;
        mesh.add(wireMesh);
      }
    });
  }, [scene, uniforms]);

  useFrame(() => {
    wireUniforms.current.uWireframeDrawProgress.value = THREE.MathUtils.lerp(
      wireUniforms.current.uWireframeDrawProgress.value,
      introProgress,
      0.12
    );

    if (uniforms) {
      uniforms.uIntroProgress.value = wireUniforms.current.uWireframeDrawProgress.value;
      uniforms.uSilhouetteAlpha.value = THREE.MathUtils.lerp(
        uniforms.uSilhouetteAlpha.value,
        silhouetteAlpha,
        0.16
      );

      let targetP = THREE.MathUtils.lerp(
        uniforms.uProgress.value,
        progress,
        0.16
      );
      if (Math.abs(targetP - progress) < 0.001) targetP = progress;
      uniforms.uProgress.value = targetP;
      wireUniforms.current.uProgress.value = targetP;
    }

    if (lampGlowMeshRef.current) {
      const glowMat = lampGlowMeshRef.current.material as THREE.MeshBasicMaterial;
      glowMat.opacity = THREE.MathUtils.lerp(
        glowMat.opacity,
        nightFactor * 0.98,
        0.08
      );
    }
  });

  return (
    <group position={groupPosition} scale={groupScale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/interior.glb');