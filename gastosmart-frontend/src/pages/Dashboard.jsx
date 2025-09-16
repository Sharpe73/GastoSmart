import React from "react";
import { Container, Typography } from "@mui/material";

function Dashboard() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard de GastoSmart
      </Typography>
      <Typography variant="body1">
        Aquí podrás ver y gestionar tus gastos personales.
      </Typography>
    </Container>
  );
}

export default Dashboard;
