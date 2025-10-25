import React from 'react';
import './reviewcard.css';
import icon from '../../assets/icons/icon.png';

const ReviewCard = ({ usuario, texto, estrellas }) => {
  return (
    <div className="review-card">
      <div className="user-name-container">
        <span>{usuario}</span>
        <img src={icon} alt="icon" className="iconU" />
      </div>
      <p>{texto}</p>
      <div className="stars">{'★'.repeat(estrellas)}</div>
    </div>
  );
};

export default ReviewCard;
