import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import FilterSortMenu from "../../utils/filterysort/filterysort";
import LocalCard from "../../components/local/card/localescard";
import axios from "axios";
import "./favoritos.css";
import { useLanguage } from "../../LanguageContext"; 
import { translations } from "../../translate/Translations"; 

const Favoritos = () => {
  const { language } = useLanguage();
  const [locales, setLocales] = useState([]); // Todos los locales
  const [favoritos, setFavoritos] = useState([]); // Locales favoritos filtrados
  const [resenas, setResenas] = useState([]); // Reseñas del usuario
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  // Cargar locales, favoritos y reseñas del usuario
  const fetchLocalesAndUser = async () => {
    try {
      // Obtener usuario desde localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return; // Si no hay usuario, no cargar favoritos y reseñas

      const user = JSON.parse(storedUser);
      const responseLocales = await axios.get("http://localhost:5001/local"); // Carga todos los locales
      const userFavorites = user.favoritos || []; // IDs de favoritos del usuario

      // Llamada para obtener las reseñas del usuario
      const responseResenas = await axios.get(`http://localhost:5001/review/user/${user.id}`);
      
      // Filtra los locales favoritos
      const filteredFavorites = responseLocales.data.filter((local) =>
        userFavorites.includes(local.id)
      );

      setLocales(responseLocales.data); // Almacena todos los locales (por si se necesitan)
      setFavoritos(filteredFavorites); // Solo los favoritos del usuario
      setResenas(responseResenas.data); // Establece las reseñas del usuario
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    fetchLocalesAndUser();
  }, []);

  // Filtrar y ordenar favoritos
  const filteredAndSortedFavoritos = favoritos
    .filter((favorito) => !filter || favorito.categoria === filter)
    .sort((a, b) => {
      if (sortOrder === "ascendente") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "descendente") return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  return (
    <>
      <Header showSearchBar={false} showBackArrow={true} />
      <div className="favoritos-container">
        <h1 className="favoritos-title">{translations[language].favoritesTitle}</h1>

        <div className="favoritos-filter">
          {/* Filtro y ordenamiento */}
          <FilterSortMenu onFilterChange={setFilter} onSortChange={setSortOrder} />
        </div>

        {/* Tarjetas de locales favoritos */}
        <div className="locales">
          {filteredAndSortedFavoritos.length > 0 ? (
            filteredAndSortedFavoritos.map((local) => (
              <Link key={local.id} to={`/local/${local.id}`} className="card-link">
                <LocalCard foto={local.fotos[0]} nombreLocal={local.nombre} />
              </Link>
            ))
          ) : (
            <p className="no-favoritos">{translations[language].noFavorites}</p>
          )}
        </div>

        {/* Mis Reseñas */}
        <h2 className="favoritos-title">Mis Reseñas</h2>

        <div className="resenas">
          {resenas.length > 0 ? (
            resenas.map((resena, index) => (
              <div key={index} className="resena-card">
                <h3>{resena.nombreLocal}</h3>
                <p><strong>Calificación:</strong> {resena.stars} ⭐</p>
                <p><strong>Comentario:</strong> {resena.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-resenas">Aún no has dejado reseñas.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Favoritos;
