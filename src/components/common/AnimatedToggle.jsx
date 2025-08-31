import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const AnimatedToggle = () => {
  const { language, changeLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const handleThemeToggle = () => {
    setIsThemeChanging(true);
    setTimeout(() => {
      toggleTheme();
      setIsThemeChanging(false);
    }, 300);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  return (
    <div className="animated-toggle d-flex align-items-center gap-2">
      {/* Animated Theme Toggle */}
      <Button
        variant="none"
        className={`theme-toggle-animated ${isDark ? 'dark' : 'light'} ${isThemeChanging ? 'changing' : ''}`}
        onClick={handleThemeToggle}
        disabled={isThemeChanging}
      >
        <div className="toggle-container">
          <div className="toggle-track">
            <div className="toggle-thumb">
              {isDark ? <FaMoon size={12} /> : <FaSun size={12} />}
            </div>
          </div>
        </div>
      </Button>

      {/* Language Globe Toggle */}
      <Dropdown>
        <Dropdown.Toggle
          variant="none"
          className="language-toggle-animated"
        >
          <div className="globe-container">
            <FaGlobe className="globe-icon" />
            <span className="lang-badge">{language.toUpperCase()}</span>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="language-menu-animated">
          {languages.map((lang) => (
            <Dropdown.Item
              key={lang.code}
              active={language === lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="language-item-animated"
            >
              <span className="flag-emoji me-2">{lang.flag}</span>
              {lang.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default AnimatedToggle;
