import React from 'react';
import './localescard.css';

const Card = ({ foto, nombreLocal }) => {
  return (
    <div className="card">
      <img src={foto} alt={nombreLocal} className="card-image" />
      <div className="card-info">
        <h3>{nombreLocal}</h3>
      </div>
    </div>
  );
};

export default Card;
