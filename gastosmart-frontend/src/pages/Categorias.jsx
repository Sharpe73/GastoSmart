// src/pages/Categorias.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import API from "../api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Obtener categorías reales al cargar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await API.get("/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(res.data);
      } catch (err) {
        setError("Error al cargar categorías");
      }
    };

    fetchCategorias();
  }, [token]);

  // 🔹 Abrir/Cerrar modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNuevaCategoria("");
  };

  // 🔹 Crear categoría real
  const handleAddCategoria = async () => {
    if (nuevaCategoria.trim() === "") return;

    try {
      const res = await API.post(
        "/categorias",
        { nombre: nuevaCategoria },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategorias([res.data, ...categorias]); // agregar a la lista
      handleClose();
    } catch (err) {
      setError("Error al crear categoría");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Categorías
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={handleOpen}
      >
        Agregar Categoría
      </Button>

      <Grid container spacing={3}>
        {categorias.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{cat.nombre}</Typography>
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

      {/* Modal para nueva categoría */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Categoría"
            fullWidth
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleAddCategoria}
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Categorias;
