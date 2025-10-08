// backend/src/controllers/solicitudController.js
const { SolicitudCredito, Cliente, UsuarioInterno, Prestamo } = require('../models');

const crear = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.body.ClienteID);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    const solicitud = await SolicitudCredito.create(req.body);
    res.status(201).json(solicitud);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listar = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, clienteId } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (estado) where.EstadoSolicitud = estado;
    if (clienteId) where.ClienteID = clienteId;
    if (req.usuario && req.usuario.rol === 'Analista') {
      where.UsuarioAsignado = req.usuario.userId;
    }
    const { count, rows } = await SolicitudCredito.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Cliente, attributes: ['NIT', 'RazonSocial'] },
        {
          model: UsuarioInterno,
          as: 'Analista',
          attributes: ['NombreCompleto', 'Email']
        }
      ],
      order: [['FechaSolicitud', 'DESC']],
    });
    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      solicitudes: rows,
    });
  } catch (error) {
    console.error('Error al listar solicitudes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observacionesRechazo } = req.body;
    const { userId } = req.usuario;

    const solicitud = await SolicitudCredito.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // --- ESTA ES LA LÓGICA CLAVE ---
    if (estado === 'Aprobada') {
      // Primero, verifica si ya existe un préstamo para esta solicitud para evitar duplicados
      const prestamoExistente = await Prestamo.findOne({ where: { SolicitudID: solicitud.SolicitudID } });

      if (!prestamoExistente) {
        // Si no existe, créalo
        await Prestamo.create({
          SolicitudID: solicitud.SolicitudID,
          MontoAprobado: solicitud.MontoSolicitado,
          TasaInteresAnual: 25.00, // Tasa por defecto
          PlazoMeses: solicitud.PlazoMeses,
          EstadoPrestamo: 'Aprobado',
          SaldoPendiente: solicitud.MontoSolicitado,
          FechaAprobacion: new Date(),
          NumeroContrato: `CONTRATO-${Date.now()}`,
        });
      }
    }

    // Esta parte actualiza el estado de la solicitud
    solicitud.EstadoSolicitud = estado;
    if (estado === 'Rechazada') {
      solicitud.ObservacionesRechazo = observacionesRechazo || 'No especificado';
    }
    if (estado === 'En_Analisis') {
      solicitud.UsuarioAsignado = userId;
    }

    solicitud.FechaActualizacion = new Date();
    await solicitud.save();

    res.json(solicitud);
  } catch (error) {
    console.error('Error al actualizar estado de la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await SolicitudCredito.findByPk(id, {
      include: [
        { model: Cliente, attributes: ['NIT', 'RazonSocial', 'EmailContacto'] },
        { 
          model: UsuarioInterno, 
          as: 'Analista',
          attributes: ['NombreCompleto', 'Email'] 
        }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(solicitud);
  } catch (error) {
    console.error('Error al obtener la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
module.exports = {
  crear,
  listar,
  actualizarEstado,
  obtenerPorId,
};