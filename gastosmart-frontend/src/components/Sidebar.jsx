// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

// Íconos
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // 👈 Presupuesto
import HistoryIcon from "@mui/icons-material/History"; // 👈 NUEVO: Históricos

// 👇 Importa tu logo
import logo from "../assets/gasto.png";

export const drawerWidth = 260;

export default function Sidebar({ open, onClose, onLogout }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  const [openCategorias, setOpenCategorias] = useState(false);
  const [openGastos, setOpenGastos] = useState(false);

  const Content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ height: "32px", marginRight: "8px" }}
        />
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          GastoSmart
        </Typography>
      </Toolbar>

      <Divider />

      {/* Menú principal */}
      <List sx={{ py: 0 }}>
        {/* Dashboard */}
        <ListItemButton
          component={RouterLink}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
          onClick={!isDesktop ? onClose : undefined}
          sx={{
            "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Categorías */}
        <ListItemButton
          onClick={() => setOpenCategorias(!openCategorias)}
          sx={{
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categorías" />
          {openCategorias ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCategorias} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 4,
                "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
                "&:hover": { bgcolor: "primary.light", color: "white" },
              }}
              component={RouterLink}
              to="/categorias/gestionar"
              selected={location.pathname.startsWith("/categorias/gestionar")}
              onClick={!isDesktop ? onClose : undefined}
            >
              <ListItemText primary="Gestionar Categorías" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Gastos */}
        <ListItemButton
          onClick={() => setOpenGastos(!openGastos)}
          sx={{
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="Gastos" />
          {openGastos ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openGastos} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 4,
                "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
                "&:hover": { bgcolor: "primary.light", color: "white" },
              }}
              component={RouterLink}
              to="/gastos/gestionar"
              selected={location.pathname.startsWith("/gastos/gestionar")}
              onClick={!isDesktop ? onClose : undefined}
            >
              <ListItemText primary="Gestionar Gastos" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Presupuesto */}
        <ListItemButton
          component={RouterLink}
          to="/presupuesto"
          selected={location.pathname.startsWith("/presupuesto")}
          onClick={!isDesktop ? onClose : undefined}
          sx={{
            "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText primary="Presupuesto" />
        </ListItemButton>

        {/* Reportes */}
        <ListItemButton
          component={RouterLink}
          to="/reportes"
          selected={location.pathname.startsWith("/reportes")}
          onClick={!isDesktop ? onClose : undefined}
          sx={{
            "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Reportes" />
        </ListItemButton>

        {/* Históricos 👈 NUEVO */}
        <ListItemButton
          component={RouterLink}
          to="/historicos"
          selected={location.pathname.startsWith("/historicos")}
          onClick={!isDesktop ? onClose : undefined}
          sx={{
            "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Históricos" />
        </ListItemButton>

        {/* Configuración */}
        <ListItemButton
          component={RouterLink}
          to="/config"
          selected={location.pathname.startsWith("/config")}
          onClick={!isDesktop ? onClose : undefined}
          sx={{
            "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Logout */}
      <List sx={{ py: 0 }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            "&:hover": { bgcolor: "error.light", color: "white" },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  return isDesktop ? (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          boxShadow: 3,
          borderRight: "none",
        },
      }}
    >
      {Content}
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: drawerWidth, boxShadow: 3 },
      }}
    >
      {Content}
    </Drawer>
  );
}
