// src/pages/Presupuesto.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import API from "../api"; // 👈 helper para axios

function Presupuesto() {
  const [sueldo, setSueldo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [saldo, setSaldo] = useState(null);

  // 👉 Función para formatear fecha legible
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 👉 Formatear números como CLP
  const formatCLP = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) return "$0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // Cargar presupuesto actual y saldo al entrar
  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const res = await API.get("/presupuesto");
        if (res.data) {
          setSueldo(res.data.sueldo);
          setFechaInicio(res.data.fecha_inicio);
          setFechaFin(res.data.fecha_fin);
        }
      } catch (error) {
        console.error("Error al cargar presupuesto:", error);
      }
    };

    const fetchSaldo = async () => {
      try {
        const res = await API.get("/presupuesto/saldo");
        setSaldo(res.data);
      } catch (error) {
        console.error("Error al obtener saldo:", error);
      }
    };

    fetchPresupuesto();
    fetchSaldo();
  }, []);

  const handleGuardar = async () => {
    try {
      const res = await API.post("/presupuesto", {
        sueldo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      setMensaje("✅ Presupuesto guardado correctamente");
      console.log("Presupuesto guardado:", res.data);

      // actualizar saldo después de guardar
      const saldoRes = await API.get("/presupuesto/saldo");
      setSaldo(saldoRes.data);
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      setMensaje("❌ Error al guardar el presupuesto");
    }
  };

  // 👉 Calcular gasto diario permitido
  const calcularGastoDiario = () => {
    if (!saldo || !saldo.fecha_fin) return null;

    const hoy = new Date();
    const fechaFin = new Date(saldo.fecha_fin);

    const diffTime = fechaFin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDias <= 0) return null;

    return saldo.saldoRestante / diffDias;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Presupuesto
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Sueldo"
                type="number"
                fullWidth
                value={sueldo}
                onChange={(e) => setSueldo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha de inicio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha de fin"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGuardar}
            sx={{ mt: 2 }}
          >
            Guardar Presupuesto
          </Button>

          {mensaje && (
            <Alert
              severity={mensaje.startsWith("✅") ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {mensaje}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 👉 Mostrar saldo si existe */}
      {saldo && saldo.sueldo && (
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle2">Sueldo inicial</Typography>
              <Typography variant="h6">{formatCLP(saldo.sueldo)}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle2">Total Gastos</Typography>
              <Typography variant="h6" color="error">
                {formatCLP(saldo.totalGastos)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle2">Saldo Restante</Typography>
              <Typography variant="h6" color="success.main">
                {formatCLP(saldo.saldoRestante)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle2">Período</Typography>
              <Typography variant="h6">
                {formatFecha(saldo.fecha_inicio)} → {formatFecha(saldo.fecha_fin)}
              </Typography>
            </Card>
          </Grid>

          {/* 👉 Tarjeta de gasto diario */}
          {calcularGastoDiario() && (
            <Grid item xs={12}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e9" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
                  Puedes gastar por día: {formatCLP(calcularGastoDiario())}
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Presupuesto;
