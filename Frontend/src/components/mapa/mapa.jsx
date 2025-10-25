import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './mapa.css';
import { useLanguage } from "../../LanguageContext";
import { translations } from "../../translate/Translations"; 

const Mapa = ({ locales }) => {
  const { language } = useLanguage();
  const centerPosition = [13.6788, -89.237816];

  return (
    <div className='map-container'>
      <p className='titulomapa'>{translations[language].mapTitle}</p>
      <div className='mapa-color'>
        <div className="map">
          <MapContainer center={centerPosition} zoom={50} style={{ height: '450px', width: '700px' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            {locales.map((local, index) => (
              <Marker key={index} position={local.coords}>
                <Popup>
                  <h3>
                    <Link to={`/local/${local.id}`} className="popup-link">
                      {local.nombre}
                    </Link>
                  </h3>
                  <p>{local.description}</p>
                  <img src={local.foto} alt={local.nombre} style={{ width: '250px', height: 'auto' }} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
