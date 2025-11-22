const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  tipoEntidad: {
    type: String,
    enum: ['Cliente', 'Solicitud', 'Prestamo', 'Pago', 'Usuario'],
    required: true,
  },
  entidadID: {
    type: String, // Usamos String para ser flexibles (puede ser ID de Mongo o SQL)
    required: true,
  },
  accion: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APROBACION', 'RECHAZO'],
    required: true,
  },
  usuarioID: {
    type: String, // ID del usuario que hizo la acción
  },
  ipAddress: {
    type: String,
  },
  datosAnteriores: {
    type: mongoose.Schema.Types.Mixed, // Acepta cualquier objeto JSON
  },
  datosNuevos: {
    type: mongoose.Schema.Types.Mixed,
  },
  detalles: {
    type: String,
  },
  fechaActividad: {
    type: Date,
    default: Date.now,
  },
});

// Indexa los campos más buscados para optimizar consultas
LogSchema.index({ tipoEntidad: 1, entidadID: 1 });
LogSchema.index({ fechaActividad: -1 });

const Log = mongoose.model('Log', LogSchema);
module.exports = Log;