import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MuiSnackbar from '../../components/MuiSnackbar';  // Importamos el Snackbar
import Footer from '../../utils/footer/footer';
import Header from '../../components/header/header';
import BuhoImage from "../../assets/icons/Logo.png";  // Importamos la imagen
import './Profile.css';  // Asegúrate de tener los estilos correctos
import { updateUserProfile } from "../../apichafa";
import { useLanguage } from "../../LanguageContext"; // Importamos el contexto de idioma
import { translations } from "../../translate/Translations"; // Importamos las traducciones

const EditProfile = () => {
    const { language } = useLanguage(); // Obtén el idioma actual
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);  // Estado para controlar el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState("");  // Mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Nivel de severidad (success, error)
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setName(storedUser.name);
        }
    }, []);

    const validateFields = () => {
        const errors = {};

        // Validar nombre
        if (!name) {
            errors.name = translations[language].errorNameRequired;
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
            errors.name = translations[language].errorNameInvalid;
        } else if (name.trim().length < 3) {
            errors.name = translations[language].errorNameLength;
        }

        // Validar contraseñas
        if (password && password.length < 6) {
            errors.password = translations[language].errorPasswordLength;
        }
        if (password && password !== confirmPassword) {
            errors.confirmPassword = translations[language].errorPasswordsDoNotMatch;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file));  // Muestra una vista previa de la imagen seleccionada
        }
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        const updatedUser = {
            ...user,
            name,
            password: password || user?.password,  // Si no se cambia la contraseña, se mantiene la anterior
        };

        try {
            if (!user || !user.id) {
                throw new Error("El ID del usuario no está disponible.");
            }

            const response = await updateUserProfile(user.id, formData);  // Enviar los datos al backend
            localStorage.setItem('user', JSON.stringify(response));
            setSnackbarMessage(translations[language].successMessage);

            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setSnackbarMessage(translations[language].errorUpdateProfile);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div className='mainpage'>
            <Header showSearchBar={false} showBackArrow={false} showUserIcon={false} />
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className='edittext'>
                        <h2>{translations[language].editProfileTitle}</h2>
                        <img src={BuhoImage} alt="buhoprof" className='buhoProfile' /> {/* Imagen cargada con import */}
                    </div>
                    <div className="user">
                        <img src="\src\assets\icons\icon.png" alt="User" />
                    </div>
                    <div className="form-field">
                        <label htmlFor="name">{translations[language].nameLabel}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={translations[language].namePlaceholder}
                            className={fieldErrors.name ? "error" : ""}
                        />
                        {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">{translations[language].passwordLabel}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={translations[language].passwordPlaceholder}
                            className={fieldErrors.password ? "error" : ""}
                        />
                        {fieldErrors.password && (
                            <p className="error-message">{fieldErrors.password}</p>
                        )}
                    </div>
                    <div className="form-field">
                        <label htmlFor="confirm-password">{translations[language].confirmPasswordLabel}</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={translations[language].confirmPasswordPlaceholder}
                            className={fieldErrors.confirmPassword ? "error" : ""}
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="error-message">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSave}>{translations[language].saveButton}</button>
                        <button onClick={() => navigate('/')}>{translations[language].cancelButton}</button>
                    </div>
                </div>
            </div>

            {/* Snackbar de perfil */}
            <MuiSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarSeverity}
                type="profile"  // Aquí aplicamos el estilo específico para el perfil
            />

            <Footer />
        </div>
    );
};

export default EditProfile;



