// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";

// Páginas
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Categorias from "./pages/Categorias.jsx";
import Gastos from "./pages/Gastos.jsx";
import Reportes from "./pages/Reportes.jsx";
import Config from "./pages/Config.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        {/* Landing page sin layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Login y Register sin sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard con Sidebar */}
        <Route
          path="/dashboard"
          element={
            <AppLayout onLogout={handleLogout}>
              <Dashboard />
            </AppLayout>
          }
        />

        {/* Submenú Categorías */}
        <Route
          path="/categorias/gestionar"
          element={
            <AppLayout onLogout={handleLogout}>
              <Categorias />
            </AppLayout>
          }
        />

        {/* Submenú Gastos */}
        <Route
          path="/gastos/gestionar"
          element={
            <AppLayout onLogout={handleLogout}>
              <Gastos />
            </AppLayout>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes"
          element={
            <AppLayout onLogout={handleLogout}>
              <Reportes />
            </AppLayout>
          }
        />

        {/* Configuración */}
        <Route
          path="/config"
          element={
            <AppLayout onLogout={handleLogout}>
              <Config />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
