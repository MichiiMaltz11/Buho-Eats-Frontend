import React, { useState, useEffect } from "react";
import "./mensajes.css";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import MessageCard from "../../components/mensajecard/mensajecard"; // Asegúrate de ajustar la ruta del componente

const InboxPage = () => {
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
            // Simulación de datos para bandeja de entrada
            setMessages([
                {
                    userName: "Juan Pérez",
                    subject: "Problema con mi cuenta",
                    message: "No puedo acceder a mi cuenta desde ayer. Ayuda por favor."
                },
                {
                    userName: "Ana López",
                    subject: "Error en la plataforma",
                    message: "El sistema no me permite subir fotos en mi local."
                },
                {
                    userName: "Carlos Mendoza",
                    subject: "Solicitud de soporte",
                    message: "Tengo problemas con el pago en línea."
                },
                {
                    userName: "Paco Rios",
                    subject: "Ayuda",
                    message: "Ayudaaaaaaa! me exploto el tambo de gas"
                }
                // Agrega más mensajes según sea necesario
            ]);
        } else {
            alert("No se encontró el usuario. Por favor, inicia sesión.");
        }
    }, []);

    return (
        <div className="inbox-container">
            <Header showSearchBar={false} showBackArrow={true} showUserIcon={false} />
            <div className="inbox-content">
                <h1>Bandeja de Entrada</h1>
                <div className="messages-grid">
                    {messages.map((msg, index) => (
                        <MessageCard
                            key={index}
                            userName={msg.userName}
                            subject={msg.subject}
                            message={msg.message}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InboxPage;
