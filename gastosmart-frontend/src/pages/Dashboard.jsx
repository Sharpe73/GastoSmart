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
        setUser(decoded); // el token contiene id, email, nombre (si el backend lo incluye)
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
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido {user?.nombre || "al Dashboard de GastoSmart"}
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
