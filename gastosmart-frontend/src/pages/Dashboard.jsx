// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // el token contiene id, email, nombre
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container sx={{ mt: 6, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido {user?.nombre || "al Dashboard de GastoSmart"}
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Aquí podrás ver y gestionar tus gastos personales.
      </Typography>

      {/* Botones principales del dashboard */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/categorias")}
        >
          Gestionar Categorías
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/gastos")}
        >
          Gestionar Gastos
        </Button>
      </Box>

      {/* Botón de cierre de sesión */}
      <Box>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
