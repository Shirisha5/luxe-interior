import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ServicesSection.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SERVICES: ServiceItem[] = [
  {
    id: '01',
    number: '01',
    title: 'Architecture',
    description:
      "Create innovative and functional designs that enhance our clients' lives and respect the environment.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="service-line-icon"
        aria-hidden="true"
      >
        <rect x="6" y="8" width="36" height="32" rx="2" strokeDasharray="3 3" />
        <path d="M14 32V23L24 15L34 23V32H14Z" strokeLinejoin="round" />
        <rect x="20" y="25" width="8" height="7" />
        <path d="M24 25V32M20 28.5H28" />
        <line x1="10" y1="8" x2="10" y2="12" />
        <line x1="38" y1="8" x2="38" y2="12" />
      </svg>
    ),
  },
  {
    id: '02',
    number: '02',
    title: 'Interior Design',
    description:
      'Creative and functional solutions to enhance the aesthetics and functionality of indoor spaces.',
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="service-line-icon"
        aria-hidden="true"
      >
        <rect x="12" y="14" width="24" height="10" rx="1.5" />
        <rect x="15" y="17" width="8" height="4.5" rx="1" />
        <rect x="25" y="17" width="8" height="4.5" rx="1" />
        <path d="M12 24H36V33H12V24Z" />
        <path d="M14 33V37M34 33V37" />
        <path d="M6 21H10M38 21H42" />
        <path d="M8 21V30M40 21V30" />
        <path d="M6 21L8 17L10 21M38 21L40 17L42 21" />
        <line x1="5" y1="30" x2="11" y2="30" />
        <line x1="37" y1="30" x2="43" y2="30" />
      </svg>
    ),
  },
  {
    id: '03',
    number: '03',
    title: 'Design & Planning',
    description:
      'Comprehensive consulting services to develop a design that best suits your needs.',
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="service-line-icon"
        aria-hidden="true"
      >
        <path d="M24 11L30 25H18L24 11Z" strokeLinejoin="round" />
        <circle cx="24" cy="20" r="1.8" fill="currentColor" />
        <path d="M24 25V31" />
        <rect x="20" y="31" width="8" height="4" rx="1" />
        <path d="M10 16C16 9 32 9 38 16" strokeDasharray="3 3" />
        <rect x="8" y="15" width="4" height="4" rx="0.5" />
        <rect x="36" y="15" width="4" height="4" rx="0.5" />
        <circle cx="24" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: '04',
    number: '04',
    title: 'Sustainability',
    description:
      'Eco-friendly designs to reduce energy and resource use while improving the surroundings.',
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="service-line-icon"
        aria-hidden="true"
      >
        <path d="M12 36V22L22 15V36H12Z" strokeLinejoin="round" />
        <path d="M22 23L30 18V36H22V23Z" strokeLinejoin="round" />
        <rect x="28" y="27" width="10" height="9" rx="1" />
        <path d="M28 31.5H38M33 27V36" />
        <circle cx="34" cy="12" r="3.5" />
        <path d="M34 5V7M34 17V19M27 12H29M39 12H41M29 7L30.5 8.5M37.5 15.5L39 17M29 17L30.5 15.5M37.5 8.5L39 7" />
      </svg>
    ),
  },
];

interface ServicesSectionProps {
  isNight?: boolean;
}

export function ServicesSection({ isNight = false }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>('02');

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
        '.services-tag-row',
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85 }
      )
        .fromTo(
          '.services-main-headline',
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.15 },
          '-=0.6'
        )
        .fromTo(
          '.service-table-row',
          { y: 55, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.15 },
          '-=0.75'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`services-section ${isNight ? 'night-mode' : ''}`}
      id="services"
      aria-label="Our Architecture and Interior Services"
    >
      <div className="services-wrapper">
        <div className="services-header">
          <div className="services-tag-row">
            <span className="services-tag-line" aria-hidden="true" />
            <span className="services-tag-label">OUR METHODOLOGY</span>
          </div>

          <h2 className="services-main-headline">
            The typical process of architecture.
          </h2>
        </div>

        <div className="services-table" role="table" aria-label="Services List">
          {SERVICES.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`service-table-row ${isActive ? 'active-row' : ''}`}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                role="row"
                tabIndex={0}
                aria-selected={isActive}
              >
                <div className="service-col-num" role="cell">
                  <span className="service-num-text">{item.number}</span>
                </div>

                <div className="service-col-icon" role="cell">
                  <div className="icon-box">{item.icon}</div>
                </div>

                <div className="service-col-title" role="cell">
                  <h3 className="service-title-text">{item.title}</h3>
                </div>

                <div className="service-col-desc" role="cell">
                  <p className="service-desc-text">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

