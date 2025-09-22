// src/pages/LandingPage.jsx
import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { Login, PersonAdd } from "@mui/icons-material";

function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 👇 Si hay token, redirige al dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #90caf9 0%, #e3f2fd 100%)",
      }}
    >
      {/* Fondo decorativo con ondas */}
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url("data:image/svg+xml;utf8,
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
              <path fill='%23ffffff22' fill-opacity='1' d='M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,192C840,192,960,160,1080,149.3C1200,139,1320,149,1380,154.7L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'></path>
            </svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          opacity: 0.3,
        }}
      />

      {/* Íconos decorativos financieros */}
      <Typography
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          fontSize: "3rem",
          opacity: 0.15,
        }}
      >
        💳
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          fontSize: "3.5rem",
          opacity: 0.15,
        }}
      >
        📊
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "20%",
          fontSize: "3rem",
          opacity: 0.15,
        }}
      >
        💵
      </Typography>

      {/* Tarjeta central */}
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: 6,
          borderRadius: 4,
          textAlign: "center",
          p: 3,
          zIndex: 2, // 👈 para que quede sobre el fondo
        }}
      >
        <CardContent>
          <Typography variant="h3" color="primary" gutterBottom>
            GastoSmart
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            💰 Controla tus gastos y organiza tu presupuesto de manera fácil
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LandingPage;
