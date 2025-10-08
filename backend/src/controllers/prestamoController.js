const { Prestamo, SolicitudCredito, Cliente } = require('../models');

const listar = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [{
        model: SolicitudCredito,
        attributes: ['SolicitudID'],
        include: [{
          model: Cliente,
          attributes: ['RazonSocial']
        }]
      }],
      order: [['FechaCreacion', 'DESC']]
    });
    res.json({ prestamos });
  } catch (error) {
    console.error("Error al listar préstamos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const desembolsar = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    if (prestamo.EstadoPrestamo !== 'Aprobado') {
      return res.status(400).json({ error: 'El préstamo no puede ser desembolsado' });
    }

    prestamo.EstadoPrestamo = 'Activo';
    prestamo.FechaDesembolso = new Date();
    
    await prestamo.save();
    res.json(prestamo);
  } catch (error) {
    console.error("Error al desembolsar el préstamo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// --- FUNCIÓN QUE FALTABA ---
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findByPk(id, {
      include: [{
        model: SolicitudCredito,
        include: [{
          model: Cliente,
          attributes: ['RazonSocial']
        }]
      }]
    });

    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json(prestamo);
  } catch (error)
 {
    console.error("Error al obtener el préstamo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { 
  listar,
  desembolsar,
  obtenerPorId,
};