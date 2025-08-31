import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaBalanceScale, 
  FaShieldAlt, 
  FaCertificate, 
  FaGlobe, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
  FaAward,
  FaLock
} from 'react-icons/fa';
import { APP_CONFIG } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const governmentAgencies = [
    { 
      nameKey: 'ministryOfCorporateAffairs', 
      abbr: 'MCA',
      website: '#',
      logo: <FaBalanceScale />
    },
    { 
      nameKey: 'digitalIndiaCorporation', 
      abbr: 'DIC',
      website: '#',
      logo: <FaGlobe />
    },
    { 
      nameKey: 'nationalInformaticsCentre', 
      abbr: 'NIC',
      website: '#',
      logo: <FaShieldAlt />
    },
    { 
      nameKey: 'departmentOfAdministrativeReforms', 
      abbr: 'DARPG',
      website: '#',
      logo: <FaCertificate />
    }
  ];

  const certifications = [
    {
      nameKey: 'iso27001',
      typeKey: 'informationSecurity',
      icon: <FaLock />
    },
    {
      nameKey: 'stqcCertified',
      typeKey: 'softwareTesting',
      icon: <FaShieldAlt />
    },
    {
      nameKey: 'digitalIndiaReady',
      typeKey: 'governmentCompliance',
      icon: <FaAward />
    },
    {
      nameKey: 'certInApproved',
      typeKey: 'cybersecurity',
      icon: <FaCertificate />
    }
  ];

  const quickLinksData = [
    { nameKey: 'privacyPolicy', path: '#' },
    { nameKey: 'termsOfService', path: '#' },
    { nameKey: 'dataSecurity', path: '#' },
    { nameKey: 'accessibility', path: '#' },
    { nameKey: 'helpCenter', path: '#' },
    { nameKey: 'apiDocumentation', path: '#' }
  ];

  return (
    <footer className="government-footer">
      {/* Main Footer */}
      <div className="footer-main py-5">
        <Container>
          <Row>
            {/* Brand Section */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-brand">
                <div className="d-flex align-items-center mb-3">
                  <div className="footer-logo me-3">
                    <FaBalanceScale size={32} />
                  </div>
                  <div>
                    <h4 className="mb-1">{APP_CONFIG.APP_NAME}</h4>
                    <p className="mb-0">{APP_CONFIG.FULL_NAME}</p>
                  </div>
                </div>
                
                <p className="footer-description mb-3">
                  {t('footerDescription')}
                </p>

                {/* Certifications */}
                <div className="certifications mb-3">
                  <small className="text-muted d-block mb-2">{t('certificationsCompliance')}</small>
                  <div className="d-flex flex-wrap">
                    {certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} bg="outline-primary" className="me-2 mb-1 cert-badge">
                        {cert.icon}
                        <span className="ms-1">{t(cert.nameKey)}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="social-links">
                  <Button variant="outline-light" size="sm" className="me-2 social-btn">
                    <FaTwitter />
                  </Button>
                  <Button variant="outline-light" size="sm" className="me-2 social-btn">
                    <FaLinkedin />
                  </Button>
                  <Button variant="outline-light" size="sm" className="social-btn">
                    <FaGithub />
                  </Button>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={3} sm={6} className="mb-4">
              <h5 className="footer-heading mb-3">{t('quickLinks')}</h5>
              <ul className="footer-links">
                {quickLinksData.slice(0, 3).map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>

            <Col lg={2} md={3} sm={6} className="mb-4">
              <h5 className="footer-heading mb-3">{t('legal')}</h5>
              <ul className="footer-links">
                {quickLinksData.slice(3).map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact Info */}
            <Col lg={4} md={6} className="mb-4">
              <h5 className="footer-heading mb-3">{t('contactInformation')}</h5>
              
              <div className="contact-info mb-4">
                <div className="contact-item mb-2">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  <span>{t('addressLine')}</span>
                </div>
                <div className="contact-item mb-2">
                  <FaPhone className="me-2 text-primary" />
                  <span>{t('phoneNumber')}</span>
                </div>
                <div className="contact-item mb-2">
                  <FaEnvelope className="me-2 text-primary" />
                  <span>{t('emailAddress')}</span>
                </div>
              </div>

              {/* Help & Support */}
              <div className="support-section">
                <h6 className="mb-2">{t('supportTitle')}</h6>
                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm">
                    <FaPhone className="me-1" />
                    {t('callSupport')}
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <FaEnvelope className="me-1" />
                    {t('emailUs')}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="copyright">
                <p className="mb-0">
                  © {currentYear} {t('allRightsReserved')} | 
                  <span className="ms-1">
                    {t('developedBy')}
                  </span>
                </p>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="footer-badges">
                <Badge bg="success" className="me-2">
                  <FaShieldAlt className="me-1" />
                  {t('securePlatform')}
                </Badge>
                <Badge bg="info" className="me-2">
                  <FaGlobe className="me-1" />
                  {t('digitalIndia')}
                </Badge>
                <Badge bg="warning">
                  <FaAward className="me-1" />
                  {t('governmentVerified')}
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
