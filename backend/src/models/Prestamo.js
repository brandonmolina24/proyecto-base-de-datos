const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestamo = sequelize.define('Prestamos', {
  PrestamoID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SolicitudID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  NumeroContrato: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  MontoAprobado: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  TasaInteresAnual: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  PlazoMeses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FechaAprobacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  FechaDesembolso: {
    type: DataTypes.DATEONLY,
  },
  SaldoPendiente: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0,
  },
  EstadoPrestamo: {
    type: DataTypes.ENUM('Aprobado', 'Activo', 'Pagado', 'En_Mora', 'Castigado'),
    defaultValue: 'Aprobado',
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  FechaActualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Prestamos',
  timestamps: false,
});

module.exports = Prestamo;