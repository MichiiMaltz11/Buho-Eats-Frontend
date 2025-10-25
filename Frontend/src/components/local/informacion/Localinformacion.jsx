import React, { useContext } from 'react';
import icon from '../../../assets/icons/icon.png';
import { Link } from 'react-router-dom';
import './Localinformacion.css';
import { LanguageContext } from '../../../LanguageContext'; // Asegúrate de importar el contexto
import { translations } from '../../../translate/Translations'; // Importa las traducciones

const LocalInformacion = ({ local }) => {
  const { language } = useContext(LanguageContext); // Obtén el idioma desde el contexto

  return (
    <div className="local-info-container">
      <div className="description-card">
        <h2>{translations[language].description}:</h2>
        <p>{local.description}</p>
      </div>
      <div className="info-review-container">
        <div className="review-section">
          <div className="review-card">
            <div className="user-name-container">
              <span>{local.reseñas[0].usuario}</span>
              <img src={icon} alt="icon" className='iconU' />
            </div>
            <p>{local.reseñas[0].texto}</p>
            <div className="stars">{'★'.repeat(local.reseñas[0].estrellas)}</div>
          </div>
          <Link to={`/local/${local.id}/reviews`} className="view-comments">
            {translations[language].viewComments}
          </Link>
        </div>
        <div className="contact-info-card">
          <p><strong>{translations[language].email}:</strong> </p> 
          <p><i className="fas fa-envelope"></i>{local.correo}</p>
          <p><strong>{translations[language].phone}:</strong> </p> 
          <p><i className="fas fa-phone-alt"></i> {local.telefono}</p>
          <p><strong>{translations[language].schedule}:</strong> </p> 
          <p><i className="fas fa-clock"></i> {local.horario}</p>
          <p><strong>{translations[language].address}:</strong> </p> 
          <p><i className="fas fa-map-marker-alt"></i>{local.direccion}</p>
        </div>
      </div>
    </div>
  );
};

export default LocalInformacion;
