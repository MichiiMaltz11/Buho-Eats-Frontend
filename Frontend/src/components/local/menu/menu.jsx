import React from 'react';
import { useLanguage } from '../../../LanguageContext'; 
import { translations } from '../../../translate/Translations'; 
import './menu.css';

const MenuCard = ({ menu }) => {
  const { language } = useLanguage(); // Obtén el idioma actual
  return (
    <div className="menu-card">
      <h2 className="menu-title">{translations[language].menu} <br /> ---------- </h2>
      <div className="menu-grid">
        {menu.map((plato, index) => (
          <div className="menu-item" key={index}>
            <div className="menu-info">
              <span className="plato-name">{plato.nombre}</span>
              <span className="plato-price">${plato.precio}</span>
            </div>
            <img src={plato.imagen} alt={plato.nombre} className="plato-image" /> <br /> -------------------
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCard;
