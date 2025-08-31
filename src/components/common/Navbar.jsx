import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, NavDropdown, Button, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { APP_CONFIG } from '../../utils/constants';

// 👇 Import your toggle component
import ToggleControls from './ToggleControls'; // Use the simple version we created

import { 
  FaRobot, 
  FaChartLine, 
  FaHome, 
  FaSignInAlt, 
  FaUserPlus, 
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBalanceScale
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowOffcanvas(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowOffcanvas(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: t('home'), icon: FaHome, public: true },
    { path: '/analysis', label: t('analysis'), icon: FaChartLine, protected: true },
    { path: '/chat-bot', label: t('aiAssistant'), icon: FaRobot, protected: true },
  ];

  return (
    <>
      <BSNavbar className="government-navbar" expand="lg" sticky="top">
        <Container>
          {/* Brand */}
          <BSNavbar.Brand as={Link} to="/" className="brand-logo d-flex align-items-center">
            <div className="brand-icon me-3">
              <div className="ashoka-chakra">
                <FaBalanceScale className="chakra-icon" />
              </div>
            </div>
            <div className="brand-text">
              <div className="brand-main">{APP_CONFIG.APP_NAME}</div>
              <div className="brand-full">{APP_CONFIG.FULL_NAME}</div>
              <div className="brand-tagline">{t('tagline')}</div>
            </div>
          </BSNavbar.Brand>
          
          {/* Desktop Navigation */}
          <BSNavbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="me-auto">
              {navigationItems.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                if (!item.public && !item.protected) return null;
                
                const IconComponent = item.icon;
                return (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`nav-link-government ${isActiveRoute(item.path) ? 'active' : ''}`}
                  >
                    <IconComponent className="me-2" />
                    {item.label}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* ✅ Toggle Controls - DESKTOP VERSION */}
            <ToggleControls className="me-3" />
            
            {/* Auth Section */}
            <Nav className="auth-section">
              {!isAuthenticated ? (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/login" 
                    className={`nav-link-government ${isActiveRoute('/login') ? 'active' : ''}`}
                  >
                    <FaSignInAlt className="me-1" />
                    {t('login')}
                  </Nav.Link>
                  <Button 
                    as={Link} 
                    to="/signup" 
                    className="btn-government ms-2"
                    size="sm"
                  >
                    <FaUserPlus className="me-1" />
                    {t('signup')}
                  </Button>
                </>
              ) : (
                <NavDropdown 
                  title={
                    <span className="user-dropdown">
                      <FaUser className="me-2" />
                      {t('welcome')}, {user?.name || 'User'}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                  className="user-dropdown-government"
                >
                  <NavDropdown.Item className="dropdown-item-government">
                    <FaUser className="me-2" />
                    {t('profile')}
                  </NavDropdown.Item>
                  <NavDropdown.Item className="dropdown-item-government">
                    <FaCog className="me-2" />
                    {t('settings')}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item-government logout-item">
                    <FaSignOutAlt className="me-2" />
                    {t('logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </BSNavbar.Collapse>

          {/* Mobile Menu Toggle */}
          <div className="d-lg-none d-flex align-items-center">
            {/* ✅ Toggle Controls - MOBILE VERSION */}
            <ToggleControls className="me-2" />
            
            <Button
              variant="outline-light"
              className="mobile-menu-btn"
              onClick={() => setShowOffcanvas(true)}
            >
              <FaBars />
            </Button>
          </div>
        </Container>
      </BSNavbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)} 
        placement="end"
        className="mobile-offcanvas-government"
      >
        {/* ... rest of your offcanvas code ... */}
      </Offcanvas>
    </>
  );
};

export default Navbar;
