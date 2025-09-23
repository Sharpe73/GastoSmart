// src/pages/Historicos.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Historicos() {
  const [historicos, setHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistoricos = async () => {
      try {
        const res = await API.get("/historicos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoricos(res.data.historicos || []);
      } catch (error) {
        console.error("❌ Error al cargar históricos:", error);
        setMensaje({
          tipo: "error",
          texto: "❌ No se pudieron cargar los históricos.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricos();
  }, [token]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando históricos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        📊 Históricos de Presupuesto
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      <Grid container spacing={3}>
        {historicos.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ mt: 3, width: "100%" }}>
            No hay históricos disponibles todavía.
          </Typography>
        ) : (
          historicos.map((histo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">
                    📅 {histo.periodo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💰 Sueldo: ${Number(histo.sueldo).toLocaleString("es-CL")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📉 Gastado: $
                    {Number(histo.total_gastado).toLocaleString("es-CL")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/historicos/${histo.periodo}`)}
                  >
                    Ver Detalle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default Historicos;
