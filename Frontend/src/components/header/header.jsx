import React, { useState } from 'react';
import './header.css';
import logo from '../../assets/icons/Logo.png';
import logob from '../../assets/icons/LogoB.png';
import icon from '../../assets/icons/icon.png';
import arrow from '../../assets/buttons/arrow.png';
import UserSlider from '../slider/Slider';
import { useLanguage } from '../../LanguageContext'; // Contexto de idioma
import { translations } from '../../translate/Translations'; // Importamos las traducciones

function HeaderSearch({ showSearchBar = true, showBackArrow = false, showUserIcon = true }) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  const goBack = () => {
    window.history.back();
  };

  // Accedemos al idioma actual desde el contexto
  const { language } = useLanguage();
  const t = translations[language]; // Obtenemos las traducciones

  return (
    <header className="header">
      {showBackArrow && (
        <div className="arrow-container" onClick={goBack}>
          <img src={arrow} alt={t.back} className="arrow-img" />
        </div>
      )}

      <div className={`logo-container ${!showSearchBar ? 'center-logo' : ''}`}>
        <img src={logo} alt="Logo" className="logo-img" />
        <img src={logob} alt="LogoB" className="logob-img" />
      </div>

      {showSearchBar && (
        <div className="search-bar">
          <input type="text" placeholder={t.searchPlaceholder} />
        </div>
      )}

      {showUserIcon && (
        <div className="user-icon" onClick={toggleSlider}>
          <img src={icon} alt={t.user} className="user-img" />
        </div>
      )}

      <UserSlider isOpen={isSliderOpen} toggleSlider={toggleSlider} />
    </header>
  );
}

export default HeaderSearch;
