import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { InteriorModel } from './components/InteriorModel';
import { SceneLighting } from './components/SceneLighting';
import { CameraController } from './components/CameraController';
import { MinimalOverlay } from './components/MinimalOverlay';
import { EditorialHero } from './components/EditorialHero';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import { DayNightToggle } from './components/DayNightToggle';
import { AboutSection } from './components/AboutSection';
import { ProjectsMarquee } from './components/ProjectsMarquee';
import { ServicesSection } from './components/ServicesSection';
import { FooterSection } from './components/FooterSection';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { THEME } from './theme/colors';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function CanvasBackgroundSync({ isNight }: { isNight: boolean }) {
  const { scene } = useThree();
  const currentFactor = useRef(0);

  useFrame(() => {
    currentFactor.current = THREE.MathUtils.lerp(
      currentFactor.current,
      isNight ? 1 : 0,
      0.06
    );
    const dayBg = new THREE.Color(THEME.background);
    const nightBg = new THREE.Color('#0c131d');
    scene.background = new THREE.Color().lerpColors(dayBg, nightBg, currentFactor.current);
  });

  return null;
}

export default function App() {
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const targetSceneProgress = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Lock scroll and prevent page interactions while loader is active
  useEffect(() => {
    if (!isLoaded) {
      document.documentElement.classList.add('loading-lock');
      document.body.classList.add('loading-lock');
      window.scrollTo(0, 0);
      lenisRef.current?.stop();

      const preventScroll = (e: Event) => {
        e.preventDefault();
      };
      const preventKeyScroll = (e: KeyboardEvent) => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll);

      return () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeyScroll);
      };
    } else {
      document.documentElement.classList.remove('loading-lock');
      document.body.classList.remove('loading-lock');
      window.scrollTo(0, 0);
      lenisRef.current?.start();
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  // Smooth scroll controller (Lenis + GSAP ticker sync)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    if (!isLoaded) {
      lenis.stop();
    }

    const handleScroll = () => {
      if (!isLoaded) return;
      ScrollTrigger.update();
      const track = document.querySelector('.scroll-track') as HTMLElement | null;
      if (track) {
        const max3DScroll = track.offsetHeight - window.innerHeight;
        if (max3DScroll > 0) {
          targetSceneProgress.current = Math.min(Math.max(window.scrollY / max3DScroll, 0), 1);
          setIsAboutVisible(window.scrollY >= max3DScroll - 20);
        }
      }
    };

    handleScroll();

    const handleResize = () => {
      handleScroll();
      ScrollTrigger.refresh();
    };

    lenis.on('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let rafId: number;
    const updateProgress = () => {
      setSceneProgress((prev) => {
        const diff = targetSceneProgress.current - prev;
        if (Math.abs(diff) < 0.0005) return targetSceneProgress.current;
        return prev + diff * 0.22;
      });
      rafId = requestAnimationFrame(updateProgress);
    };
    rafId = requestAnimationFrame(updateProgress);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [isLoaded]);

  // Scroll phase calculations
  const HERO_SLIDE_END = 0.08;
  const heroSlideProgress = Math.min(sceneProgress / HERO_SLIDE_END, 1.0);
  const wireDrawProgress = Math.min(sceneProgress / 0.18, 1.0);

  const P_CAM_START_SILHOUETTE = 0.10;
  const P_CAM_END = 0.22;
  const silhouetteAlpha = sceneProgress <= P_CAM_START_SILHOUETTE
    ? 0
    : Math.min(Math.max((sceneProgress - P_CAM_START_SILHOUETTE) / (P_CAM_END - P_CAM_START_SILHOUETTE), 0), 1);

  const P_SHADER_START = 0.22;
  const P_SHADER_END = 0.68;
  const shaderProgress = sceneProgress <= P_SHADER_START
    ? 0
    : Math.min(Math.max((sceneProgress - P_SHADER_START) / (P_SHADER_END - P_SHADER_START), 0), 1);

  const isToggleVisible = sceneProgress >= 0.85 && !isAboutVisible;
  const initialBgColor = new THREE.Color(THEME.background);

  return (
    <>
      <Loader
        onLoaded={() => {
          setIsLoaded(true);
          ScrollTrigger.refresh();
        }}
      />

      <Navbar isNight={isNight} isLoaded={isLoaded} />

      <EditorialHero
        isLoaded={isLoaded}
        slideProgress={heroSlideProgress}
      />

      <MinimalOverlay
        progress={sceneProgress}
        heroSlideProgress={heroSlideProgress}
        isNight={isNight}
        isAboutVisible={isAboutVisible}
        isLoaded={isLoaded}
      />

      <DayNightToggle
        isNight={isNight}
        onToggle={setIsNight}
        visible={isToggleVisible}
      />

      <div className={`canvas-fixed-container ${isNight ? 'night-canvas' : ''}`}>
        <Canvas
          className="canvas-element"
          shadows
          camera={{
            position: [-14.5, 6.0, 16.5],
            fov: 48,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[initialBgColor]} />

          <CanvasBackgroundSync isNight={isNight} />

          <SceneLighting
            progress={shaderProgress}
            nightFactor={isNight ? 1 : 0}
          />

          <Environment
            preset="apartment"
            environmentIntensity={isNight ? 0.2 : THREE.MathUtils.lerp(0.3, 1.2, shaderProgress)}
          />

          <Suspense fallback={null}>
            <InteriorModel
              progress={shaderProgress}
              introProgress={wireDrawProgress}
              silhouetteAlpha={silhouetteAlpha}
              nightFactor={isNight ? 1 : 0}
            />
          </Suspense>

          <CameraController
            progress={sceneProgress}
            introDone={wireDrawProgress >= 1.0}
          />
        </Canvas>
      </div>

      <div className="scroll-track" />

      <AboutSection isNight={isNight} />
      <ProjectsMarquee isNight={isNight} />
      <ServicesSection isNight={isNight} />
      <FooterSection isNight={isNight} />
    </>
  );
}