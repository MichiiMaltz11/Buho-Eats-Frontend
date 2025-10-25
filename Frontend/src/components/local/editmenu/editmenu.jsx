import React, { useState } from 'react';
import './editmenu.css';

const MenuEditModal = ({ isOpen, onClose, menu, onSave }) => {
  const [editedMenu, setEditedMenu] = useState(menu);

  const handleInputChange = (index, field, value) => {
    const updatedMenu = [...editedMenu];
    updatedMenu[index][field] = value;
    setEditedMenu(updatedMenu);
  };

  const handleSave = () => {
    onSave(editedMenu);
    onClose();
  };

  if (!isOpen) return null;

  return (<div className="modal-overlay">
    <div className="modal-container">
      <div className="menu-carde">
        <h2 className="menu-title">Editar Menú</h2>
        <div className="menu-grid">
          {editedMenu.map((plato, index) => (
            <div className="menu-item" key={index}>
              <div className="menu-info">
                <input
                  type="text"
                  value={plato.nombre}
                  onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                  placeholder="Nombre del plato"
                  className="plato-name-input"
                />
                <input
                  type="number"
                  value={plato.precio}
                  onChange={(e) => handleInputChange(index, 'precio', e.target.value)}
                  placeholder="Precio"
                  className="plato-price-input"
                />
              </div>
              <input
                type="text"
                value={plato.imagen}
                onChange={(e) => handleInputChange(index, 'imagen', e.target.value)}
                placeholder="URL de la imagen"
                className="plato-image-url"
              />
              <img src={plato.imagen} alt={plato.nombre} className="plato-image" />
            </div>
          ))}
        </div>
      </div>
      <div className="modal-buttonsmenu">
      <img src="/assets/Buho.png" alt="buhomodal" className='buhoModale' />
        <button className="btn-save" onClick={handleSave}>Confirmar</button>
        <button className="btn-cancel" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  </div>  
  );
};

export default MenuEditModal;
