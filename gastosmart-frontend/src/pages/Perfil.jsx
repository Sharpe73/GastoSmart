// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Divider,
  Alert,
  Avatar,
  Stack,
} from "@mui/material";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

export default function Perfil() {
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
        texto:
          err.response?.data?.mensaje || "❌ Contraseña actual inválida",
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Card
        sx={{
          maxWidth: 700,
          borderRadius: 4,
          boxShadow: 6,
          p: 3,
          mx: "auto",
          background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        }}
      >
        <CardContent>
          {/* Avatar + título */}
          <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                fontSize: "2rem",
              }}
            >
              {usuario?.nombre?.[0] || "U"}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Perfil del Usuario
            </Typography>
          </Stack>

          {loading ? (
            <Typography align="center">Cargando datos...</Typography>
          ) : usuario ? (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon color="primary" />
                <Typography>
                  <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon color="primary" />
                <Typography>
                  <strong>Correo:</strong> {usuario.email}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Typography color="error" align="center">
              No se pudieron cargar los datos del usuario.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Cambiar contraseña */}
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LockIcon /> Cambiar Contraseña
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

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleChangePassword}
            >
              Guardar Cambios
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Mensajes con Material UI mejorados */}
      {mensaje.texto && (
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          sx={{ mt: 3, borderRadius: 2, fontSize: "1rem" }}
        >
          {mensaje.texto}
        </Alert>
      )}
    </Container>
  );
}
