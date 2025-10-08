const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Clientes', {
  ClienteID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NIT: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  RazonSocial: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  FechaConstitucion: {
    type: DataTypes.DATEONLY,
  },
  SectorEconomico: {
    type: DataTypes.STRING(100),
  },
  EmailContacto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Telefono: {
    type: DataTypes.STRING(20),
  },
  Direccion: {
    type: DataTypes.TEXT,
  },
  CanalAdquisicion: {
    type: DataTypes.STRING(100),
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  Estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido'),
    defaultValue: 'Activo',
  },
}, {
  tableName: 'Clientes',
  timestamps: false,
});

module.exports = Cliente;