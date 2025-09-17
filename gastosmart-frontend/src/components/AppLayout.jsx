// src/components/AppLayout.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar, { drawerWidth } from "./Sidebar";

export default function AppLayout({ children, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#1976d2",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // ✅ sombra al AppBar
        }}
      >
        <Toolbar>
          {/* Botón hamburguesa solo en móvil */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} onLogout={onLogout} />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", // ✅ sombra más notoria
          m: 2, // margen para que no quede pegado a los bordes
        }}
      >
        {/* espacio para AppBar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
