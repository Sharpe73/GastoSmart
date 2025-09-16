import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://authentic-reprieve-production.up.railway.app/auth/register",
        formData
      );
      setMensaje("✅ Registro exitoso, ahora puedes iniciar sesión");
    } catch (error) {
      setMensaje("❌ Error en el registro: " + error.response?.data?.mensaje);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Registro - GastoSmart
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrarse
        </Button>
      </Box>
      {mensaje && (
        <Typography variant="body2" style={{ marginTop: "20px", color: "red" }}>
          {mensaje}
        </Typography>
      )}
    </Container>
  );
}

export default Register;
