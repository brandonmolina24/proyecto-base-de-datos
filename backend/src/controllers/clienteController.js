const { Cliente, SolicitudCredito } = require('../models');

// Crear cliente
const crear = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El NIT ya está registrado' });
    }
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Listar clientes
const listar = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, sector } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (estado) where.Estado = estado;
    if (sector) where.SectorEconomico = sector;

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['FechaCreacion', 'DESC']],
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      clientes: rows,
    });
  } catch (error) {
    console.error('Error al listar clientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener cliente por ID
const obtenerPorId = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{
        model: SolicitudCredito,
        attributes: ['SolicitudID', 'MontoSolicitado', 'EstadoSolicitud', 'FechaSolicitud']
      }]
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar cliente
const actualizar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await cliente.update(req.body);
    res.json(cliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar
};