import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../utils/footer/footer';
import ReviewCard from '../../components/review/reviewcard';
import './Reviews.css';
import axios from 'axios';
import { addReviewToLocal } from "../../apichafa"; // Importa la función que agregará la reseña
import { useLanguage } from "../../LanguageContext"; // Importar el hook para obtener las traducciones
import { translations } from '../../translate/Translations'; // Importar las traducciones

const ReviewsPage = () => {
  const { id } = useParams();
  const { language } = useLanguage(); // Usar el contexto de lenguaje
  const [reseñas, setReseñas] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Estado para almacenar el usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newStars, setNewStars] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsUserLoggedIn(true);
      setUser(storedUser); // Guardar el usuario logueado
    }

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/local/${id}`);
        const local = response.data;
        if (local) setReseñas(local.reseñas);
      } catch (error) {
        console.error('Error al cargar las reseñas desde la API:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddComment = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleSaveComment = async () => {
    if (!newComment || newStars <= 0 || newStars > 5) {
      alert(translations[language].reviews.errorMessage);
      return;
    }

    const newReview = {
      usuario: user.name, // Usar el nombre del usuario logueado
      texto: newComment,
      estrellas: newStars,
    };

    try {
      await addReviewToLocal(id, newReview);
      setReseñas([...reseñas, newReview]);
      setIsModalOpen(false); 
      setNewComment('');
      setNewStars(0); 
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
    }
  };

  const handleStarClick = (index) => {
    if (newStars === index + 1) {
      setNewStars(0); // Desmarcar si clickea de nuevo
    } else {
      setNewStars(index + 1); // Actualizar el número de estrellas
    }
  };

  return (
    <div className="reviews-page-container">
      <Header showSearchBar={false} showBackArrow={true} />
      <div className="reviews-content">
        <h1>{translations[language].reviews.title}</h1>
        {reseñas.length > 0 ? (
          <div className="reviews-list">
            {reseñas.map((reseña, index) => (
              <ReviewCard
                key={index}
                usuario={reseña.usuario}
                texto={reseña.texto}
                estrellas={reseña.estrellas}
                className="review-card"
              />
            ))}
          </div>
        ) : (
          <p>{translations[language].reviews.noReviews}</p>
        )}
        
        {/* Mostrar el botón de agregar comentario solo si el usuario está logueado y es cliente */}
        {isUserLoggedIn && user?.role === 'Cliente' && (
          <div className="add-comment-container">
            <button className="add-comment-button" onClick={handleAddComment}>
              {translations[language].reviews.addReview}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{translations[language].reviews.addReview}</h2>
            <div className="star-rating">
              <span>{translations[language].reviews.rating}</span>
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`star ${index < newStars ? 'filled-star' : 'empty-star'}`}
                  onClick={() => handleStarClick(index)}
                >
                  ★
                </i>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={translations[language].reviews.writeComment}
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSaveComment} className='guardarBtn'>{translations[language].reviews.saveButton}</button>
              <button onClick={() => setIsModalOpen(false)}>{translations[language].reviews.cancelButton}</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReviewsPage;
