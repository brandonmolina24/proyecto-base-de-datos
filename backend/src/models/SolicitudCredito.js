const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudCredito = sequelize.define('SolicitudesCredito', {
  SolicitudID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ClienteID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MontoSolicitado: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  PlazoMeses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PropositoCredito: {
    type: DataTypes.TEXT,
  },
  EstadoSolicitud: {
    type: DataTypes.ENUM('Recibida', 'En_Analisis', 'Aprobada', 'Rechazada', 'Cancelada', 'Desembolsada'),
    defaultValue: 'Recibida',
  },
  FechaSolicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  FechaActualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UsuarioAsignado: {
    type: DataTypes.INTEGER,
  },
  ObservacionesRechazo: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'SolicitudesCredito',
  timestamps: false,
});

module.exports = SolicitudCredito;