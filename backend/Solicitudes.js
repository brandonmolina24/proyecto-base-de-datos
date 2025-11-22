import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Chip, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { solicitudService } from '../services/solicitudService';
import { useNavigate } from 'react-router-dom';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await solicitudService.listar();
      setSolicitudes(data.solicitudes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Recibida': 'info',
      'En_Analisis': 'warning',
      'Aprobada': 'success',
      'Rechazada': 'error',
      'Desembolsada': 'primary'
    };
    return colores[estado] || 'default';
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Solicitudes de Credito</Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>Volver</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Monto Solicitado</TableCell>
              <TableCell>Plazo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((sol) => (
              <TableRow key={sol.SolicitudID}>
                <TableCell>{sol.SolicitudID}</TableCell>
                <TableCell>{sol.Cliente?.RazonSocial || 'N/A'}</TableCell>
                <TableCell></TableCell>
                <TableCell>{sol.PlazoMeses} meses</TableCell>
                <TableCell>
                  <Chip label={sol.EstadoSolicitud} color={getEstadoColor(sol.EstadoSolicitud)} size="small" />
                </TableCell>
                <TableCell>{new Date(sol.FechaSolicitud).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Solicitudes;
