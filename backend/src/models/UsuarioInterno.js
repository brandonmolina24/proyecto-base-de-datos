const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const UsuarioInterno = sequelize.define('UsuariosInternos', {
  UsuarioID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreCompleto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Rol: {
    type: DataTypes.ENUM('Admin', 'Analista', 'Cartera', 'Supervisor'),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UltimoAcceso: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'UsuariosInternos',
  timestamps: false,
});

// Hook para hashear password
UsuarioInterno.beforeCreate(async (usuario) => {
  if (usuario.PasswordHash) {
    const salt = await bcrypt.genSalt(10);
    usuario.PasswordHash = await bcrypt.hash(usuario.PasswordHash, salt);
  }
});

// Método para validar password
UsuarioInterno.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.PasswordHash);
};

module.exports = UsuarioInterno;