import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Chip, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { clienteService } from '../services/clienteService';
import { useNavigate } from 'react-router-dom';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await clienteService.listar();
      setClientes(data.clientes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Gesti�n de Clientes</Typography>
        <Box>
          <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>Volver</Button>
          <Button variant="contained" startIcon={<Add />}>Nuevo Cliente</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIT</TableCell>
              <TableCell>Raz�n Social</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.ClienteID}>
                <TableCell>{cliente.NIT}</TableCell>
                <TableCell>{cliente.RazonSocial}</TableCell>
                <TableCell>{cliente.SectorEconomico}</TableCell>
                <TableCell>{cliente.EmailContacto}</TableCell>
                <TableCell><Chip label={cliente.Estado} color="success" size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Clientes;
