import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './Loader.css';

gsap.registerPlugin(MotionPathPlugin);

interface LoaderProps {
  onLoaded?: () => void;
}

export function Loader({ onLoaded }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const tracerRef = useRef<SVGCircleElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(1);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useGSAP(
    () => {
      if (!svgRef.current || !mainPathRef.current || !tracerRef.current || !containerRef.current) {
        return;
      }

      const pathElements = svgRef.current.querySelectorAll<SVGGeometryElement>(
        '.loader-line-art, .loader-detail-line'
      );

      pathElements.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 800;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const masterTl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.1,
            ease: 'power3.inOut',
            onComplete: () => {
              onLoaded?.();
              setShouldUnmount(true);
            },
          });
        },
      });

      const counterObj = { val: 1 };
      masterTl.to(
        counterObj,
        {
          val: 100,
          duration: 3.2,
          ease: 'power1.inOut',
          onUpdate: () => {
            const rounded = Math.round(counterObj.val);
            setProgress(rounded);
            if (barFillRef.current) {
              barFillRef.current.style.width = `${rounded}%`;
            }
          },
        },
        0
      );

      masterTl.to(
        pathElements,
        {
          strokeDashoffset: 0,
          duration: 2.9,
          ease: 'power2.inOut',
          stagger: 0.07,
        },
        0.05
      );

      masterTl.to(
        tracerRef.current,
        {
          motionPath: {
            path: mainPathRef.current,
            align: mainPathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: 3.2,
          ease: 'power1.inOut',
        },
        0.1
      );

      masterTl.to(
        tracerRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '-=0.2'
      );
    },
    { scope: containerRef }
  );

  if (shouldUnmount) return null;

  const formattedProgress = `${progress.toString().padStart(3, '0')}%`;

  return (
    <div ref={containerRef} className="loader-container">
      <div className="loader-center-graphic">
        <svg
          ref={svgRef}
          className="loader-svg"
          viewBox="0 0 600 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
         
          <path
            className="loader-line-art"
            d="M 10 248 L 105 248 L 105 240 L 372 240 L 372 258 L 418 258 L 418 248 L 590 248"
          />

          <path
            ref={mainPathRef}
            className="loader-line-art"
            d="
              M 122 240
              L 122 92
              L 286 64
              L 286 90
              L 142 112
              L 142 225
              L 372 225
              L 372 240
              M 286 64
              L 292 62
              L 350 86
              L 382 82
              L 452 98
              L 488 110
              L 488 240
              L 452 240
              M 382 82
              L 382 258
            "
          />

   
          <path
            className="loader-detail-line"
            d="M 142 112 L 188 122 L 188 225"
          />
          <path
            className="loader-detail-line"
            d="M 188 122 L 208 127 L 208 185 L 214 185 L 214 225"
          />

          {/* Central Structural Divider & Recessed Spatial Volumes */}
          <path
            className="loader-line-art"
            d="M 242 100 L 242 225"
          />
          <path
            className="loader-line-art"
            d="M 242 100 L 292 94 L 292 165 L 372 165"
          />
          <path
            className="loader-detail-line"
            d="M 292 165 L 292 225"
          />
          <path
            className="loader-detail-line"
            d="M 242 165 L 292 165"
          />
          <path
            className="loader-detail-line"
            d="M 292 112 L 372 112"
          />

          {/* Right Pavilion Entrance Cutout / Doorway */}
          <path
            className="loader-line-art"
            d="M 418 248 L 418 145 L 452 156 L 452 238"
          />
          <path
            className="loader-detail-line"
            d="M 452 238 L 458 238 L 458 122"
          />

          {/* Clerestory / Stepped Roofline Depth */}
          <path
            className="loader-detail-line"
            d="M 425 94 L 438 88 L 452 94"
          />
          <path
            className="loader-detail-line"
            d="M 438 88 L 438 96"
          />

          {/* Plinth Foundation Stepped Ledges */}
          <path
            className="loader-detail-line"
            d="M 142 232 L 372 232"
          />

          {/* Animated GSAP MotionPath Tracer Bead */}
          <circle
            ref={tracerRef}
            className="loader-tracer-dot"
            r="3.2"
            cx="0"
            cy="0"
          />
        </svg>
      </div>

      {/* Right Bottom Progress Number, Bar & Luxe Text */}
      <div className="loader-bottom-right">
        <div className="loader-progress-value">{formattedProgress}</div>
        <div className="loader-bar-track">
          <div ref={barFillRef} className="loader-bar-fill" />
        </div>
        <div className="loader-brand-tag">Luxe</div>
      </div>
    </div>
  );
}
