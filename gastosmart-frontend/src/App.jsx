// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Gastos from "./pages/Gastos";
import Reportes from "./pages/Reportes";
import Config from "./pages/Config";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // 👈 mejor mandar al login, no a "/"
  };

  return (
    <Router>
      <Routes>
        {/* Landing page sin layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Login y Register sin sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard con Sidebar (PROTEGIDO) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Submenú Categorías */}
        <Route
          path="/categorias/gestionar"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Categorias />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Submenú Gastos */}
        <Route
          path="/gastos/gestionar"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Gastos />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Reportes />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Configuración */}
        <Route
          path="/config"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Config />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
