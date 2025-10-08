const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas del dashboard requieren token
router.use(verificarToken);

// Ruta para obtener las estadísticas
router.get('/stats', dashboardController.getStats);
router.get('/activity', dashboardController.getMonthlyActivity);
module.exports = router;