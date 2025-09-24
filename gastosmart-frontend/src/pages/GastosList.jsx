import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Pagination,
  Box,
} from "@mui/material";
import { Edit, Delete, PictureAsPdf } from "@mui/icons-material";

function GastosList({ gastos, onEdit, onDelete, onVerDocumento }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular total de páginas
  const totalPages = Math.ceil(gastos.length / itemsPerPage);

  // Gastos que se muestran en la página actual
  const gastosPaginados = gastos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {gastosPaginados.map((gasto) => (
          <Grid item xs={12} sm={6} md={4} key={gasto.id}>
            <Card
              sx={{
                boxShadow: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{gasto.descripcion}</Typography>
                <Typography variant="body2" color="text.secondary">
                  💰 Monto: ${Number(gasto.monto).toLocaleString("es-CL")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📂 Categoría: {gasto.categoria_nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 Fecha: {new Date(gasto.fecha).toLocaleDateString("es-CL")}
                </Typography>
                {gasto.tiene_archivo && (
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => onVerDocumento(gasto.id)}
                    sx={{ mt: 1 }}
                  >
                    <PictureAsPdf fontSize="small" />
                  </IconButton>
                )}
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => onEdit(gasto)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(gasto.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Paginación */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}

export default GastosList;
