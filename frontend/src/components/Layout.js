import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Button } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, Assignment as AssignmentIcon, AttachMoney as PrestamoIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

// 1. Añade los roles permitidos para cada menú
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Admin', 'Analista', 'Cartera', 'Supervisor'] },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes', roles: ['Admin', 'Analista', 'Cartera', 'Supervisor'] },
  { text: 'Solicitudes', icon: <AssignmentIcon />, path: '/solicitudes', roles: ['Admin', 'Analista', 'Supervisor'] },
  { text: 'Préstamos', icon: <PrestamoIcon />, path: '/prestamos', roles: ['Admin', 'Cartera', 'Supervisor'] },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 2. Filtra el menú según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(usuario?.rol));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Plataforma de Crédito PYME
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {/* 3. Usa el menú filtrado */}
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;