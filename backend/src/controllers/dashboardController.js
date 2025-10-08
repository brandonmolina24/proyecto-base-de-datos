const { Cliente, SolicitudCredito, Prestamo, sequelize } = require('../models');

const getStats = async (req, res) => {
  try {
    const totalClientes = await Cliente.count();

    const solicitudesPendientes = await SolicitudCredito.count({
      where: { EstadoSolicitud: ['Recibida', 'En_Analisis'] }
    });

    const prestamosActivos = await Prestamo.count({
      where: { EstadoPrestamo: 'Activo' }
    });

    const carteraTotal = await Prestamo.sum('SaldoPendiente', {
      where: { EstadoPrestamo: 'Activo' }
    });

    res.json({
      totalClientes,
      solicitudesPendientes,
      prestamosActivos,
      carteraTotal: carteraTotal || 0, // Devuelve 0 si no hay préstamos
    });

  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
const getMonthlyActivity = async (req, res) => {
  try {
    // Simulación de datos para el gráfico - una consulta real agruparía por mes
    const activity = [
      { month: 'Mayo', solicitudes: 20, desembolsos: 15 },
      { month: 'Junio', solicitudes: 30, desembolsos: 25 },
      { month: 'Julio', solicitudes: 45, desembolsos: 40 },
      { month: 'Agosto', solicitudes: 40, desembolsos: 35 },
      { month: 'Septiembre', solicitudes: 60, desembolsos: 55 },
      { month: 'Octubre', solicitudes: 55, desembolsos: 50 },
    ];
    res.json(activity);
  } catch (error) {
    console.error("Error al obtener actividad mensual:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getStats,
  getMonthlyActivity, // <-- Añade esto
};