import React, { useState } from 'react';
import './filterysort.css';
import { translations } from '../../translate/Translations'; // Importamos las traducciones
import { useLanguage } from "../../LanguageContext";  // Usamos el contexto de idioma

const Filterysort = ({ onFilterChange, onSortChange }) => {
  const { language } = useLanguage();  // Accedemos al idioma actual desde el contexto
  const t = translations[language];  // Obtenemos las traducciones del idioma actual

  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="filter-sort-container">
      <div className="filter">
        <label htmlFor="filter">{t.filterBy}:</label>
        <select id="filter" onChange={handleFilterChange}>
          <option value="">{t.all}</option>
          <option value="desayunos">{t.breakfasts}</option>
          <option value="almuerzos">{t.lunches}</option>
          <option value="comida china">{t.chineseFood}</option>
        </select>
      </div>

      <div className="sort">
        <label htmlFor="sort">{t.sortBy}:</label>
        <select id="sortsel" onChange={handleSortChange}>
          <option value="default">{t.default}</option>
          <option value="ascendente">{t.ascending}</option>
          <option value="descendente">{t.descending}</option>
        </select>
      </div>
    </div>
  );
};

export default Filterysort;
