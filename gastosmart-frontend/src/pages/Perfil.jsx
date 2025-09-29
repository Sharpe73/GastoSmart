// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Divider,
  Avatar,
  Stack,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CircleIcon from "@mui/icons-material/Circle";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [openConfirm, setOpenConfirm] = useState(false);

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

  // 🔹 Eliminar cuenta
  const handleDeleteAccount = async () => {
    try {
      const decoded = jwtDecode(token);
      await API.delete(`/usuarios/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // limpiar sesión
      localStorage.removeItem("token");
      setMensaje({
        tipo: "success",
        texto: "✅ Tu cuenta ha sido eliminada correctamente.",
      });

      // redirigir (opcional)
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "❌ Error al intentar eliminar la cuenta.",
      });
    } finally {
      setOpenConfirm(false);
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Card
        sx={{
          maxWidth: 600,
          borderRadius: 3,
          boxShadow: 4,
          p: 2,
          mx: "auto",
          background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Avatar + título */}
          <Stack alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 70,
                height: 70,
                fontSize: "1.8rem",
              }}
            >
              {usuario?.nombre?.[0] || "U"}
            </Avatar>
            <Typography
              variant="h6"
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
                mb: 2,
                p: 1.5,
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

              {/* Estado del usuario */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Typography>
                  <strong>Estado:</strong>
                </Typography>
                <Chip
                  label={usuario.estado === "activo" ? "Activo" : "Inactivo"}
                  color={usuario.estado === "activo" ? "success" : "error"}
                  size="small"
                  icon={<CircleIcon sx={{ fontSize: "0.8rem" }} />}
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Datos de la cuenta */}
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 1,
                  mb: 1,
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Datos de la Cuenta
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon color="action" fontSize="small" />
                <Typography>
                  <strong>Creación:</strong>{" "}
                  {usuario.creado_en || "No disponible"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon color="action" fontSize="small" />
                <Typography>
                  <strong>Último inicio:</strong>{" "}
                  {usuario.ultimo_login || "No disponible"}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Typography color="error" align="center">
              No se pudieron cargar los datos del usuario.
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Mensaje de error compacto */}
          {mensaje.texto && (
            <Alert
              severity={mensaje.tipo}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 2,
                fontSize: "0.8rem",
                p: 1,
              }}
            >
              {mensaje.texto}
            </Alert>
          )}

          {/* 🔹 Botón eliminar cuenta */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => setOpenConfirm(true)}
            >
              Eliminar mi cuenta
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal confirmación */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar tu cuenta?
            <br />
            Esta acción es <strong>irreversible</strong> y borrará todos tus datos
            (categorías, gastos, etc.).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
