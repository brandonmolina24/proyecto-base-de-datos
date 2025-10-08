const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pagos', {
  PagoID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PrestamoID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MontoPagado: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  FechaPago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  MedioDePago: {
    type: DataTypes.ENUM('PSE', 'Transferencia', 'ACH', 'Efectivo', 'Cheque'),
    allowNull: false,
  },
  ReferenciaPago: {
    type: DataTypes.STRING(100),
  },
  EstadoPago: {
    type: DataTypes.ENUM('Exitoso', 'Pendiente', 'Fallido', 'Reversado'),
    defaultValue: 'Exitoso',
  },
  ObservacionesPago: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'Pagos',
  timestamps: false,
});

module.exports = Pago;