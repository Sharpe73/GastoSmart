// src/pages/LandingPage.jsx
import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
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
      {/* Fondo con ondas suaves */}
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "40%",
          backgroundImage: `url("data:image/svg+xml;utf8,
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
              <path fill='%23ffffff55' d='M0,224L40,213.3C80,203,160,181,240,160C320,139,400,117,480,122.7C560,128,640,160,720,176C800,192,880,192,960,165.3C1040,139,1120,85,1200,90.7C1280,96,1360,160,1400,192L1440,224L1440,0L0,0Z'></path>
            </svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.3,
        }}
      />

      {/* Tarjeta central */}
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: 6,
          borderRadius: 4,
          textAlign: "center",
          p: 4,
          zIndex: 2,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)", // 👈 efecto glassmorphism
        }}
      >
        <CardContent>
          {/* Logo circular */}
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 70,
              height: 70,
              mx: "auto",
              mb: 2,
              fontSize: "2rem",
            }}
          >
            💰
          </Avatar>

          <Typography variant="h3" color="primary" gutterBottom>
            GastoSmart
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Tu compañero inteligente para <br />
            controlar gastos y organizar tu presupuesto
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
