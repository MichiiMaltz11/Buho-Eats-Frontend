// src/components/Slider.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext"; // Importar el contexto
import { translations } from "../../translate/Translations"; // Asegúrate de que apunte correctamente
import flecha from "../../../src/assets/buttons/arrow.png";
import logo from "../../assets/icons/Logo.png";
import logob from "../../assets/icons/LogoB.png";
import "./Slider.css";

function Slider({ isOpen, toggleSlider }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado del modal
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage(); // Obtener el idioma desde el contexto

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value); // Cambia el idioma
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    toggleSlider();
    toggleLogoutModal();
    navigate("/");
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  return (
    <>
      <div
        className={`slider-backdrop ${isOpen ? "open" : ""}`}
        onClick={toggleSlider}
      ></div>

      <div
        className={`slider ${isOpen ? "open" : ""} ${
          isDarkTheme ? "dark-theme" : ""
        }`}
      >
        <div className="slider-header">
          <img
            src={flecha}
            alt={translations[language].arrow} // Traducido
            className="slider-flecha"
            onClick={toggleSlider}
          />
          <div className="slider-logos">
            <img src={logo} alt={translations[language].logo} className="slider-logo" />
            <img src={logob} alt={translations[language].logoB} className="slider-logo" />
          </div>
        </div>

        <div className="slider-content">
          {userData ? (
            <>
              <Link to={`/profile`} className="profile-link">
                <button className="slider-button edit-profile-button">
                  {translations[language].editProfile}
                </button>
              </Link>

              {userData.role === "Cliente" ? (
                <Link to={`/favorites`} className="favorites-link">
                  <button className="slider-button favorites-button">
                    {translations[language].viewFavorites}
                  </button>
                </Link>
              ) : userData.role === "AdminLocal" ? (
                <Link to={`/estadisticas`} className="stats-link">
                  <button className="slider-button stats-button">
                    {translations[language].viewStats} {/* Traducido */}
                  </button>
                </Link>
              ) : userData.role === "SuperAdmin" ? (
                // Solo para SuperAdmin: botón de gestionar en lugar de soporte
                <Link to={`/support`} className="manage-link">
                  <button className="slider-button manage-button">
                    Gestionar
                  </button>
                </Link>
              ) : null}
              <div className="extra-buttons">
                <button
                  onClick={toggleLogoutModal} // Mostrar el modal
                  className="slider-button logout-button"
                >
                  {translations[language].logout}
                </button>
                <Link to={`/support`} className="profile-link">
                  <button className="slider-button support-button">
                    {translations[language].support}
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link to={`/login`} className="login-link">
                <button className="slider-button login-button">
                  {translations[language].login}
                </button>
              </Link>
              <Link to={`/register`} className="register-link">
                <button className="slider-button register-button">
                  {translations[language].register}
                </button>
              </Link>
            </>
          )}

          <div className="theme-switch">
            <label className="switch-label">{translations[language].theme}:</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={isDarkTheme}
                onChange={handleThemeChange}
              />
              <span className="slider-round"></span>
            </label>
          </div>

          <div className="language-selector">
            <label htmlFor="language-select" className="select-label">
              {translations[language].language}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              className="language-select"
            >
              <option value="es">{translations[language].spanish}</option> {/* Traducido */}
              <option value="en">{translations[language].english}</option> {/* Traducido */}
            </select>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="modal-contentout">
            <h3>{translations[language].confirmLogout}</h3> {/* Traducido */}
            <div className="modal-buttons">
              <button
                className="modal-button confirm"
                onClick={handleLogout} // Confirmar cierre de sesión
              >
                {translations[language].yes}
              </button>
              <button
                className="modal-button cancel"
                onClick={toggleLogoutModal} // Cerrar el modal
              >
                {translations[language].no}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Slider;

