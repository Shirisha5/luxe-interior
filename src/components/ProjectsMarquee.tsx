import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ProjectsMarquee.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  image: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'atelier-brutal',
    title: 'ATELIER BRUTAL',
    location: 'Paris, France',
    year: '2025',
    category: 'Architecture & Gallery',
    image: '/images/p1.jpg',
  },
  {
    id: 'villa-kyoto',
    title: 'VILLA KYOTO',
    location: 'Kyoto, Japan',
    year: '2024',
    category: 'Private Residence',
    image: '/images/p2.jpg',
  },
  {
    id: 'penthouse-milano',
    title: 'PENTHOUSE MILANO',
    location: 'Milan, Italy',
    year: '2025',
    category: 'Luxury Interior',
    image: '/images/p3.jpg',
  },
  {
    id: 'val-des-monts',
    title: 'CHALET VAL-DES-MONTS',
    location: 'Swiss Alps',
    year: '2024',
    category: 'Alpine Architecture',
    image: '/images/p4.jpg',
  },
  {
    id: 'copenhagen-loft',
    title: 'COPENHAGEN LOFT',
    location: 'Copenhagen, Denmark',
    year: '2025',
    category: 'Minimalist Penthouse',
    image: '/images/p5.jpg',
  },
  {
    id: 'timber-pavilion',
    title: 'ATELIER JOINERY',
    location: 'Zurich, Switzerland',
    year: '2024',
    category: 'Bespoke Craftsmanship',
    image: '/images/p6.jpg',
  },
  {
    id: 'monolith-residence',
    title: 'THE MONOLITH',
    location: 'Stockholm, Sweden',
    year: '2025',
    category: 'Nordic Architecture',
    image: '/images/p7.jpg',
  },
  {
    id: 'casa-lumina',
    title: 'CASA LUMINA',
    location: 'Barcelona, Spain',
    year: '2024',
    category: 'Contemporary Villa',
    image: '/images/p8.jpg',
  },
];

interface ProjectsMarqueeProps {
  isNight?: boolean;
}

export function ProjectsMarquee({ isNight = false }: ProjectsMarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeList = [...PROJECTS, ...PROJECTS];

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
        '.projects-tag-wrapper',
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85 }
      )
        .fromTo(
          '.projects-title',
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.15 },
          '-=0.6'
        )
        .fromTo(
          '.projects-marquee-wrapper',
          { y: 80, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.35 },
          '-=0.8'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`projects-section ${isNight ? 'night-mode' : ''}`}
      id="projects"
      aria-label="Selected Projects Worked"
    >
      <div className="projects-header-container">
        <div className="projects-tag-wrapper">
          <span className="projects-tag-line" aria-hidden="true" />
          <span className="projects-tag">SELECTED WORKS</span>
        </div>
        <h2 className="projects-title">OUR PROJECTS</h2>
      </div>

      <div
        className="projects-marquee-wrapper"
        tabIndex={0}
        role="region"
        aria-label="Projects carousel scrolling right to left"
      >
        <div className="projects-marquee-track">
          {marqueeList.map((project, idx) => (
            <article
              key={`${project.id}-${idx}`}
              className="project-card"
              aria-label={`${project.title}, ${project.location}`}
            >
              <div className="project-image-frame">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                />
                <div className="project-overlay-badge">
                  <span className="project-category">{project.category}</span>
                  <span className="project-year">{project.year}</span>
                </div>
              </div>

              <div className="project-caption">
                <h3 className="project-name">{project.title}</h3>
                <span className="project-location">{project.location}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

