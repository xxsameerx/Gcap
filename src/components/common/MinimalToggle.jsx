import React from 'react';
import { ButtonGroup, Button, Dropdown } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const MinimalToggle = () => {
  const { language, changeLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="minimal-toggle">
      <ButtonGroup size="sm" className="toggle-group">
        {/* Theme Toggle */}
        <Button
          variant={isDark ? 'dark' : 'light'}
          onClick={toggleTheme}
          className="minimal-theme-btn"
        >
          {isDark ? <FaMoon /> : <FaSun />}
        </Button>

        {/* Language Toggle */}
        <Dropdown as={ButtonGroup}>
          <Button variant="outline-secondary" className="minimal-lang-btn">
            {language === 'en' ? 'EN' : 'हि'}
          </Button>
          <Dropdown.Toggle
            split
            variant="outline-secondary"
            className="minimal-lang-dropdown"
          />
          <Dropdown.Menu>
            <Dropdown.Item
              active={language === 'en'}
              onClick={() => changeLanguage('en')}
            >
              English
            </Dropdown.Item>
            <Dropdown.Item
              active={language === 'hi'}
              onClick={() => changeLanguage('hi')}
            >
              हिन्दी
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ButtonGroup>
    </div>
  );
};

export default MinimalToggle;
