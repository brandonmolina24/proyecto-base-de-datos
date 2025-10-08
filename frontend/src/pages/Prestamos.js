import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { prestamoService } from '../services/prestamoService';
import { useAuth } from '../context/AuthContext';

const Prestamos = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LA FUNCIÓN QUE FALTABA ---
  const cargarPrestamos = async () => {
    try {
      setLoading(true);
      const data = await prestamoService.listar();
      setPrestamos(data.prestamos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const handleDesembolsar = async (e, prestamoId) => {
    e.stopPropagation(); // Evita que el clic navegue a la página de detalle
    if (!window.confirm("¿Estás seguro de que deseas desembolsar este préstamo?")) {
        return;
    }
    try {
        await prestamoService.desembolsar(prestamoId);
        alert('Préstamo desembolsado con éxito.');
        cargarPrestamos(); // Recargamos la lista para ver el cambio de estado
    } catch (error) {
        alert(error.response?.data?.error || 'Error al desembolsar el préstamo.');
        console.error(error);
    }
  };
  
  const getEstadoChip = (estado) => {
    switch (estado) {
        case 'Aprobado': return <Chip label={estado} color="primary" size="small" />;
        case 'Activo': return <Chip label={estado} color="success" size="small" />;
        case 'En_Mora': return <Chip label={estado} color="warning" size="small" />;
        case 'Pagado': return <Chip label={estado} color="default" size="small" />;
        default: return <Chip label={estado} size="small" />;
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestión de Préstamos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Préstamo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Monto Aprobado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Aprobación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos.map((p) => (
              <TableRow 
                key={p.PrestamoID} 
                hover 
                onClick={() => navigate(`/prestamos/${p.PrestamoID}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{p.PrestamoID}</TableCell>
                <TableCell>{p.SolicitudesCredito?.Cliente?.RazonSocial || 'N/A'}</TableCell>
                <TableCell>${new Intl.NumberFormat('es-CO').format(p.MontoAprobado)}</TableCell>
                <TableCell>{getEstadoChip(p.EstadoPrestamo)}</TableCell>
                <TableCell>{new Date(p.FechaAprobacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  {p.EstadoPrestamo === 'Aprobado' && ['Admin', 'Cartera'].includes(usuario?.rol) && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => handleDesembolsar(e, p.PrestamoID)}
                    >
                      Desembolsar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Prestamos;