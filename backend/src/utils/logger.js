const Log = require('../models/Log'); // Importa el modelo de Mongoose

const registrarLog = async (logData) => {
  try {
    const nuevoLog = new Log(logData);
    await nuevoLog.save();
  } catch (error) {
    // ¿Qué hacer si el log falla?
    // Por ahora, solo lo mostramos en consola. No detenemos la operación principal.
    console.error("Error al registrar el log:", error.message);
  }
};

module.exports = { registrarLog };