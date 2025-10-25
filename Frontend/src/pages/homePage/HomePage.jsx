import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../utils/footer/footer";
import Carousel from "../../components/carousel/carousel";
import LocalCard from "../../components/local/card/localescard";
import FilterSortMenu from "../../utils/filterysort/filterysort";
import "./HomePage.css";
import Mapa from "../../components/mapa/mapa";
import axios from "axios";


function HomePage() {
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [locales, setLocales] = useState([]);
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
  const [showAddModal, setShowAddModal] = useState(false); // Estado para mostrar/ocultar el modal

  // Cargar locales desde la API
  const fetchLocales = async () => {
    try {
      const response = await axios.get("http://localhost:5001/local");
      setLocales(response.data);
    } catch (error) {
      console.error("Error al cargar los locales desde la API:", error);
    }
  };

  // Obtener datos del usuario desde localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role); // Almacenar el rol del usuario
    }
  }, []);

  // Incrementar las visitas en el localStorage
  const incrementVisits = (localId) => {
    const visits = JSON.parse(localStorage.getItem("visitas")) || {};
    visits[localId] = (visits[localId] || 0) + 1;
    localStorage.setItem("visitas", JSON.stringify(visits));
  };

  useEffect(() => {
    fetchLocales();
  }, []);

  const filteredAndSortedLocales = locales
    .filter((local) => !filter || local.categoria === filter)
    .sort((a, b) => {
      if (sortOrder === "ascendente") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "descendente") return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  return (
    <div className="main-container">
      <Header showSearchBar={true} showBackArrow={false} />
      <div className="content">
        <Carousel
          images={locales.slice(0, 3).map((local) => local.fotos[0])}
          localNames={locales.slice(0, 3).map((local) => (
            <Link
              key={local.id}
              to={`/local/${local.id}`}
              style={{ color: "black" }}
              onClick={() => incrementVisits(local.id)}
            >
              {local.nombre}
            </Link>
          ))}
          showTitle={true}
          showNameAsTitle={false}
        />

        <FilterSortMenu onFilterChange={setFilter} onSortChange={setSortOrder} />
        <div className="locales">
          {filteredAndSortedLocales.map((local) => (
            <Link
              key={local.id}
              to={`/local/${local.id}`}
              className="card-link"
              onClick={() => incrementVisits(local.id)}
            >
              <LocalCard foto={local.fotos[0]} nombreLocal={local.nombre} />
            </Link>
          ))}
        </div>
        <Mapa locales={locales.map((local) => ({ ...local, foto: local.fotos[0] }))} />
      </div>
      {/* Botones para SuperAdmin */}
      {userRole === "SuperAdmin" && (
        <div className="superadmin-buttons">
          <button className="superadmin-button edit">
            <i className="fas fa-pencil-alt"></i>
          </button>
          <button className="superadmin-button delete">
            <i className="fas fa-trash"></i>
          </button>
          <button
            className="superadmin-button add"
            onClick={() => setShowAddModal(true)} // Mostrar modal al hacer clic
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      )}

      {/* Modal para agregar local */}
      {showAddModal && (
        <div className="add-modal-backdrop">
          <div className="add-modal-container">
            <h2>Ingresar datos</h2>
            <form>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre"
                  className="add-modal-input"
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="descripcion"
                  placeholder="Ingrese la descripción"
                  className="add-modal-textarea"
                />
              </label>
              <label>
                Administrador:
                <input
                  type="text"
                  name="administrador"
                  placeholder="Ingrese el administrador"
                  className="add-modal-input"
                />
              </label>
              <div className="add-modal-buttons">
                <button
                  type="button"
                  className="add-modal-confirm"
                  onClick={() => setShowAddModal(false)} // Lógica para confirmar
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="add-modal-cancel"
                  onClick={() => setShowAddModal(false)} // Cerrar modal
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default HomePage;
