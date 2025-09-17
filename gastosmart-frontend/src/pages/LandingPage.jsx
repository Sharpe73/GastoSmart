// src/pages/LandingPage.jsx
import React, { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si ya está logeado → directo al dashboard
      navigate("/dashboard", { replace: true });
    } else {
      // Si no hay token → directo al login
      navigate("/login", { replace: true });
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

export default LandingPage;
