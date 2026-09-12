import React from 'react';
import './FooterSection.css';

interface FooterSectionProps {
  isNight?: boolean;
}

export function FooterSection({ isNight = false }: FooterSectionProps) {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`footer-section ${isNight ? 'night-mode' : ''}`}
      id="contact"
      aria-label="Footer and Contact Information"
    >
      <div className="footer-container">
        <div className="footer-main-row">
          <div className="footer-left-col">
            <h2 className="footer-headline">
              Have a project in mind?<br />
              Let&apos;s work together.
            </h2>

            <div className="footer-contact-info">
              <a
                href="mailto:info@luxe-interior.design"
                className="footer-contact-link"
              >
                info@luxe-interior.design
              </a>

              <span className="footer-contact-item">
                (876) 419-4797
              </span>

              <span className="footer-contact-item">
                15 Studio One Blvd, Kingston 5
              </span>
            </div>
          </div>

          <div className="footer-right-col">
            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Company</h3>
              <ul className="footer-nav-list">
                <li>
                  <a href="#" onClick={scrollToTop} className="footer-nav-link">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#projects" className="footer-nav-link">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#about" className="footer-nav-link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-nav-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Social</h3>
              <ul className="footer-nav-list">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider-line" aria-hidden="true" />

        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            {new Date().getFullYear()} © Luxe Interior Limited
          </div>

          <div className="footer-credits">
            Design &amp; Dev by ( Luxe Studio )
          </div>
        </div>
      </div>
    </footer>
  );
}

