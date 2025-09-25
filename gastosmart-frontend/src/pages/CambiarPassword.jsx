import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

function CambiarPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 viene del login cuando detectó que requiere cambio
  const email = location.state?.email || "";

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await API.post("/auth/reset-password", { email, nuevaPassword });
      setMensaje(res.data.mensaje);

      // 🔄 Redirigir al login luego de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || "❌ Error al cambiar contraseña");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a5d6a7 0%, #e8f5e9 100%)",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" color="primary" gutterBottom>
            Cambiar Contraseña
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Ingresa tu nueva contraseña para continuar
          </Typography>

          {mensaje && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mensaje}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nueva contraseña"
              type="password"
              fullWidth
              required
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Actualizar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CambiarPassword;
