// src/pages/Config.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { jwtDecode } from "jwt-decode";

export default function Config() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        console.error("❌ No se pudieron cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUser();
  }, [token]);

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
        Administra tu perfil y seguridad
      </Typography>

      {/* Tarjeta de perfil como acordeón con navegación */}
      <Accordion
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
            👤 Perfil
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <Typography>Cargando datos...</Typography>
          ) : usuario ? (
            <Box sx={{ mb: 2 }}>
              <Typography>
                <strong>Nombre:</strong> {usuario.nombre}
              </Typography>
              <Typography>
                <strong>Apellido:</strong> {usuario.apellido}
              </Typography>
              <Typography>
                <strong>Correo:</strong> {usuario.email}
              </Typography>
            </Box>
          ) : (
            <Typography color="error">
              No se pudieron cargar los datos del usuario.
            </Typography>
          )}

          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/perfil")}
            >
              Ver Perfil Completo
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
