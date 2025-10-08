import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Grid, TextField, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { prestamoService } from '../services/prestamoService';
import { pagoService } from '../services/pagoService';

const PrestamoDetalle = () => {
    const [prestamo, setPrestamo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagoData, setPagoData] = useState({ MontoPagado: '', MedioDePago: 'PSE' });
    const { id } = useParams();
    const navigate = useNavigate();

    const cargarPrestamo = async () => {
        try {
            setLoading(true);
            const data = await prestamoService.obtenerPorId(id);
            setPrestamo(data);
        } catch (err) {
            setError('No se pudo cargar el préstamo.');
            console.error("Error en Frontend al cargar préstamo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPrestamo();
    }, [id]);

    const handlePagoSubmit = async (e) => {
        e.preventDefault();
        console.log("Iniciando envío de pago...");
        try {
            if (!pagoService || typeof pagoService.crear !== 'function') {
                console.error("pagoService o pagoService.crear no está disponible.");
                alert('Error crítico: el servicio de pago no está cargado.');
                return;
            }

            await pagoService.crear({ ...pagoData, PrestamoID: id });
            alert('Pago registrado con éxito');
            setPagoData({ MontoPagado: '', MedioDePago: 'PSE' });
            cargarPrestamo(); // Recargar los datos del préstamo
        } catch (err) {
            console.error("Error en Frontend al registrar pago:", err);
            alert('Error al registrar el pago');
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!prestamo) return <Typography>No se encontró el préstamo.</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Detalle del Préstamo #{prestamo.PrestamoID}</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Cliente: {prestamo.SolicitudesCredito?.Cliente?.RazonSocial}</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}><Typography>Monto Aprobado: ${new Intl.NumberFormat('es-CO').format(prestamo.MontoAprobado)}</Typography></Grid>
                    <Grid item xs={6}><Typography>Saldo Pendiente: ${new Intl.NumberFormat('es-CO').format(prestamo.SaldoPendiente)}</Typography></Grid>
                    <Grid item xs={6}><Typography>Estado: {prestamo.EstadoPrestamo}</Typography></Grid>
                    <Grid item xs={6}><Typography>Plazo: {prestamo.PlazoMeses} meses</Typography></Grid>
                </Grid>
            </Paper>
            {prestamo.EstadoPrestamo === 'Activo' && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Registrar Nuevo Pago</Typography>
                    <Box component="form" onSubmit={handlePagoSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField label="Monto del Pago" type="number" value={pagoData.MontoPagado} onChange={(e) => setPagoData({ ...pagoData, MontoPagado: e.target.value })} required />
                        <TextField select label="Medio de Pago" value={pagoData.MedioDePago} onChange={(e) => setPagoData({ ...pagoData, MedioDePago: e.target.value })} sx={{ minWidth: 150 }}>
                            <MenuItem value="PSE">PSE</MenuItem>
                            <MenuItem value="Transferencia">Transferencia</MenuItem>
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                        </TextField>
                        <Button type="submit" variant="contained">Registrar Pago</Button>
                    </Box>
                </Paper>
            )}
            <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate('/prestamos')}>Volver a la Lista</Button>
        </Box>
    );
};

export default PrestamoDetalle;