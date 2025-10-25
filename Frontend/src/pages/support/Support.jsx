import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MuiSnackbar from '../../components/MuiSnackbar';  // Asegúrate de importar el Snackbar
import Footer from '../../utils/footer/footer';
import Header from '../../components/header/header';
import './Support.css';
import { useLanguage } from "../../LanguageContext";  // Usamos el contexto de idioma
import { translations } from '../../translate/Translations'; // Importamos las traducciones

const Support = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();  // Accedemos al idioma actual desde el contexto
    const t = translations[language];  // Obtenemos las traducciones del idioma actual

    const [activeModal, setActiveModal] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [justification, setJustification] = useState("");
    const [subject, setSubject] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);  // Estado para controlar el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState("");  // Mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Nivel de severidad (success, error)

    useEffect(() => {
        // Obtener los datos del usuario del localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserRole(user.role); // Guardar el rol del usuario
        }
    }, []);

    const openModal = (type) => setActiveModal(type);

    const closeModal = () => {
        setActiveModal(null);
        setFieldErrors({});
        setErrorMessage("");
        setJustification("");
        setEmail("");
        setSubject("");
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            closeModal();
        }
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;

        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [field]: null,
        }));

        if (errorMessage) {
            setErrorMessage("");
        }

        switch (field) {
            case "email":
                setEmail(value);
                break;
            case "name":
                setName(value);
                break;
            case "justification":
                setJustification(value);
                break;
            case "subject":
                setSubject(value);
                break;
            default:
                break;
        }
    };

    const validateFields = () => {
        const errors = {};

        if (activeModal === "reportar") {
            if (!name) errors.name = t.nameRequired;
            if (!justification) errors.justification = t.justificationRequired;
        }

        if (activeModal === "soporte") {
            if (!email) errors.email = t.emailRequired;
            else {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|uca\.edu\.sv)$/;
                if (!emailRegex.test(email)) {
                    errors.email = t.invalidEmail;
                }
            }

            if (!subject) errors.subject = t.subjectRequired;
            if (!justification) errors.justification = t.messageRequired;
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        const isValid = validateFields();

        if (!isValid) {
            setSnackbarMessage(t.completeFields);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setSnackbarMessage(t.formSubmittedSuccessfully);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Limpiar campos y errores después del envío exitoso
        setEmail("");
        setName("");
        setJustification("");
        setSubject("");
        setFieldErrors({});
        setErrorMessage("");
    };

    useEffect(() => {
        if (!activeModal) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeModal]);

    return (
        <div className="contenedorsup">
            <Header showSearchBar={false} showBackArrow={true} showUserIcon={false} />
            <div className="support-container">
                <div className="support-box">
                    <h1>{userRole === "SuperAdmin" ? t.Gestióndeusuarios : t.welcomeSupport}</h1>
                    <p>{userRole === "SuperAdmin" ? t.Quedeseashacer : t.whatDoYouNeed}</p>
                    <div className="support-options">
                        {userRole === "SuperAdmin" ? (
                            <>
                                <button onClick={() => openModal("reportar")}>
                                    Reportar un usuario
                                </button>
                                <button onClick={() => navigate("/asignarol")}>
                                    Asignar roles a un usuario
                                </button>
                                <button onClick={() => navigate("/mensajes")}>
                                    Ver mensajes de soporte de los usuarios
                                </button>
                                <button onClick={() => openModal("soporte")}>
                                    Mandar un correo a un usuario
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => openModal("funcionalidad")}>
                                    {t.helpWithFunctionality}
                                </button>
                                <button onClick={() => openModal("reportar")}>
                                    {t.reportUserOrPlace}
                                </button>
                                <button onClick={() => navigate("/ingresar-local")}>
                                    {t.howToRegisterPlace}
                                </button>
                                <button onClick={() => openModal("soporte")}>
                                    {t.sendEmailToSupport}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Modales */}
                {/* Funcionalidad */}
                {activeModal === "funcionalidad" && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="modal-content-pag1">
                            <div className="modal-header-pag1">
                                <h2>{t.helpWithPage}</h2>
                                <div className="close-icon-pag1" onClick={closeModal}></div>
                            </div>
                            <p>{t.pageHelpText}</p>
                        </div>
                    </div>
                )}

                {/* Reportar */}
                {activeModal === "reportar" && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="modal-content-pag2">
                            <div className="modal-header-pag2">
                                <h2>
                                    {userRole === "SuperAdmin"
                                        ? "Oh-oh! Parece que alguien olvidó sus modales!"
                                        : t.reportUserOrPlace}
                                </h2>
                                <div className="close-icon-pag2" onClick={closeModal}></div>
                            </div>
                            <form onSubmit={handleSubmit} className="report-form">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        {userRole === "SuperAdmin" ? "Correo:" : t.nameOfUserOrPlace}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder={
                                            userRole === "SuperAdmin"
                                                ? "Ingresa el correo del usuario"
                                                : t.enterName
                                        }
                                        value={name}
                                        onChange={(e) => handleInputChange(e, "name")}
                                    />
                                    {fieldErrors.name && <p className="error-message-s">{fieldErrors.name}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="justification">{t.justification}:</label>
                                    <textarea
                                        id="justification"
                                        name="justification"
                                        placeholder={
                                            userRole === "SuperAdmin"
                                                ? "Explica por qué estás reportando al usuario"
                                                : "Explica por qué estás reportando"
                                        }
                                        rows="4"
                                        value={justification}
                                        onChange={(e) => handleInputChange(e, "justification")}
                                    ></textarea>
                                    {fieldErrors.justification && (
                                        <p className="error-message-s">{fieldErrors.justification}</p>
                                    )}
                                </div>
                                <button type="submit" className="red-button">
                                    {t.submit}
                                </button>
                                {errorMessage && <p className="error-message-s">{errorMessage}</p>}
                                <p className="nota">
                                    {userRole === "SuperAdmin"
                                        ? "NOTA: Recuerda que si no das una justificación válida, el ticket puede ser para ti!"
                                        : "NOTA: Una vez enviada la información, investigaremos a la persona o el local y nos comunicaremos contigo."}
                                </p>
                            </form>
                        </div>
                    </div>
                )}

                {/* Soporte */}
                {activeModal === "soporte" && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="modal-content-pag3">
                            <div className="modal-header-pag3">
                                <h2>
                                    {userRole === "SuperAdmin" ? "Correo de soporte" : t.sendEmailToSupport}
                                </h2>
                                <div className="close-icon-pag3" onClick={closeModal}></div>
                            </div>
                            <form onSubmit={handleSubmit} className="report-form">
                                <div className="form-group">
                                    <label htmlFor="email">{t.email}:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder={
                                            userRole === "SuperAdmin"
                                                ? "Ingrese el correo del usuario"
                                                : t.enterEmail
                                        }
                                        value={email}
                                        onChange={(e) => handleInputChange(e, "email")}
                                    />
                                    {fieldErrors.email && (
                                        <p className="error-message-s">{fieldErrors.email}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">{t.subject}:</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder={
                                            userRole === "SuperAdmin"
                                                ? "Escriba el asunto del correo"
                                                : t.enterSubject
                                        }
                                        value={subject}
                                        onChange={(e) => handleInputChange(e, "subject")}
                                    />
                                    {fieldErrors.subject && (
                                        <p className="error-message-s">{fieldErrors.subject}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="justification">{t.message}:</label>
                                    <textarea
                                        id="justification"
                                        name="justification"
                                        placeholder={
                                            userRole === "SuperAdmin"
                                                ? "Escriba el mensaje del correo"
                                                : t.enterMessage
                                        }
                                        rows="4"
                                        value={justification}
                                        onChange={(e) => handleInputChange(e, "justification")}
                                    ></textarea>
                                    {fieldErrors.justification && (
                                        <p className="error-message-s">{fieldErrors.justification}</p>
                                    )}
                                </div>
                                <button type="submit" className="red-button">
                                    {t.submit}
                                </button>
                                {errorMessage && <p className="error-message-s">{errorMessage}</p>}
                            </form>
                        </div>
                    </div>
                )}

                <MuiSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={() => setSnackbarOpen(false)}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Support;
