import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import flecha from '../../assets/buttons/arrow.png';
import logo from '../../assets/icons/Logo.png';
import logito from '../../assets/buttons/google.png';
import './Login.css';
import Footer from '../../utils/footer/footer';
import Header from '../../components/header/header';
import MuiSnackbar from '../../components/MuiSnackbar';  // Asegúrate de importar el Snackbar
import { useLanguage } from "../../LanguageContext"; // Importa el contexto de idioma
import { translations } from "../../translate/Translations"; // Importa las traducciones

const Login = () => {
  const { language } = useLanguage(); // Obtén el idioma actual
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // Estado para controlar el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");  // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Nivel de severidad (success, error)

  // Validar campos del formulario
  const validateFields = () => {
    const errors = {};

    // Validar correo
    if (!email) {
      errors.email = translations[language].errorEmailRequired;
    } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|uca\.edu\.sv)$/.test(email)) {
      errors.email = translations[language].errorEmailInvalid;
    }

    // Validar contraseña
    if (!password) {
      errors.password = translations[language].errorPasswordRequired;
    } else if (password.length < 6) {
      errors.password = translations[language].errorPasswordLength;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejo del inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    const isValid = validateFields();

    if (!isValid) {
      setSnackbarMessage(translations[language].errorFieldsRequired);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage(translations[language].successMessage);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Limpiar campos después del envío exitoso
    setEmail("");
    setPassword("");

    try {
      const response = await axios.get("http://localhost:5001/users");
      const users = response.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        setSnackbarMessage(translations[language].errorIncorrectCredentials);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error(err);
      setSnackbarMessage(translations[language].errorServer);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Navegar atrás
  const handleBackArrowClick = () => {
    navigate("/");
  };

  return (
    <div className="main-container">
      <Header showSearchBar={false} showBackArrow={false} showUserIcon={false} />
      <div className="container-login">
        <div className="login-card">
          <div className="header-login">
            <img
              src={flecha}
              alt="Retroceder"
              className="cursor-pointer"
              onClick={handleBackArrowClick}
            />
            <h2 className="h2-login">
              {translations[language].loginTitle}
            </h2>
            <img className="Buho" src={logo} alt="Logo" />
          </div>

          <form onSubmit={handleLogin}>
            {/* Campo de correo */}
            <div className="form-group">
              <label>{translations[language].emailLabel}</label>
              <input
                type="email"
                placeholder={translations[language].emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldErrors.email ? "error" : ""}
              />
              {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
            </div>

            {/* Campo de contraseña */}
            <div className="form-group">
              <label>{translations[language].passwordLabel}</label>
              <input
                type="password"
                placeholder={translations[language].passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldErrors.password ? "error" : ""}
              />
              {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
            </div>

            <div className="button-content">
              <button type="submit" className="primary">
                {translations[language].submitButton}
              </button>
              <button type="button" className="secondary">
                <img src={logito} alt="Google icon" />
                {translations[language].googleButton}
              </button>
              <p className="register-link">
                {translations[language].registerLink}{" "}
                <Link to="/register" className="register-link">
                  {translations[language].register}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      {/* Snackbar */}
      <MuiSnackbar 
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
};

export default Login;

