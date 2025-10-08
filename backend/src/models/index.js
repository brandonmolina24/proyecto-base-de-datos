const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const UsuarioInterno = require('./UsuarioInterno');
const SolicitudCredito = require('./SolicitudCredito');
const Prestamo = require('./Prestamo');
const Pago = require('./Pago');

// Definir relaciones
Cliente.hasMany(SolicitudCredito, { foreignKey: 'ClienteID' });
SolicitudCredito.belongsTo(Cliente, { foreignKey: 'ClienteID' });

UsuarioInterno.hasMany(SolicitudCredito, { foreignKey: 'UsuarioAsignado' });
SolicitudCredito.belongsTo(UsuarioInterno, { foreignKey: 'UsuarioAsignado', as: 'Analista' });

SolicitudCredito.hasOne(Prestamo, { foreignKey: 'SolicitudID' });
Prestamo.belongsTo(SolicitudCredito, { foreignKey: 'SolicitudID' });

Prestamo.hasMany(Pago, { foreignKey: 'PrestamoID' });
Pago.belongsTo(Prestamo, { foreignKey: 'PrestamoID' });

module.exports = {
  sequelize,
  Cliente,
  UsuarioInterno,
  SolicitudCredito,
  Prestamo,
  Pago,
};