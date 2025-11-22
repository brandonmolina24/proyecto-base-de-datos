import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Alert } from '@mui/material';
import { clienteService } from '../services/clienteService';

const FormularioCliente = ({ open, onClose, onSuccess }) => {
  // --- CAMBIO EN EL ESTADO ---
  const [formData, setFormData] = useState({
    NIT: '',
    RazonSocial: '',
    SectorEconomico: '',
    EmailContacto: '', // <--- CORREGIDO (antes EmailCorporativo)
    Telefono: '',
    Direccion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await clienteService.crear(formData);
      onSuccess(); 
      onClose(); 
      // --- CAMBIO EN EL RESET ---
      setFormData({ NIT: '', RazonSocial: '', SectorEconomico: '', EmailContacto: '', Telefono: '', Direccion: '' }); 
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo Cliente</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="NIT" name="NIT" value={formData.NIT} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Razón Social" name="RazonSocial" value={formData.RazonSocial} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Sector Económico" name="SectorEconomico" value={formData.SectorEconomico} onChange={handleChange} />
            </Grid>
            {/* --- CAMBIO EN EL TEXTFIELD --- */}
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                required 
                type="email" 
                label="Email de Contacto" 
                name="EmailContacto" // <--- CORREGIDO
                value={formData.EmailContacto} // <--- CORREGIDO
                onChange={handleChange} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Teléfono" name="Telefono" value={formData.Telefono} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Dirección" name="Direccion" value={formData.Direccion} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cliente'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormularioCliente;