import React from 'react';
import { Button, ButtonGroup, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSun, FaMoon, FaGlobe, FaLanguage, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const ToggleControls = ({ className = '', variant = 'default' }) => {
  const { language, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  // Compact version for mobile
  if (variant === 'compact') {
    return (
      <div className={`toggle-controls-compact ${className}`}>
        <ButtonGroup size="sm">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Switch to {isDark ? 'Light' : 'Dark'} Mode</Tooltip>}
          >
            <Button
              variant={isDark ? 'warning' : 'primary'}
              onClick={toggleTheme}
              className="theme-toggle-compact"
            >
              {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
            </Button>
          </OverlayTrigger>

          <Dropdown as={ButtonGroup}>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Change Language</Tooltip>}
            >
              <Button
                variant="outline-secondary"
                className="language-toggle-compact"
              >
                <span className="flag-icon">{currentLang.flag}</span>
              </Button>
            </OverlayTrigger>

            <Dropdown.Toggle
              split
              variant="outline-secondary"
              size="sm"
              className="language-dropdown-toggle"
            />

            <Dropdown.Menu align="end">
              {languages.map((lang) => (
                <Dropdown.Item
                  key={lang.code}
                  active={language === lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="language-dropdown-item"
                >
                  <span className="flag-icon me-2">{lang.flag}</span>
                  <span className="lang-native">{lang.nativeName}</span>
                  <small className="text-muted ms-1">({lang.name})</small>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </div>
    );
  }

  // Default professional version
  return (
    <div className={`toggle-controls-professional ${className}`}>
      <div className="d-flex align-items-center gap-2">
        {/* Theme Toggle */}
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="theme-tooltip">
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </Tooltip>
          }
        >
          <Button
            variant={isDark ? 'warning' : 'primary'}
            size="sm"
            onClick={toggleTheme}
            className="theme-toggle-professional"
          >
            {isDark ? (
              <>
                <FaSun className="me-1" />
                <span className="d-none d-md-inline">Light</span>
              </>
            ) : (
              <>
                <FaMoon className="me-1" />
                <span className="d-none d-md-inline">Dark</span>
              </>
            )}
          </Button>
        </OverlayTrigger>

        {/* Language Toggle */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="outline-secondary"
            size="sm"
            className="language-toggle-professional"
          >
            <span className="flag-icon me-1">{currentLang.flag}</span>
            <span className="d-none d-sm-inline me-1">{currentLang.nativeName}</span>
            <FaChevronDown size={10} />
          </Dropdown.Toggle>

          <Dropdown.Menu className="language-dropdown-menu">
            <Dropdown.Header>
              <FaLanguage className="me-2" />
              Select Language | भाषा चुनें
            </Dropdown.Header>
            {languages.map((lang) => (
              <Dropdown.Item
                key={lang.code}
                active={language === lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="language-dropdown-item-professional"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="flag-icon me-2">{lang.flag}</span>
                    <div>
                      <div className="fw-medium">{lang.nativeName}</div>
                      <small className="text-muted">{lang.name}</small>
                    </div>
                  </div>
                  {language === lang.code && (
                    <div className="text-success">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.ItemText className="text-center">
              <small className="text-muted">
                <FaGlobe className="me-1" />
                More languages coming soon
              </small>
            </Dropdown.ItemText>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ToggleControls;
