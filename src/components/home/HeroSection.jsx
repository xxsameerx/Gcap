import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    <section className="hero-section-professional">
      {/* Background Elements */}
      <div className="hero-background-pattern"></div>
      <div className="hero-gradient-overlay"></div>
      
      <Container className="position-relative">
        {/* Government Header */}
        <Row className="justify-content-center mb-4">
          <Col lg={10} className="text-center">
            <div className="government-header">
              <Badge className="government-badge-hero px-4 py-2 mb-3">
                <FaFlag className="me-2" />
                {isHindi ? 'भारत सरकार | Government of India' : 'Government of India'}
              </Badge>
            </div>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col lg={7} className="mb-4 mb-lg-0">
            <div className="hero-content-professional">
              {/* Main Heading */}
              <div className="hero-heading mb-4">
                <h1 className="hero-title">
                  <span className="gcap-title">{APP_CONFIG.APP_NAME}</span>
                  <br />
                  <span className="hero-subtitle-professional">
                    Government Consultation Analytics Platform
                  </span>
                  <br />
                  <span className="hero-subtitle-hindi">
                    सरकारी परामर्श विश्लेषण मंच
                  </span>
                </h1>
                
                <div className="hero-tagline mb-4">
                  <h4>"{t('tagline')}"</h4>
                  <p className="tagline-hindi">"आपकी आवाज़, सरकार की पसंद"</p>
                </div>
              </div>

              {/* Description */}
              <p className="hero-description-professional mb-4">
                Transform stakeholder consultation through advanced AI analytics. 
                Process thousands of public comments instantly with sentiment analysis 
                and interactive visualizations for evidence-based policy making.
              </p>
              
              <p className="hero-description-hindi mb-4">
                उन्नत AI विश्लेषण के माध्यम से हितधारक परामर्श में रूपांतरण। 
                साक्ष्य-आधारित नीति निर्माण के लिए तुरंत हजारों टिप्पणियों का विश्लेषण।
              </p>

              {/* Key Features */}
              <div className="key-features mb-4">
                <Row>
                  {keyFeatures.map((feature, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <div className="feature-item">
                        <FaArrowRight className="feature-arrow me-2" size={12} />
                        <small>{feature}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* CTA Buttons */}
              <div className="hero-actions mb-4">
                <Row>
                  <Col sm={6} className="mb-3">
                    {!isAuthenticated ? (
                      <Button 
                        as={Link} 
                        to="/signup" 
                        className="btn-professional-primary w-100"
                        size="lg"
                      >
                        <FaRocket className="me-2" />
                        {t('getStarted')}
                      </Button>
                    ) : (
                      <Button 
                        as={Link} 
                        to="/analysis" 
                        className="btn-professional-primary w-100"
                        size="lg"
                      >
                        <FaChartLine className="me-2" />
                        {t('startAnalysis')}
                      </Button>
                    )}
                  </Col>
                  <Col sm={6} className="mb-3">
                    <Button 
                      className="w-100 btn-professional-secondary"
                      size="lg"
                    >
                      <FaPlay className="me-2" />
                      Watch Demo
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Trust Indicators */}
              <div className="trust-indicators-hero">
                <small className="trust-label mb-2 d-block">Trusted & Certified:</small>
                <div className="d-flex flex-wrap gap-2">
                  {trustIndicators.map((indicator, index) => (
                    <div key={index} className="trust-item">
                      <span className="trust-icon me-1">{indicator.icon}</span>
                      <small>{indicator.text}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={5}>
            <div className="hero-visual-professional">
              {/* Simplified Visual */}
              <div className="government-seal-large text-center">
                <div className="ashoka-chakra-professional mb-4">
                  <FaBalanceScale size={100} />
                </div>
                
                <h3 className="visual-title mb-3">जन आवाज़, राष्ट्र विकास</h3>
                <h4 className="visual-subtitle mb-4">People's Voice, National Development</h4>
                
                {/* Quick Stats */}
                <Row className="quick-stats">
                  <Col xs={4} className="text-center">
                    <div className="stat-item">
                      <h4 className="stat-number">25+</h4>
                      <small className="stat-label">Ministries</small>
                    </div>
                  </Col>
                  <Col xs={4} className="text-center">
                    <div className="stat-item">
                      <h4 className="stat-number">2.5M+</h4>
                      <small className="stat-label">Comments</small>
                    </div>
                  </Col>
                  <Col xs={4} className="text-center">
                    <div className="stat-item">
                      <h4 className="stat-number">96%</h4>
                      <small className="stat-label">Accuracy</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
