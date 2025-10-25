import React from "react";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import "./stats.css";

const EstadisticasPage = () => {
  const estadisticas = [
    { nombre: "Calificacion Local", cantidad: 5, icons: "☆", descripcion: "Calificación promedio de los comentarios del local" },
    { nombre: "Favoritos", cantidad: 1, icons: "♡", descripcion: "Cantidad de usuarios que han marcado el local como favorito" },
    { nombre: "Vistas", cantidad: 1, icons: "👁", descripcion: "Cantidad de usuarios que han visto el local en el mes"},
    { nombre: "Reseñas", cantidad: 6, icons: "🕮", descripcion: "Cantidad de reseñas del local desde su creacion"},
  ];

  return (
    <div className="estadisticas-page-container">
      <Header showSearchBar={false} showBackArrow={true} />
      <div className="estadisticas-content">
        <h1>Estadísticas</h1>
        <table className="estadisticas-table"> 
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Icons</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((stat, index) => (
              <tr key={index}>
                <td>{stat.nombre}</td>
                <td>{stat.cantidad}</td>
                <td>{stat.icons}</td>
                <td>{stat.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default EstadisticasPage;
