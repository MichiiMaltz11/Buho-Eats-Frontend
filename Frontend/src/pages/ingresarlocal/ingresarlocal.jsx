import React, { useState, useEffect } from "react";
import "./ingresarlocal.css";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import { FaUpload } from "react-icons/fa";
import { addPeticionLocal } from "../../apichafa"; // Asegúrate de importar tu función correctamente
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext"; 
import { translations } from "../../translate/Translations"; 

const IngresarLocal = () => {
    const { language } = useLanguage();
    const [images, setImages] = useState([]);
    const [nombre, setNombre] = useState("");
    const [tipoComida, setTipoComida] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el ID del usuario desde localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
        } else {
            alert(translations[language].loginAlert);
            navigate("/login");
        }
    }, [navigate]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nombre.trim() || !tipoComida.trim()) {
            setMessage(translations[language].errorCompleteFields);
            return;
        }

        if (images.length === 0) {
            setMessage(translations[language].errorNoImages);
            return;
        }

        if (images.length > 5) {
            setMessage(translations[language].errorTooManyImages);
            return;
        }

        try {
            // Convertir imágenes en URLs locales (simulación, ajustar según backend real)
            const imageUrls = images.map((image) => URL.createObjectURL(image));

            // Enviar los datos utilizando la función `addPeticionLocal`
            await addPeticionLocal(userId, nombre, tipoComida, imageUrls);

            alert(translations[language].successMessage);
            setNombre("");
            setTipoComida("");
            setImages([]);
        } catch (error) {
            console.error("Error al registrar el local:", error);
            alert("Error al conectar con el servidor. Intenta nuevamente.");
        }
    };

    return (
        <div className="ingresar-local-container">
            <Header showSearchBar={false} showBackArrow={true} showUserIcon={false} />
            <div className="ingresar-local-content">
                <h1>{translations[language].enterLocalTitle}</h1>
                <p>
                {translations[language].enterLocalDescription}
                </p>
                <form className="ingresar-local-form" onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="form-group">
                        <label htmlFor="nombre">{translations[language].nameLabel}</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder={translations[language].namePlaceholder}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tipo de Comida */}
                    <div className="form-group">
                        <label htmlFor="tipo-comida">{translations[language].foodTypeLabel}</label>
                        <select
                            id="tipo-comida"
                            name="tipo-comida"
                            value={tipoComida}
                            onChange={(e) => setTipoComida(e.target.value)}
                            required
                        >
                            <option value="">{translations[language].foodTypePlaceholder}</option>
                            <option value="comida-rapida">{translations[language].foodTypeOptions.fastFood}</option>
                            <option value="comidas-principales">{translations[language].foodTypeOptions.mainDishes}</option>
                            <option value="comidas-internacionales">{translations[language].foodTypeOptions.international}</option>
                            <option value="postres">{translations[language].foodTypeOptions.desserts}</option>
                        </select>
                    </div>

                    {/* Fotografías */}
                    <div className="form-group">
                        <label htmlFor="fotografias">{translations[language].photosLabel}</label>
                        <div className="custom-file-upload">
                            <input
                                type="file"
                                id="fotografias"
                                name="url"
                                accept="image/jpeg,image/png,image/jpg"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="fotografias" className="upload-label">
                                <FaUpload className="upload-icon" /> {translations[language].uploadLabel}
                            </label>
                        </div>
                        <div className="image-preview">
                            {images.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="remove-button"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {message && <p className="message-status">{message}</p>}
                    <button type="submit" className="submit-button">
                    {translations[language].submitButton}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default IngresarLocal;
    