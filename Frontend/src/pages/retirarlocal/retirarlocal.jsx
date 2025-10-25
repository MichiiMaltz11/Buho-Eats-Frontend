import React, { useState, useEffect } from "react";
import "./retirarlocal.css";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import { useNavigate } from "react-router-dom";

const RetirarLocal = () => {
    const [nombre, setNombre] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el ID del usuario desde localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
        } else {
            alert("No se encontró el usuario. Por favor, inicia sesión.");
            navigate("/login");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nombre.trim() || !justificacion.trim()) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }

        try {
            // Enviar los datos utilizando la función `addRetirarLocal`
            await addRetirarLocal(userId, nombre, justificacion);

            alert("Petición enviada correctamente. Está pendiente de revisión.");
            setNombre("");
            setJustificacion("");
        } catch (error) {
            console.error("Error al enviar la petición de retiro del local:", error);
            alert("Error al conectar con el servidor. Intenta nuevamente.");
        }
    };

    return (
        <div className="retirar-local-container">
            <Header showSearchBar={false} showBackArrow={true} showUserIcon={false} />
            <div className="retirar-local-content">
                <h1>¿Quieres retirar tu local de nuestra página?</h1>
                <p>
                    Lamentamos esta perdida :(, pero no te preocupes, colocal el nombre del
                    local, la razon por la que lo estas eliminando y luego nos comunicaremos
                    contigo cuando hayamos realizado la accion.                </p>
                <form className="retirar-local-form" onSubmit={handleSubmit}>
                    {/* Nombre del local */}
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del local:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Ingresa el nombre de tu local"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    {/* Justificación */}
                    <div className="form-group">
                        <label htmlFor="justificacion">Justificación:</label>
                        <textarea
                            id="justificacion"
                            name="justificacion"
                            placeholder="Explica por qué deseas retirar tu local"
                            value={justificacion}
                            onChange={(e) => setJustificacion(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {message && <p className="message-status">{message}</p>}
                    <button type="submit" className="submit-button">
                        Enviar
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default RetirarLocal;
