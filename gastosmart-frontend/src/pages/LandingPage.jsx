// src/pages/LandingPage.jsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 👇 Si hay token, redirige sin romper el router
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

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

export default LandingPage;
