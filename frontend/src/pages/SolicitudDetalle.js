import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Grid, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { solicitudService } from '../services/solicitudService';

const SolicitudDetalle = () => {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL

    useEffect(() => {
        const cargarSolicitud = async () => {
            try {
                setLoading(true);
                const data = await solicitudService.obtenerPorId(id);
                setSolicitud(data);
            } catch (err) {
                setError('No se pudo cargar la solicitud.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        cargarSolicitud();
    }, [id]);

    const handleActualizarEstado = async (nuevoEstado) => {
        try {
            let data = { estado: nuevoEstado };
            if (nuevoEstado === 'Rechazada') {
                const motivo = prompt("Por favor, ingresa el motivo del rechazo:");
                if (!motivo) return; // Si el usuario cancela, no hacemos nada
                data.observacionesRechazo = motivo;
            }
            await solicitudService.actualizarEstado(id, data);
            alert(`Solicitud actualizada a: ${nuevoEstado.replace('_', ' ')}`);
            navigate('/solicitudes');
        } catch (err) {
            alert('Error al actualizar el estado.');
            console.error(err);
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!solicitud) return <Typography>No se encontró la solicitud.</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Detalle de Solicitud #{solicitud.SolicitudID}</Typography>
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Cliente: {solicitud.Cliente?.RazonSocial}</Typography>
                        <Typography color="text.secondary">NIT: {solicitud.Cliente?.NIT}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Analista Asignado:</Typography>
                        <Typography color="text.secondary">{solicitud.Analista?.NombreCompleto || 'Sin asignar'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ mt: 2 }}>Monto Solicitado: ${new Intl.NumberFormat('es-CO').format(solicitud.MontoSolicitado)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                         <Typography sx={{ mt: 2 }}>Plazo: {solicitud.PlazoMeses} meses</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Estado Actual: {solicitud.EstadoSolicitud.replace('_', ' ')}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="success" onClick={() => handleActualizarEstado('Aprobada')}>Aprobar</Button>
                    <Button variant="contained" color="error" onClick={() => handleActualizarEstado('Rechazada')}>Rechazar</Button>
                    <Button variant="outlined" onClick={() => navigate('/solicitudes')}>Volver a la Lista</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SolicitudDetalle;