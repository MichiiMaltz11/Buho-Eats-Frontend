/* Footer para todas las páginas */
import React from 'react';
import './footer.css';
import logo from '../../assets/icons/Logo.png';
import logob from '../../assets/icons/LogoB.png';
import phoneIcon from '../../assets/icons/phone-icon.png';
import emailIcon from '../../assets/icons/email-icon.png';
import facebookIcon from '../../assets/icons/facebook-icon.png';
import twitterIcon from '../../assets/icons/x-icon.png';
import instagramIcon from '../../assets/icons/instagram-icon.png';
import { useLanguage } from '../../LanguageContext'; // Importamos el contexto de idioma
import { translations } from '../../translate/Translations'; // Importamos las traducciones

function Footer() {
  const { language } = useLanguage(); // Obtenemos el idioma actual desde el contexto
  const t = translations[language];  // Obtenemos las traducciones del idioma actual
  

  return (
    <footer className="footer">
      <div className="footer-logo-container">
        <img src={logo} alt="Logo" className="footer-logo-img" />
        <img src={logob} alt="LogoB" className="footer-logo-img" />
      </div>

      <div className="footer-container">
        <div className='footer-contact'>
          <div className="contact-info">
            <p>{t.contacto}:</p>
            <div className="contact-item">
              <img src={phoneIcon} alt={t.telefono} className="contact-icon" />
              <span>+123 456 7890</span>
            </div>
            <div className="contact-item-mail">
              <img src={emailIcon} alt={t.email} className="contact-iconmail" />
              <a href="https://gmail.com" target="_blank" rel="noopener noreferrer">{t.contactoEmail}</a>
            </div>
          </div>
        </div>

        <div className="footer-socials">
          <div className="fbdiv">
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">{t.facebook}</a>
          </div>
          <div className="twdiv">
            <img src={twitterIcon} alt="Twitter" className="social-icon" />
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">{t.twitter}</a>
          </div>
          <div className="instadiv">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">{t.instagram}</a>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Buho Eat's. {t.derechosReservados}</p>
      </div>
    </footer>
  );
}

export default Footer;

