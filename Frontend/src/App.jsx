import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import HomePage from './pages/homePage/HomePage';
import LocalPage from './pages/localPage/LocalPage';
import ReviewsPage from './pages/reviews/Reviews';
import Profile from './pages/profile/Profile';
import Support from './pages/support/Support';
import IngresarLocal from './pages/ingresarlocal/ingresarlocal';
import Favoritos from './pages/favoritos/favoritos';
import { LanguageProvider } from "./LanguageContext";
import Estadisticas from './pages/stats/stats';//agregado 
import RetirarLocal from './pages/retirarlocal/retirarlocal';
import AsignarRoles from './pages/asignarol/asignarol';
import Mensajes from './pages/mensajes/mensajes';

function App() {  
  return (
    <LanguageProvider>
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login/>} /> 
        <Route path="/Register" element={<Register/>} /> 
        <Route path="/local/:id" element={<LocalPage />} />
        <Route path="/local/:id/reviews" element={<ReviewsPage />} />
        <Route path="/profile" element={<Profile/> } />
        <Route path="/support" element={<Support/>} />
        <Route path="/ingresar-local" element={<IngresarLocal/>} />
        <Route path="/favorites" element={<Favoritos/>} />
        <Route path="/estadisticas" element={<Estadisticas/>} />
        <Route path="/retirarlocal" element={<RetirarLocal/>} />
        <Route path="/asignarol" element={<AsignarRoles/>} />
        <Route path="/mensajes" element={<Mensajes/>} />
      </Routes>
    </Router>
    </LanguageProvider>

  );
}

export default App; 
