import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Autocomplete } from '@mui/material';
import { solicitudService } from '../services/solicitudService';
import { clienteService } from '../services/clienteService';

const FormularioSolicitud = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ClienteID: '',
    MontoSolicitado: '',
    PlazoMeses: '',
    PropositoCredito: '',
  });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      clienteService.listar({ limit: 1000 }).then(data => {
        setClientes(data.clientes || []);
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClienteChange = (event, newValue) => {
    setFormData({ ...formData, ClienteID: newValue ? newValue.ClienteID : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await solicitudService.crear(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nueva Solicitud de Crédito</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => `${option.RazonSocial} (${option.NIT})`}
                onChange={handleClienteChange}
                renderInput={(params) => <TextField {...params} label="Cliente" required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Monto Solicitado" name="MontoSolicitado" type="number" value={formData.MontoSolicitado} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Plazo (Meses)" name="PlazoMeses" type="number" value={formData.PlazoMeses} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Propósito del Crédito" name="PropositoCredito" value={formData.PropositoCredito} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Solicitud'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormularioSolicitud;