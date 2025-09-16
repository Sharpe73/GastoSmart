import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      setTipoMensaje("success");
      setMensaje("✅ Registro exitoso, ahora puedes iniciar sesión");
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setTipoMensaje("error");
      setMensaje("❌ Error en el registro: " + (error.response?.data?.mensaje || "Intenta de nuevo"));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Registro - GastoSmart
      </Typography>

      {mensaje && (
        <Alert severity={tipoMensaje} sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
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
    </Container>
  );
}

export default Register;
