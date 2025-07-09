import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate(); // Add navigate hook

  const features = [
    { icon: '🔒', text: 'Bank-Grade Security', color: 'blue' },
    { icon: '📱', text: 'Mobile First Design', color: 'green' },
    { icon: '⚡', text: 'Lightning Fast', color: 'purple' },
    { icon: '🌐', text: '24/7 Availability', color: 'orange' },
    { icon: '🤖', text: 'AI-Powered Insights', color: 'cyan' },
    { icon: '☁️', text: 'Cloud Infrastructure', color: 'indigo' }
  ];

  useEffect(() => {
    // AGGRESSIVE SCROLL FIX
    const forceScrollEnable = () => {
      // Reset all potential scroll blocking styles
      document.documentElement.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.overflowX = 'hidden';

      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      document.body.style.position = 'static';
      document.body.style.width = '100%';

      // Also fix the root div
      const root = document.getElementById('root');
      if (root) {
        root.style.height = 'auto';
        root.style.overflow = 'visible';
        root.style.position = 'static';
        root.style.width = '100%';
      }

      // Remove any MUI or other library styles that might interfere
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.position === 'fixed' && el !== containerRef.current?.querySelector('.homepage-header') &&
          !el.classList.contains('background-effects') && !el.classList.contains('grid-overlay')) {
          // Don't touch our intentional fixed elements
          console.log('Found potentially interfering fixed element:', el);
        }
      });
    };

    // Force enable scrolling immediately and after a delay
    forceScrollEnable();
    setTimeout(forceScrollEnable, 100);

    // Trigger loading animation
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    // Feature rotation
    const featureTimer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    // Scroll handler for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Debug logging
    setTimeout(() => {
      console.log('=== SCROLL DEBUG INFO ===');
      console.log('Document height:', document.documentElement.scrollHeight);
      console.log('Window height:', window.innerHeight);
      console.log('Body height:', document.body.scrollHeight);
      console.log('Can scroll:', document.documentElement.scrollHeight > window.innerHeight);
      console.log('Document overflow:', window.getComputedStyle(document.documentElement).overflow);
      console.log('Body overflow:', window.getComputedStyle(document.body).overflow);
      console.log('Root element height:', document.getElementById('root')?.scrollHeight);
      console.log('Container height:', containerRef.current?.scrollHeight);
    }, 500);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(featureTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [features.length]);

  const handleLogin = () => {
    // Add smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.8';

    setTimeout(() => {
      navigate('/login'); // Navigate to login page
      document.body.style.opacity = '1';
    }, 300);
  };

  const stats = [
    { number: '99.9%', label: 'Uptime', icon: '📈' },
    { number: '500+', label: 'Communities', icon: '🏘️' },
    { number: '50K+', label: 'Happy Users', icon: '👥' },
    { number: '24/7', label: 'Support', icon: '🛟' }
  ];

  return (
    <div
      ref={containerRef}
      className={`homepage-container ${isLoaded ? 'loaded' : ''}`}
      style={{
        '--scroll-y': `${scrollY}px`,
        minHeight: '200vh' // Force container to be tall enough to scroll
      }}
    >
      {/* Enhanced background effects with parallax */}
      <div className="background-effects">
        <div
          className="bg-shape bg-shape-1"
          style={{
            transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.1}deg)`
          }}
        ></div>
        <div
          className="bg-shape bg-shape-2"
          style={{
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.1}deg)`
          }}
        ></div>
        <div
          className="bg-shape bg-shape-3"
          style={{
            transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.15}deg)`
          }}
        ></div>
        <div className="bg-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`particle particle-${i + 1}`}
              style={{
                transform: `translateY(${scrollY * (0.1 + (i % 5) * 0.05)}px)`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div
        className="grid-overlay"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      ></div>

      <div className="homepage-content">
        {/* Enhanced Header with glassmorphism */}
        <header className={`homepage-header ${isLoaded ? 'animate-in' : ''}`}>
          <div className="header-container">
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-icon">
                  <span className="logo-main">🏠</span>
                  <div className="logo-glow"></div>
                </div>
                <div className="logo-sparkle">✨</div>
              </div>
              <div className="brand-info">
                <h1 className="brand-title">GCMS</h1>
                <p className="brand-subtitle">Gated Community Management System</p>
              </div>
            </div>
            <button className="header-login-btn" onClick={handleLogin}>
              <span>Login</span>
              <div className="btn-arrow">→</div>
              <div className="btn-ripple"></div>
            </button>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <main className="homepage-main">
          <div className="main-container">
            {/* Welcome section with improved animations */}
            <div className={`hero-section ${isLoaded ? 'animate-in delay-300' : ''}`}>
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="badge-icon">🚀</span>
                  <span>Next Generation Community Platform</span>
                  <div className="badge-shimmer"></div>
                </div>
                <h1 className="hero-title">
                  <span className="title-line">Transform Your</span>
                  <span className="gradient-text title-line"> Community Experience</span>
                </h1>
                <p className="hero-description">
                  Discover the future of gated community management with our comprehensive,
                  intelligent platform designed for modern living. Seamlessly connect, manage,
                  and thrive in your digital community ecosystem.
                </p>

                {/* Enhanced Primary CTA */}
                <div className="hero-actions">
                  <button
                    className={`primary-cta ${hoveredCard === 'login' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredCard('login')}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={handleLogin}
                  >
                    <div className="cta-content">
                      <div className="cta-icon">
                        <span>🔐</span>
                        <div className="icon-pulse"></div>
                      </div>
                      <div className="cta-text">
                        <span className="cta-title">Access Your Portal</span>
                        <span className="cta-subtitle">Secure community dashboard</span>
                      </div>
                      <div className="cta-arrow">→</div>
                    </div>
                    <div className="cta-bg-effect"></div>
                  </button>
                </div>

                {/* Enhanced Rotating Features */}
                <div className="rotating-features">
                  <div className="feature-indicator">
                    <div className="feature-item active">
                      <span className="feature-icon">{features[currentFeature].icon}</span>
                      <span className="feature-text">{features[currentFeature].text}</span>
                      <div className="feature-progress">
                        <div className="progress-bar"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Section */}
            <div className={`stats-section ${isLoaded ? 'animate-in delay-600' : ''}`}>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className={`stat-card delay-${(index + 1) * 100}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">
                      <span className="number-counter">{stat.number}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-glow"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Features showcase */}
            <div className={`features-showcase ${isLoaded ? 'animate-in delay-900' : ''}`}>
              <h2 className="features-title">
                <span>Why Choose </span>
                <span className="title-highlight">GCMS</span>
                <span>?</span>
              </h2>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`feature-card delay-${index * 100}`}
                    onMouseEnter={() => setHoveredCard(`feature-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`feature-icon-wrapper ${feature.color}`}>
                      <span className="feature-icon-large">{feature.icon}</span>
                      <div className="icon-background"></div>
                    </div>
                    <h3 className="feature-title">{feature.text}</h3>
                    <div className="feature-hover-effect"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className={`trust-section ${isLoaded ? 'animate-in delay-1200' : ''}`}>
              <div className="trust-content">
                <h3 className="trust-title">Trusted by Communities Worldwide</h3>
                <div className="trust-badges">
                  {[
                    { icon: '🛡️', text: 'ISO 27001 Certified' },
                    { icon: '🔒', text: 'GDPR Compliant' },
                    { icon: '⭐', text: '4.9/5 Rating' },
                    { icon: '🏆', text: 'Award Winning' }
                  ].map((badge, index) => (
                    <div key={index} className="trust-badge">
                      <span className="trust-icon">{badge.icon}</span>
                      <span>{badge.text}</span>
                      <div className="badge-glow"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className={`homepage-footer ${isLoaded ? 'animate-in delay-1500' : ''}`}>
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-main">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <span className="footer-logo-icon">🏠</span>
                    <span className="footer-logo-text">GCMS</span>
                  </div>
                  <p className="footer-tagline">
                    Empowering communities through innovative technology solutions.
                  </p>
                </div>

                <div className="footer-links">
                  <div className="footer-column">
                    <h4>Platform</h4>
                    <button className="footer-link">Features</button>
                    <button className="footer-link">Security</button>
                    <button className="footer-link">Integrations</button>
                  </div>
                  <div className="footer-column">
                    <h4>Support</h4>
                    <button className="footer-link">Help Center</button>
                    <button className="footer-link">Documentation</button>
                    <button className="footer-link">Contact Us</button>
                  </div>
                  <div className="footer-column">
                    <h4>Company</h4>
                    <button className="footer-link">About</button>
                    <button className="footer-link">Privacy</button>
                    <button className="footer-link">Terms</button>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p className="footer-copyright">
                  © 2025 GCMS. All rights reserved. Built with ❤️ for communities.
                </p>
                <div className="footer-social">
                  <button className="social-link" aria-label="Twitter">🐦</button>
                  <button className="social-link" aria-label="LinkedIn">💼</button>
                  <button className="social-link" aria-label="GitHub">🔗</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;