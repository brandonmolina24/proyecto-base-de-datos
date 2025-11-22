const mongoose = require('mongoose');
require('dotenv').config();

// Actualiza tu .env con una variable MONGO_URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/plataforma_pyme_logs';

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    // He usado el mensaje de log que te di originalmente
    console.log('✅ Conexión a MongoDB establecida'); 
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// --- CORRECCIÓN ---
// Exporta la función directamente, no un objeto
module.exports = connectMongo;