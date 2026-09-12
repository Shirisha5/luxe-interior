import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './AboutSection.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AboutSectionProps {
  isNight?: boolean;
}

export function AboutSection({ isNight = false }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'restart none none reverse',
        },
      });

      tl.fromTo(
        '.about-tag-wrapper',
        { y: 35, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9 }
      )
        .fromTo(
          '.about-headline',
          { y: 55, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.15 },
          '-=0.65'
        )
        .fromTo(
          '.about-lead, .about-description',
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.0, stagger: 0.18 },
          '-=0.75'
        )
        .fromTo(
          '.image-primary',
          { y: 160, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out' },
          '-=0.9'
        )
        .fromTo(
          '.image-secondary',
          { y: 220, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.5, ease: 'power3.out' },
          '-=1.15'
        )
        .fromTo(
          '.about-badge-wrapper',
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.0, ease: 'back.out(1.7)' },
          '-=1.1'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`about-section ${isNight ? 'night-mode' : ''}`}
      id="about"
      aria-label="About Luxe Interior"
    >
      <div className="about-container">
        <div className="about-content">
          <div className="about-tag-wrapper">
            <span className="about-tag-line" aria-hidden="true" />
            <span className="about-tag">ABOUT US</span>
          </div>

          <h2 className="about-headline">
            We help to bring your{' '}
            <span className="italic-serif">dream home</span> to reality
          </h2>

          <div className="about-body">
            <p className="about-lead">
              At Luxe Interior, we create inspiring spaces that blend timeless design
              with modern innovation.
            </p>
            <p className="about-description">
              From homes to commercial projects, our team delivers bespoke architecture,
              interiors, and renovations with precision. We value collaboration, quality
              and sustainability, ensuring every project reflects individuality and
              excellence.
            </p>
          </div>
        </div>

        <div className="about-imagery">
          <div className="about-badge-wrapper" aria-hidden="true">
            <div className="about-badge-spin">
              <svg viewBox="0 0 160 160" className="badge-svg">
                <defs>
                  <path
                    id="badgeCirclePath"
                    d="M 80, 80 m -52, 0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                  />
                </defs>
                <text className="badge-text">
                  <textPath href="#badgeCirclePath" startOffset="0%">
                    LUXE INTERIOR • DESIGN STUDIO •
                  </textPath>
                </text>
              </svg>
              <div className="badge-center-star">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="star-icon"
                >
                  <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="about-image-item image-primary">
            <img
              src="/images/about-kitchen.jpg"
              alt="Luxe modern kitchen architecture"
              className="about-img"
              loading="lazy"
            />
          </div>

          <div className="about-image-item image-secondary">
            <img
              src="/images/about-bedroom.jpg"
              alt="Contemporary bedroom with natural timber"
              className="about-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

