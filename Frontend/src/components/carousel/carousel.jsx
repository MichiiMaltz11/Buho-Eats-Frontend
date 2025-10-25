import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext'; // Contexto de idioma
import { translations } from '../../translate/Translations'; // Importamos las traducciones
import './carousel.css';

const Carousel = ({ images, localNames, showTitle = true, showNameAsTitle = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const { language } = useLanguage();  // Accedemos al idioma actual desde el contexto
  const t = translations[language];  // Obtenemos las traducciones

  const nextImage = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(true);
    }, 300);
  };

  const prevImage = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className="carousel-container">
      {showTitle && !showNameAsTitle && <h2 className="carousel-title">{t.bestRated}</h2>}
      {showNameAsTitle && <h2 className="carousel-title">{localNames[currentIndex]}</h2>}

      <button className="prev" onClick={prevImage}>❮</button>
      <img
        src={images[currentIndex]}
        alt="carousel"
        className={`carousel-image ${fade ? 'fade-in' : 'fade-out'}`}
      />
      <button className="next" onClick={nextImage}>❯</button>

      {/* Aquí mostramos el nombre siempre, pero usando el texto con el estilo ajustado. */}
      {!showNameAsTitle && <p className="local-name">{localNames[currentIndex]}</p>}
    </div>
  );
};

export default Carousel;

