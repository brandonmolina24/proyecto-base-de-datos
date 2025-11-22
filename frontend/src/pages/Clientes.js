import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Chip, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { clienteService } from '../services/clienteService';
import FormularioCliente from '../components/FormularioCliente';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.listar();
      setClientes(data.clientes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Clientes</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpenForm(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIT</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell> {/* <-- NUEVO ENCABEZADO */}
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.ClienteID} hover>
                <TableCell>{cliente.NIT}</TableCell>
                <TableCell>{cliente.RazonSocial}</TableCell>
                <TableCell>{cliente.SectorEconomico}</TableCell>
                <TableCell>{cliente.EmailContacto}</TableCell> {/* <-- CAMPO CORREGIDO */}
                <TableCell>{cliente.Telefono}</TableCell> {/* <-- NUEVA CELDA */}
                <TableCell>
                  <Chip label={cliente.Estado} color={cliente.Estado === 'Activo' ? 'success' : 'default'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormularioCliente 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        onSuccess={cargarClientes}
      />
    </Box>
  );
};

export default Clientes;