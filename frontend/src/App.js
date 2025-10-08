import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importación de Páginas y Componentes
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Solicitudes from './pages/Solicitudes';
import SolicitudDetalle from './pages/SolicitudDetalle';
import Layout from './components/Layout';
import Prestamos from './pages/Prestamos';
import PrestamoDetalle from './pages/PrestamoDetalle';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Box>Cargando...</Box>;
  // Envuelve las rutas privadas con el Layout
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* RUTAS PRIVADAS DENTRO DEL LAYOUT */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/solicitudes" element={<PrivateRoute><Solicitudes /></PrivateRoute>} />
            <Route path="/solicitudes/:id" element={<PrivateRoute><SolicitudDetalle /></PrivateRoute>} />
            <Route path="/prestamos" element={<PrivateRoute><Prestamos /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/prestamos/:id" element={<PrivateRoute><PrestamoDetalle /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;