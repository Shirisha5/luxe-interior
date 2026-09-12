import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './EditorialHero.css';

gsap.registerPlugin(useGSAP);

interface EditorialHeroProps {
  slideProgress: number;
  isLoaded?: boolean;
}

export function EditorialHero({ slideProgress, isLoaded = false }: EditorialHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotatingWrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const translateY = slideProgress * 100;
      const opacity = Math.max(0, 1 - slideProgress * 1.15);
      containerRef.current.style.transform = `translate3d(0, -${translateY}%, 0)`;
      containerRef.current.style.opacity = `${opacity}`;
      containerRef.current.style.pointerEvents = slideProgress >= 0.95 ? 'none' : 'auto';
    }
  }, [slideProgress]);

  useGSAP(
    () => {
      if (rotatingWrapRef.current) {
        tweenRef.current = gsap.to(rotatingWrapRef.current, {
          rotation: 360,
          duration: 18,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
        });
      }

      if (!isLoaded) {
        gsap.set(
          '.hero-title-emotion, .hero-subtitle-text, .hero-photo-frame, .hero-circular-scroll',
          { autoAlpha: 0, y: 50 }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15,
      });

      tl.fromTo(
        '.hero-title-emotion',
        { y: 65, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.25 }
      )
        .fromTo(
          '.hero-subtitle-text',
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.05 },
          '-=0.75'
        )
        .fromTo(
          '.hero-photo-frame',
          { y: 80, scale: 0.92, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 1.35 },
          '-=0.75'
        )
        .fromTo(
          '.hero-circular-scroll',
          { y: 35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          '-=0.7'
        );
    },
    { scope: containerRef, dependencies: [isLoaded] }
  );

  const handleMouseEnter = () => {
    tweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    tweenRef.current?.play();
  };

  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-drafting-layer">
        <div className="hero-grid-h-top" />
        <div className="hero-grid-h-bottom" />
        <div className="hero-grid-v-left" />
        <div className="hero-grid-v-right" />
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-header-block">
          <h1 className="hero-title-emotion">
            Where <span className="hero-title-italic">design</span> meets emotion
          </h1>
          <p className="hero-subtitle-text">
            We design spaces that unite function and beauty, creating interiors and
            architecture that bring your lifestyle and vision to life.
          </p>
        </div>

        <div className="hero-photo-container">
          <div className="hero-photo-frame">
            <img
              src="/spacejoy.jpg"
              alt="Where design meets emotion - Living room interior"
              className="hero-photo-render"
            />
          </div>
        </div>
      </div>

      <div
        className="hero-circular-scroll"
        onClick={handleScrollClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label="Scroll down"
      >
        <div ref={rotatingWrapRef} className="hero-scroll-rotating-wrap">
          <svg className="hero-scroll-svg" viewBox="0 0 100 100">
            <defs>
              <path
                id="scrollCirclePath"
                d="M 50, 50 m -35.5, 0 a 35.5,35.5 0 1,1 71,0 a 35.5,35.5 0 1,1 -71,0"
              />
            </defs>
            <text className="hero-scroll-text">
              <textPath
                href="#scrollCirclePath"
                startOffset="0%"
                textLength="223"
                lengthAdjust="spacing"
              >
                • SCROLL DOWN • EXPLORE MORE 
              </textPath>
            </text>
          </svg>
        </div>

        <div className="hero-scroll-center-arrow">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}



