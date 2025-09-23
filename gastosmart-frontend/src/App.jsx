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
import Presupuesto from "./pages/Presupuesto";
import Historicos from "./pages/Historicos";          // 👈 nuevo
import HistoricoDetalle from "./pages/HistoricoDetalle"; // 👈 nuevo

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

        {/* Submenú Categorías (PROTEGIDO) */}
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

        {/* Submenú Gastos (PROTEGIDO) */}
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

        {/* Presupuesto (PROTEGIDO) */}
        <Route
          path="/presupuesto"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Presupuesto />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Históricos (PROTEGIDO) */}
        <Route
          path="/historicos"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <Historicos />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Detalle Histórico (PROTEGIDO) */}
        <Route
          path="/historicos/:periodo"
          element={
            <ProtectedRoute>
              <AppLayout onLogout={handleLogout}>
                <HistoricoDetalle />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Reportes (PROTEGIDO) */}
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

        {/* Configuración (PROTEGIDO) */}
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
