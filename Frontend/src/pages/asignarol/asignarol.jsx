import React, { useState, useEffect } from "react";
import "./asignarol.css";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import { useNavigate } from "react-router-dom";

const AsignarRoles = () => {
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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

        if (!correo.trim() || !rol.trim()) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }

        try {
            await assignRole(userId, correo, rol); // Asegúrate de ajustar los parámetros de la API
            alert("Rol asignado correctamente.");
            setCorreo("");
            setRol("");
        } catch (error) {
            console.error("Error al asignar el rol:", error);
            alert("Error al conectar con el servidor. Intenta nuevamente.");
        }
    };

    return (
        <div className="asignar-roles-container">
            <Header showSearchBar={false} showBackArrow={true} showUserIcon={false} />
            <div className="asignar-roles-content">
                <h1>Asignar Roles</h1>
                <form className="asignar-roles-form" onSubmit={handleSubmit}>
                    {/* Campo de correo */}
                    <div className="form-groupo">
                        <label htmlFor="correo">Correo:</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            placeholder="Ingresa el correo del usuario"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    {/* Selector de roles */}
                    <div className="form-groupo">
                        <label htmlFor="rol">Tipo de Rol:</label>
                        <select
                            id="rol"
                            name="rol"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecciona un rol
                            </option>
                            <option value="super-administrador">Super Administrador</option>
                            <option value="administrador-local">Administrador del Local</option>
                            <option value="usuario">Usuario</option>
                        </select>
                    </div>

                    {message && <p className="message-status">{message}</p>}
                    <button type="submit" className="submit-button">
                        Asignar 
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default AsignarRoles;
