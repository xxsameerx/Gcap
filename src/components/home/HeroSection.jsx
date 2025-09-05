import React, { useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import indiaImage from '../../assets/indiaimh.jpg';

import { 
  FaRocket, 
  FaChartLine, 
  FaUsers, 
  FaFlag, 
  FaBalanceScale,
  FaShieldAlt,
  FaCertificate,
  FaAward,
  FaPlay,
  FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { APP_CONFIG } from '../../utils/constants';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const { t, isHindi } = useLanguage();
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  // Safe translation function
  const safeT = (key, fallback = key) => {
    try {
      return t && t(key) ? t(key) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  // 3D parallax tilt effect
  useEffect(() => {
    const heroElement = heroRef.current;
    const contentElement = contentRef.current;

    if (!heroElement || !contentElement) return;

    const handleMouseMove = (e) => {
      const rect = heroElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      const rotateX = y * -8; // Reduced intensity
      const rotateY = x * 8;
      const translateZ = Math.abs(x) * 10 + Math.abs(y) * 10;
      
      contentElement.style.transform = 
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    };

    const handleMouseLeave = () => {
      contentElement.style.transform = 
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    heroElement.addEventListener('mousemove', handleMouseMove);
    heroElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
      heroElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const trustIndicators = [
    { icon: <FaShieldAlt />, text: 'ISO 27001 Certified' },
    { icon: <FaCertificate />, text: 'Government Approved' },
    { icon: <FaAward />, text: 'Digital India Ready' }
  ];

  const keyFeatures = [
    'AI-Powered Sentiment Analysis',
    'Real-time Data Processing', 
    'Multi-language Support',
    'Secure Cloud Infrastructure'
  ];

  return (
    <section 
      ref={heroRef}
      className="hero-section-enhanced"
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(13, 71, 161, 0.9) 0%, 
            rgba(25, 32, 72, 0.85) 35%,
            rgba(16, 20, 43, 0.9) 70%,
            rgba(8, 12, 28, 0.95) 100%
          ),
          url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div className="hero-bg-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Particle Effect Overlay */}
      <div className="particles-overlay">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <Container className="position-relative" style={{ zIndex: 10 }}>
        <div 
          ref={contentRef}
          className="hero-content-3d"
          style={{
            transition: 'transform 0.1s ease-out',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Government Header */}
          <Row className="justify-content-center mb-5 pt-5">
            <Col lg={10} className="text-center">
              <div className="government-header-enhanced">
                <Badge 
                  className="government-badge-glow px-4 py-3 mb-4" 
                  style={{
                    background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)',
                    fontSize: '1rem',
                    color: 'white'
                  }}
                >
                  <FaFlag className="me-2" />
                  {isHindi ? 'भारत सरकार | Government of India' : 'Government of India'}
                </Badge>
              </div>
            </Col>
          </Row>

          <Row className="align-items-center min-vh-75">
            <Col lg={7} className="mb-4 mb-lg-0">
              <div className="hero-content-main text-white">
                {/* Enhanced Main Heading */}
                <div className="hero-heading mb-5">
                  <h1 className="hero-title-enhanced display-3 fw-bold mb-4">
                    <span 
                      className="gcap-title-glow"
                      style={{
                        background: 'linear-gradient(45deg, #00ffe7, #64ffda, #1de9b6)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 50px rgba(0, 255, 231, 0.5)',
                        fontSize: '4rem'
                      }}
                    >
                      {APP_CONFIG?.APP_NAME || 'GCAP'}
                    </span>
                    <br />
                    <span className="hero-subtitle-modern lead fw-normal text-light">
                      Government Consultation Analytics Platform
                    </span>
                    <br />
                    <span className="hero-subtitle-hindi h5 text-warning">
                      सरकारी परामर्श विश्लेषण मंच
                    </span>
                  </h1>
                  
                  <div className="hero-tagline-enhanced mb-4 p-4 rounded">
                    <h4 className="text-info fw-light fst-italic">
                      "{safeT('tagline', 'Your Voice, Government Choice')}"
                    </h4>
                    <p className="tagline-hindi text-warning mb-0">
                      "आपकी आवाज़, सरकार की पसंद"
                    </p>
                  </div>
                </div>

                {/* Enhanced Description */}
                <div className="hero-descriptions mb-5">
                  <p className="hero-description-main lead mb-4 text-light" style={{ fontSize: '1.2rem' }}>
                    Transform stakeholder consultation through <strong className="text-info">advanced AI analytics</strong>. 
                    Process thousands of public comments instantly with sentiment analysis 
                    and interactive visualizations for evidence-based policy making.
                  </p>
                  
                  <p className="hero-description-hindi mb-4 text-light opacity-75">
                    उन्नत AI विश्लेषण के माध्यम से हितधारक परामर्श में रूपांतरण। 
                    साक्ष्य-आधारित नीति निर्माण के लिए तुरंत हजारों टिप्पणियों का विश्लेषण।
                  </p>
                </div>

                {/* Enhanced Key Features */}
                <div className="key-features-enhanced mb-5">
                  <Row>
                    {keyFeatures.map((feature, index) => (
                      <Col md={6} key={index} className="mb-3">
                        <div 
                          className="feature-item-enhanced d-flex align-items-center p-2 rounded"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <FaArrowRight className="feature-arrow me-3 text-success" size={16} />
                          <span className="text-white">{feature}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="hero-actions-enhanced mb-5">
                  <Row>
                    <Col sm={6} className="mb-3">
                      {!isAuthenticated ? (
                        <Button 
                          as={Link} 
                          to="/signup" 
                          size="lg"
                          className="w-100 btn-enhanced-primary"
                          style={{
                            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                            border: 'none',
                            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
                            fontSize: '1.1rem',
                            padding: '15px 30px',
                            borderRadius: '50px'
                          }}
                        >
                          <FaRocket className="me-2" />
                          {safeT('getStarted', 'Get Started')}
                        </Button>
                      ) : (
                        <Button 
                          as={Link} 
                          to="/analysis" 
                          size="lg"
                          className="w-100 btn-enhanced-primary"
                          style={{
                            background: 'linear-gradient(45deg, #00ffe7, #64ffda)',
                            border: 'none',
                            color: '#000',
                            boxShadow: '0 8px 25px rgba(0, 255, 231, 0.4)',
                            fontSize: '1.1rem',
                            padding: '15px 30px',
                            borderRadius: '50px'
                          }}
                        >
                          <FaChartLine className="me-2" />
                          {safeT('startAnalysis', 'Start Analysis')}
                        </Button>
                      )}
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Button 
                        size="lg"
                        variant="outline-light"
                        className="w-100"
                        style={{
                          borderWidth: '2px',
                          fontSize: '1.1rem',
                          padding: '15px 30px',
                          borderRadius: '50px',
                          backdropFilter: 'blur(10px)',
                          background: 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <FaPlay className="me-2" />
                        Watch Demo
                      </Button>
                    </Col>
                  </Row>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="trust-indicators-enhanced">
                  <small className="trust-label mb-3 d-block text-light opacity-75">
                    Trusted & Certified:
                  </small>
                  <div className="d-flex flex-wrap gap-3">
                    {trustIndicators.map((indicator, index) => (
                      <div 
                        key={index} 
                        className="trust-item-enhanced px-3 py-2 rounded"
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      >
                        <span className="trust-icon me-2 text-warning">{indicator.icon}</span>
                        <small>{indicator.text}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={5}>
              <div className="hero-visual-enhanced">
                <div 
                  className="government-seal-3d text-center p-4 rounded"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: 'translateZ(50px)'
                  }}
                >
                  <div className="ashoka-chakra-enhanced mb-4">
                    <FaBalanceScale 
                      size={120} 
                      className="text-warning"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6))',
                        animation: 'float 6s ease-in-out infinite'
                      }}
                    />
                  </div>
                  
                  <h3 className="visual-title mb-3 text-warning">जन आवाज़, राष्ट्र विकास</h3>
                  <h4 className="visual-subtitle mb-4 text-light">People's Voice, National Development</h4>
                  
                  {/* Enhanced Quick Stats */}
                  <Row className="quick-stats-enhanced g-2">
                    {[
                      { number: '25+', label: 'Ministries', color: 'info' },
                      { number: '2.5M+', label: 'Comments', color: 'success' },
                      { number: '96%', label: 'Accuracy', color: 'warning' }
                    ].map((stat, index) => (
                      <Col xs={4} key={index}>
                        <div 
                          className="stat-item-enhanced text-center p-3 rounded"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <h4 className={`stat-number text-${stat.color} mb-1`}>{stat.number}</h4>
                          <small className="stat-label text-light">{stat.label}</small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
