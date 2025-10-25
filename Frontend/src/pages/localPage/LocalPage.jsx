import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../utils/footer/footer';
import LocalCarousel from '../../components/carousel/carousel';
import LocalInformacion from '../../components/local/informacion/Localinformacion';
import MenuCard from '../../components/local/menu/menu';
import './LocalPage.css';
import axios from 'axios';
import { PiHeartStraightFill } from "react-icons/pi";
import MenuEdit from '../../components/local/editmenu/editmenu'; // Importa el modal

const LocalPage = () => {
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Estado para el corazón
  const [user, setUser] = useState(null); // Estado para manejar la sesión del usuario
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal


  // Obtener usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Si está logueado, guarda el usuario
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Obtener los datos del local y verificar si es favorito
  const fetchLocalData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/local/${id}`);
      setLocal(response.data);
    } catch (error) {
      console.error('Error al cargar los datos del local desde la API:', error);
    }
  };

  useEffect(() => {
    fetchLocalData(); // Cargar datos del local cuando se carga la página
  }, [id]); // Solo cuando cambia el ID del local

  useEffect(() => {
    if (user && local) {
      // Verificar si el local está en los favoritos del usuario
      if (user.favoritos && user.favoritos.includes(id)) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [user, local]); // Ejecuta cuando el usuario o el local cambian

  const toggleFavorite = async () => {
    if (!user) return; // Si no hay usuario logueado, no hacer nada

    try {
      // Si el local ya es favorito, lo eliminamos, sino lo agregamos
      let updatedFavorites = isFavorite
        ? user.favoritos.filter(favId => favId !== id) // Eliminar de favoritos
        : [...user.favoritos, id]; // Agregar a favoritos

      // Actualizar la lista de favoritos en la API
      await axios.put(`http://localhost:5001/users/${user.id}`, {
        ...user,
        favoritos: updatedFavorites,
      });

      // Actualizar el estado local
      const updatedUser = { ...user, favoritos: updatedFavorites };
      setIsFavorite(!isFavorite);
      setUser(updatedUser); // Actualiza el estado del usuario

      // Sincronizar con localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Opcional: Recargar datos del usuario desde la API para garantizar consistencia
      const refreshedUser = await axios.get(`http://localhost:5001/users/${user.id}`);
      setUser(refreshedUser.data);
      localStorage.setItem('user', JSON.stringify(refreshedUser.data));

    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveMenu = (updatedMenu) => {
    setLocal((prevLocal) => ({ ...prevLocal, platos: updatedMenu }));
    // Aquí puedes agregar una llamada a la API para guardar los cambios
    console.log('Nuevo menú guardado:', updatedMenu);
  };


  if (!local) {
    return <div>Local no encontrado</div>;
  }

  return (
    <div className="main-container">
      <Header showSearchBar={false} showBackArrow={true} />
      <div className="content">
        <div className="carousel-container">
          <LocalCarousel
            images={local.fotos}
            localNames={Array(local.fotos.length).fill(local.nombre)}
            showTitle={false}
            showNameAsTitle={true}
          />
        </div>
        {/* Mostrar el botón de favoritos solo si el usuario es cliente */}
        {user && user.role === 'Cliente' && (
          <button className="favorite-button" onClick={toggleFavorite}>
            <PiHeartStraightFill className={isFavorite ? 'heart-icon favorite' : 'heart-icon'} />
          </button>
        )}
        <LocalInformacion local={local} />
        <MenuCard menu={local.platos} />
        <div>
          {user && user.role === 'AdminLocal' && (
            <>
              <button className="edit-menu-button" onClick={handleOpenModal}>.</button>
              <MenuEdit
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                menu={local.platos}
                onSave={handleSaveMenu}
              />
            </>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocalPage;
