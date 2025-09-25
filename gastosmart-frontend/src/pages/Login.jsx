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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const navigate = useNavigate();

  // 🔹 Login normal o con clave temporal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // ⚡ Si requiere cambio de contraseña
      if (res.data.requiereCambio) {
        navigate("/cambiar-password", { state: { email: res.data.email } });
        return;
      }

      // Login normal
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.mensaje || "❌ Error al iniciar sesión");
    }
  };

  // 🔹 Recuperar contraseña
  const handleRecover = async () => {
    setError("");
    setMensaje("");
    try {
      const res = await API.post("/auth/olvidar-password", { email: recoveryEmail });
      setMensaje(res.data.mensaje);
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.mensaje || "❌ No se pudo enviar la clave temporal");
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
          {mensaje && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mensaje}
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
            <Link
              component="button"
              underline="hover"
              sx={{ fontSize: "0.9rem" }}
              onClick={() => setOpenDialog(true)}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* 🔹 Dialog para recuperar contraseña */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Recuperar contraseña</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Correo registrado"
            type="email"
            fullWidth
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleRecover} variant="contained">
            Enviar clave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Login;
