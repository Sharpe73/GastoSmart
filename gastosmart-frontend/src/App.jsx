// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import AppLayout from "./components/AppLayout";

// Páginas
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Gastos from "./pages/Gastos";
import Reportes from "./pages/Reportes";
import Config from "./pages/Config";
import Login from "./pages/Login";       
import Register from "./pages/Register"; 

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom color="primary">
        GastoSmart
      </Typography>
      <Typography variant="h6" gutterBottom>
        Bienvenido a tu gestor de gastos personales
      </Typography>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </Button>
      </Box>
    </Container>
  );
}

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
