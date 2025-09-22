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
        background: "linear-gradient(135deg, #90caf9 0%, #e3f2fd 100%)",
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: 6,
          borderRadius: 4,
          textAlign: "center",
          p: 3,
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
