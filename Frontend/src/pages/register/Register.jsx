import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import flecha from '../../assets/buttons/arrow.png';
import logo from '../../assets/icons/Logo.png';
import logito from '../../assets/buttons/google.png';
import './Register.css';
import Footer from '../../utils/footer/footer';
import Header from '../../components/header/header';
import MuiSnackbar from '../../components/MuiSnackbar'; 
import { registerUser } from "../../apichafa"; 
import { useLanguage } from "../../LanguageContext";  // Usamos el contexto de idioma
import { translations } from '../../translate/Translations'; // Importamos las traducciones

const Register = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();  // Accedemos al idioma actual desde el contexto
  const t = translations[language];  // Obtenemos las traducciones del idioma actual

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 

  // Validación de los campos
  const validateFields = () => {
    const errors = {};
    // Validación de nombre
    if (!name) {
      errors.name = t.nameRequired;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
      errors.name = t.nameLettersOnly;
    } else if (name.trim().length < 3) {
      errors.name = t.nameMinLength;
    }

    // Validación de correo
    if (!email) {
      errors.email = t.emailRequired;
    } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|uca\.edu\.sv)$/.test(email)) {
      errors.email = t.invalidEmail;
    }

    // Validación de contraseña
    if (!password) {
      errors.password = t.passwordRequired;
    } else if (password.length < 6) {
      errors.password = t.passwordMinLength;
    }

    // Validación de confirmación de contraseña
    if (!confpassword) {
      errors.confpassword = t.confirmPasswordRequired;
    } else if (confpassword !== password) {
      errors.confpassword = t.passwordMismatch;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejo del registro
  const handleRegister = async (e) => {
    e.preventDefault();
    const isValid = validateFields();

    if (!isValid) {
      setSnackbarMessage(t.errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage(t.successMessage);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Limpiar campos después del registro exitoso
    setName("");
    setEmail("");
    setPassword("");
    setConfPassword("");
    try {
      const newUser = { name, email, password, role: "Cliente", favoritos: [] };
      await registerUser(newUser);

      setSnackbarMessage(t.registrationSuccess);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(t.registrationError);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Función para manejar el clic en el botón de retroceso
  const handleBackArrowClick = () => {
    navigate("/");
  };

  // Función para manejar el cambio de valor en los campos
  const handleFieldChange = (field, value) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? "" : prevErrors[field],
    }));

    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confpassword") setConfPassword(value);
  };

  return (
    <div className="main-container">
      <Header showSearchBar={false} showBackArrow={false} showUserIcon={false} />
      <div className="container_register">
        <div className="Register-card">
          <div className="header-Register">
            <img
              src={flecha}
              alt="Retroceder"
              className="cursor-pointer"
              onClick={handleBackArrowClick}
            />
            <h2 className="h2-Register">
              {t.title}
            </h2>
            <img className="Buho" src={logo} alt="Logo" />
          </div>

          <form onSubmit={handleRegister}>
            {/* Campo de nombre */}
            <div className="form-register-group">
              <label>{t.name}:</label>
              <input
                type="name"
                placeholder={t.name}
                value={name}
                onChange={(e) => handleFieldChange("name", e.target.value)} 
                className={fieldErrors.name ? "error" : ""}
              />
              {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}
            </div>

            {/* Campo de correo */}
            <div className="form-register-group">
              <label>{t.email}:</label>
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)} 
                className={fieldErrors.email ? "error" : ""}
              />
              {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
            </div>

            {/* Campo de contraseña */}
            <div className="form-register-group">
              <label>{t.password}:</label>
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => handleFieldChange("password", e.target.value)} 
                className={fieldErrors.password ? "error" : ""}
              />
              {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
            </div>

            {/* Campo de confirmar contraseña */}
            <div className="form-register-group">
              <label>{t.confirmPassword}:</label>
              <input
                type="password"
                placeholder={t.confirmPassword}
                value={confpassword}
                onChange={(e) => handleFieldChange("confpassword", e.target.value)} 
                className={fieldErrors.confpassword ? "error" : ""}
              />
              {fieldErrors.confpassword && <p className="error-message">{fieldErrors.confpassword}</p>}
            </div>

            <div className="button-content">
              <button type="submit" className="primary">{t.submit}</button>
              <button type="button" className="secondary">
                <img src={logito} alt="Google icon" />
                {t.googleRegister}
              </button>
              <p className="register-link">
                {t.alreadyHaveAccount}{" "}
                <Link to="/login" className="register-link">
                  {t.login}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <MuiSnackbar 
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
};

export default Register;
