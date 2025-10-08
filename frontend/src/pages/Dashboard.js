import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import { People, Assignment, AttachMoney, TrendingUp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import ActividadRecienteChart from '../components/ActividadRecienteChart';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Box sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, borderRadius: 2, p: 2, mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h4">{value}</Typography>
      <Typography color="text.secondary" variant="body2">{title}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { usuario, logout } = useAuth(); // Obtenemos la función logout del contexto
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, activityData] = await Promise.all([
            dashboardService.getStats(),
            dashboardService.getMonthlyActivity()
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error("Error al cargar datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigimos al login después de cerrar sesión
  };

  const formatCurrency = (value) => {
    const number = Number(value);
    if (isNaN(number)) return '$0';
    if (number >= 1000000) {
        return `$${(number / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;

  return (
    <Box>
      {/* --- SECCIÓN DE ENCABEZADO CORREGIDA --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
            <Typography variant="h4">Bienvenido, {usuario?.nombre}</Typography>
            <Typography variant="body1" color="text.secondary">
                Panel de Control - Sistema de Crédito PYME
            </Typography>
        </Box>
        <Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>
                Cerrar Sesión
            </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Clientes" value={stats?.totalClientes || 0} icon={<People sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Solicitudes Pendientes" value={stats?.solicitudesPendientes || 0} icon={<Assignment sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Préstamos Activos" value={stats?.prestamosActivos || 0} icon={<AttachMoney sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Cartera Total" value={formatCurrency(stats?.carteraTotal)} icon={<TrendingUp sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <ActividadRecienteChart data={activity} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Tareas Pendientes</Typography>
            <Typography color="text.secondary">- Revisar solicitudes nuevas</Typography>
            <Typography color="text.secondary">- Aprobar desembolsos</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;