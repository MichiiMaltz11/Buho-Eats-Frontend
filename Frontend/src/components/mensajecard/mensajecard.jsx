import React, { useState } from "react";
import "./mensajecard.css";

const MessageCard = ({ userName, subject, message }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [response, setResponse] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleResponseSubmit = (e) => {
        e.preventDefault();
        alert(`Respuesta enviada: ${response}`);
        setResponse("");
        closeModal();
    };

    return (
        <div>
            {/* Tarjeta del mensaje */}
            <div className="message-card" onClick={openModal}>
                <div className="card-header">
                    <p>{userName}</p>
                </div>
                <div className="card-body">
                    <p>{subject}</p>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-content-pag3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Encabezado del modal */}
                        <div className="modal-header-pag3">
                            <h2 className="titulonegro">{subject}</h2>
                            <div
                                className="close-icon-pag3"
                                onClick={closeModal}
                            ></div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="modal-body">
                            <div className="user-div">
                                <img
                                    src="/src/assets/icons/icon.png"
                                    alt="Perfil"
                                    className="profile-icon"
                                />
                                <h4>{userName}</h4> {/* Nombre del usuario */}
                            </div>

                            <p>{message}</p>
                            <form
                                onSubmit={handleResponseSubmit}
                                className="report-form"
                            >
                                <div className="form-group">
                                    <label htmlFor="response">Responder:</label>
                                    <textarea
                                        id="response"
                                        rows="4"
                                        placeholder="De una solucion al usuario"
                                        value={response}
                                        onChange={(e) =>
                                            setResponse(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="green-button"
                                >
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageCard;
