import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function Presupuesto() {
  const [sueldo, setSueldo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleGuardar = () => {
    console.log("Presupuesto guardado:", { sueldo, fechaInicio, fechaFin });
    // Próximamente: enviar estos datos al backend
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
        </CardContent>
      </Card>
    </Container>
  );
}

export default Presupuesto;
