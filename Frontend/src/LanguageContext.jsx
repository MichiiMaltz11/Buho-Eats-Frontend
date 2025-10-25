// src/LanguageContext.jsx
import React, { createContext, useState, useContext } from "react";

// Crear el contexto
export const LanguageContext = createContext();

// Componente proveedor del contexto
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es"); // Idioma inicial es español

  // Función para cambiar el idioma
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook para usar el contexto de lenguaje
export const useLanguage = () => useContext(LanguageContext);








