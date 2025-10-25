import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/userContext";

const protectedRoute = ({ children, requiredRole }) => {
  const { user } = useUser();

  // Si no está autenticado, redirige al login
  if (!user) return <Navigate to="/login" replace />;

  // Si hay un rol requerido y no coincide, redirige a la homepage
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las verificaciones, renderiza el componente
  return children;
};

export default protectedRoute;
