// src/pages/Gastos.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useLocation } from "react-router-dom"; // 👈 para saber desde qué categoría entramos
import API from "../api";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const location = useLocation();
  const categoriaSeleccionada = location.state?.categoriaId || ""; // 👈 recibimos la categoría al navegar

  // 🔹 Cargar categorías y gastos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(catRes.data);

        const gastoRes = await API.get("/gastos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Si venimos de una categoría específica, filtramos
        if (categoriaSeleccionada) {
          setGastos(gastoRes.data.filter(g => g.categoria_id === categoriaSeleccionada));
          setCategoriaId(categoriaSeleccionada);
        } else {
          setGastos(gastoRes.data);
        }
      } catch (err) {
        setError("Error al cargar datos");
      }
    };

    fetchData();
  }, [token, categoriaSeleccionada]);

  // 🔹 Agregar gasto
  const handleAddGasto = async () => {
    if (!descripcion || !monto || !categoriaId) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await API.post(
        "/gastos",
        { descripcion, monto, categoria_id: categoriaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGastos([res.data, ...gastos]);
      setDescripcion("");
      setMonto("");
      setCategoriaId(categoriaSeleccionada || "");
      setError("");
    } catch (err) {
      setError("Error al agregar gasto");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Gestión de Gastos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulario para agregar gasto */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descripción"
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Monto"
            type="number"
            fullWidth
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            select
            label="Categoría"
            fullWidth
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddGasto}>
            Agregar Gasto
          </Button>
        </Grid>
      </Grid>

      {/* Lista de gastos */}
      <Grid container spacing={3}>
        {gastos.map((gasto) => (
          <Grid item xs={12} sm={6} md={4} key={gasto.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{gasto.descripcion}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto: ${gasto.monto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoría: {gasto.categoria_nombre}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Gastos;
