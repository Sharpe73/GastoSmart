// src/pages/Config.jsx
import React, { useState } from "react";
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  TextField,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import API from "../api";

export default function Config() {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const token = localStorage.getItem("token");

  // manejar cambio de contraseña
  const handleChangePassword = async () => {
    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      setMensaje({
        tipo: "error",
        texto: "⚠️ Todos los campos son obligatorios",
      });
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      setMensaje({
        tipo: "error",
        texto: "⚠️ La nueva contraseña y la confirmación no coinciden",
      });
      return;
    }

    try {
      await API.post(
        "/auth/change-password",
        { passwordActual, nuevaPassword, confirmarPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje({
        tipo: "success",
        texto: "✅ Contraseña actualizada correctamente",
      });
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err.response?.data?.mensaje || "❌ Contraseña actual inválida",
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Configuración ⚙️
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        Administra tu seguridad
      </Typography>

      {/* Acordeón para cambiar contraseña */}
      <Accordion
        defaultExpanded
        sx={{
          maxWidth: 650,
          mb: 3,
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(135deg, #f5f5f5, #fafafa)",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <LockIcon fontSize="small" sx={{ mr: 1 }} /> Cambiar Contraseña
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {mensaje.texto && (
            <Alert
              severity={mensaje.tipo}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 2,
                fontSize: "0.85rem",
                p: 1,
              }}
            >
              {mensaje.texto}
            </Alert>
          )}

          <TextField
            label="Contraseña Actual"
            type="password"
            fullWidth
            margin="dense"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
          />
          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
          <TextField
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
          />

          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleChangePassword}
            >
              Guardar Cambios
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
