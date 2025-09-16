import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Si no hay token → manda al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → renderiza el componente hijo (Dashboard, etc.)
  return children;
}

export default ProtectedRoute;
