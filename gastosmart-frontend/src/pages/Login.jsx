import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  IconButton,
  Link,
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al iniciar sesión");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #90caf9 0%, #e3f2fd 100%)",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <IconButton size="large" color="primary">
              <AccountBalanceWallet fontSize="inherit" />
            </IconButton>
          </Box>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            GastoSmart
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Bienvenido a tu gestor de gastos personales
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Iniciar Sesión
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Link href="#" underline="hover" sx={{ fontSize: "0.9rem" }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
