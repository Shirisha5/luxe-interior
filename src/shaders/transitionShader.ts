import * as THREE from 'three';
import { THEME } from '../theme/colors';

export interface TransitionUniforms {
  uProgress: { value: number };
  uIntroProgress: { value: number };
  uSilhouetteAlpha: { value: number };
  uBBoxMin: { value: THREE.Vector3 };
  uBBoxMax: { value: THREE.Vector3 };
  uScanColor: { value: THREE.Color };
  uSketchBaseColor: { value: THREE.Color };
  uSketchLineColor: { value: THREE.Color };
}

export function createTransitionUniforms(
  bboxMin = new THREE.Vector3(-10, -5, -10),
  bboxMax = new THREE.Vector3(10, 10, 10)
): TransitionUniforms {
  return {
    uProgress: { value: 0 },
    uIntroProgress: { value: 0 },
    uSilhouetteAlpha: { value: 0 },
    uBBoxMin: { value: bboxMin },
    uBBoxMax: { value: bboxMax },
    uScanColor: { value: new THREE.Color(THEME.accentCTA) },
    uSketchBaseColor: { value: new THREE.Color(THEME.background) },
    uSketchLineColor: { value: new THREE.Color(THEME.primaryTextWireframe) },
  };
}

export function injectTransitionShader(
  material: THREE.Material,
  uniforms: TransitionUniforms
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = uniforms.uProgress;
    shader.uniforms.uIntroProgress = uniforms.uIntroProgress;
    shader.uniforms.uSilhouetteAlpha = uniforms.uSilhouetteAlpha;
    shader.uniforms.uBBoxMin = uniforms.uBBoxMin;
    shader.uniforms.uBBoxMax = uniforms.uBBoxMax;
    shader.uniforms.uScanColor = uniforms.uScanColor;
    shader.uniforms.uSketchBaseColor = uniforms.uSketchBaseColor;
    shader.uniforms.uSketchLineColor = uniforms.uSketchLineColor;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vWorldPosition;
      varying vec3 vModelPosition;
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `
      #include <worldpos_vertex>
      vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vModelPosition = position;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uProgress;
      uniform float uIntroProgress;
      uniform float uSilhouetteAlpha;
      uniform vec3 uBBoxMin;
      uniform vec3 uBBoxMax;
      uniform vec3 uScanColor;
      uniform vec3 uSketchBaseColor;
      uniform vec3 uSketchLineColor;
      varying vec3 vWorldPosition;
      varying vec3 vModelPosition;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>

      float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      if (uProgress < 0.001 && uSilhouetteAlpha < dither) {
        discard;
      }

      float sweepMin = uBBoxMin.z;
      float sweepMax = uBBoxMax.z;
      float sweepSpan = max(0.001, sweepMax - sweepMin);
      float zNorm = clamp((vWorldPosition.z - sweepMin) / sweepSpan, 0.0, 1.0);

      float ySpan = max(0.001, uBBoxMax.y - uBBoxMin.y);
      float yNorm = clamp((vWorldPosition.y - uBBoxMin.y) / ySpan, 0.0, 1.0);

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
      float distFromEdge = tReach - waveP;

      float bandWidth = 0.035;
      float scanBand = smoothstep(bandWidth, 0.0, abs(distFromEdge));
      float glowFade = smoothstep(0.001, 0.025, uProgress) * smoothstep(0.96, 0.90, uProgress);
      vec3 scanGlow = uScanColor * scanBand * 2.8 * glowFade;

      vec3 sketchColor = uSketchBaseColor;

      #ifdef USE_NORMAL
        vec3 vDir = normalize(cameraPosition - vWorldPosition);
        float edgeCurvature = 1.0 - max(0.0, dot(vDir, normal));
        sketchColor -= vec3(0.05, 0.05, 0.05) * pow(edgeCurvature, 2.0) * clamp(uSilhouetteAlpha, 0.2, 1.0);
      #endif

      float blend = 0.0;
      if (uProgress >= 0.95) {
        blend = 1.0;
      } else if (uProgress > 0.02) {
        blend = smoothstep(0.0, 0.02, -distFromEdge);
      }
      vec3 realisticColor = gl_FragColor.rgb;

      gl_FragColor.rgb = mix(sketchColor, realisticColor, blend) + scanGlow;
      `
    );
  };

  material.needsUpdate = true;
}

