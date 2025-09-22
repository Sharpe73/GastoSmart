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

  // 👉 Función para formatear fecha a YYYY-MM-DD
  const formatFecha = (fecha) => {
    if (!fecha) return null;
    if (fecha.includes("-") && fecha.split("-")[0].length === 4) {
      // ya está en formato yyyy-mm-dd
      return fecha;
    }
    const [day, month, year] = fecha.split("-");
    return `${year}-${month}-${day}`;
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
        fecha_inicio: formatFecha(fechaInicio),
        fecha_fin: formatFecha(fechaFin),
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
        <Card sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5" }}>
          <Typography variant="h6">Resumen</Typography>
          <Typography>Sueldo inicial: {formatCLP(saldo.sueldo)}</Typography>
          <Typography>Total Gastos: {formatCLP(saldo.totalGastos)}</Typography>
          <Typography>Saldo Restante: {formatCLP(saldo.saldoRestante)}</Typography>
          <Typography>
            Período: {saldo.fecha_inicio} → {saldo.fecha_fin}
          </Typography>

          {calcularGastoDiario() && (
            <Typography sx={{ mt: 1, fontWeight: "bold", color: "green" }}>
              Puedes gastar por día: {formatCLP(calcularGastoDiario())}
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
}

export default Presupuesto;
