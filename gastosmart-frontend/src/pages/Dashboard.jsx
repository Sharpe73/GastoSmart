import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // eliminar token
    navigate("/login"); // redirigir al login
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard de GastoSmart
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Aquí podrás ver y gestionar tus gastos personales.
      </Typography>

      <Box>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
