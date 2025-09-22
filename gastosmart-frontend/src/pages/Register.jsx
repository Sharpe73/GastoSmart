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
  IconButton,
  Link,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      setTipoMensaje("success");
      setMensaje("✅ Registro exitoso, ahora puedes iniciar sesión");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setTipoMensaje("error");
      setMensaje(
        "❌ Error en el registro: " +
          (error.response?.data?.mensaje || "Intenta de nuevo")
      );
    }
  };

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
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <IconButton size="large" color="primary">
              <PersonAdd fontSize="inherit" />
            </IconButton>
          </Box>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Crear Cuenta
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Regístrate en <b>GastoSmart</b> y empieza a organizar tus finanzas
          </Typography>

          {mensaje && (
            <Alert severity={tipoMensaje} sx={{ mb: 2 }}>
              {mensaje}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nombre completo"
              name="nombre"
              fullWidth
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              label="Correo electrónico"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Registrarse
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Link
              component="button"
              underline="hover"
              sx={{ fontSize: "0.9rem" }}
              onClick={() => navigate("/login")}
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
