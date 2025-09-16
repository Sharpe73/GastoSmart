import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        GastoSmart
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bienvenido a tu gestor de gastos personales
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/login")}
      >
        Comenzar
      </Button>
    </Container>
  );
}

export default App;
