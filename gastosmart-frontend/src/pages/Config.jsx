// src/pages/Config.jsx
import React from "react";
import { Typography, Container } from "@mui/material";

export default function Config() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>
      <Typography>
        Aquí podrás configurar tu aplicación ⚙️
      </Typography>
    </Container>
  );
}
