// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";

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
