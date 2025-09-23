// src/pages/HistoricoDetalle.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { PictureAsPdf } from "@mui/icons-material";
import API from "../api";

function HistoricoDetalle() {
  const { id } = useParams(); // ahora recibimos el ID del histórico
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await API.get(`/historicos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetalle(res.data);
      } catch (error) {
        console.error("❌ Error al cargar detalle histórico:", error);
        setMensaje({
          tipo: "error",
          texto: "❌ No se pudo cargar el detalle histórico.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id, token]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando detalle...
        </Typography>
      </Container>
    );
  }

  if (!detalle) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">
          No se encontró información para este histórico.
        </Alert>
      </Container>
    );
  }

  const { presupuesto, gastos, periodo } = detalle;

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        📅 Detalle Histórico {periodo}
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      {/* Resumen del presupuesto */}
      <Card sx={{ boxShadow: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6">💰 Presupuesto</Typography>
          <Typography variant="body2" color="text.secondary">
            Sueldo: ${Number(presupuesto.sueldo).toLocaleString("es-CL")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha inicio:{" "}
            {new Date(presupuesto.fecha_inicio).toLocaleDateString("es-CL")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha fin:{" "}
            {new Date(presupuesto.fecha_fin).toLocaleDateString("es-CL")}
          </Typography>
        </CardContent>
      </Card>

      {/* Lista de gastos */}
      <Grid container spacing={3}>
        {gastos.length === 0 ? (
          <Typography
            variant="body1"
            align="center"
            sx={{ mt: 3, width: "100%" }}
          >
            No hubo gastos en este período.
          </Typography>
        ) : (
          gastos.map((gasto) => (
            <Grid item xs={12} sm={6} md={4} key={gasto.id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{gasto.descripcion}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    💰 Monto: ${Number(gasto.monto).toLocaleString("es-CL")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📂 Categoría: {gasto.categoria}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 Fecha: {new Date(gasto.fecha).toLocaleDateString("es-CL")}
                  </Typography>
                  {gasto.tiene_archivo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <Link
                        href={`${import.meta.env.VITE_API_URL}/gastos/${gasto.id}/archivo`}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                      >
                        <PictureAsPdf fontSize="small" /> Ver documento
                      </Link>
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default HistoricoDetalle;
