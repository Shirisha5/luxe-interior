import { useEffect, useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  isNight?: boolean;
  isLoaded?: boolean;
}

export function Navbar({ isNight = false, isLoaded = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 20);
      setIsOverHero(scrollY < 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const effectiveNight = isNight && !isOverHero;

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`navbar-sticky ${!isLoaded ? 'navbar-hidden' : ''} ${
          isScrolled ? 'navbar-scrolled' : ''
        } ${effectiveNight ? 'navbar-night' : ''} ${mobileMenuOpen ? 'menu-is-open' : ''}`}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="navbar-brand"
        >
          LUXE
        </a>

        <div className="navbar-right">
          <nav className="navbar-menu">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="navbar-menu-item"
            >
              ABOUT
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, 'projects')}
              className="navbar-menu-item"
            >
              PROJECTS
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, 'services')}
              className="navbar-menu-item"
            >
              SERVICES
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="navbar-menu-item"
            >
              CONTACT
            </a>
          </nav>

          <button
            className={`navbar-hamburger ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </header>

      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'is-open' : ''} ${
          effectiveNight ? 'navbar-night' : ''
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="mobile-nav-item"
            >
              <span className="mobile-nav-num">01</span>
              <span className="mobile-nav-text">ABOUT</span>
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, 'projects')}
              className="mobile-nav-item"
            >
              <span className="mobile-nav-num">02</span>
              <span className="mobile-nav-text">PROJECTS</span>
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, 'services')}
              className="mobile-nav-item"
            >
              <span className="mobile-nav-num">03</span>
              <span className="mobile-nav-text">SERVICES</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="mobile-nav-item"
            >
              <span className="mobile-nav-num">04</span>
              <span className="mobile-nav-text">CONTACT</span>
            </a>
          </nav>

          <div className="mobile-nav-footer">
            <div className="mobile-nav-brand-title">LUXE INTERIOR</div>
            <div className="mobile-nav-tagline">Architectural Studio & Space Design</div>
          </div>
        </div>
      </div>
    </>
  );
}

