// src/pages/Config.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import API from "../api";
import { jwtDecode } from "jwt-decode";

export default function Config() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // campos para cambiar contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const token = localStorage.getItem("token");

  // obtener datos del usuario logueado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const res = await API.get(`/usuarios/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (err) {
        setMensaje({
          tipo: "error",
          texto: "❌ No se pudieron cargar los datos del perfil",
        });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUser();
  }, [token]);

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
        texto:
          "⚠️ La nueva contraseña y la confirmación no coinciden",
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
        texto:
          err.response?.data?.mensaje || "❌ Contraseña actual inválida",
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Aquí podrás configurar tu aplicación ⚙️
      </Typography>

      {/* Tarjeta de perfil como acordeón */}
      <Accordion sx={{ maxWidth: 600, mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Perfil</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <Typography>Cargando datos...</Typography>
          ) : usuario ? (
            <Box sx={{ mb: 2 }}>
              <Typography>👤 Nombre: {usuario.nombre}</Typography>
              <Typography>👤 Apellido: {usuario.apellido}</Typography>
              <Typography>📧 Correo: {usuario.email}</Typography>
            </Box>
          ) : (
            <Typography>
              No se pudieron cargar los datos del usuario.
            </Typography>
          )}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Cambiar Contraseña
          </Typography>
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
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
            >
              Guardar Cambios
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Mensajes */}
      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mt: 2 }}>
          {mensaje.texto}
        </Alert>
      )}
    </Container>
  );
}
