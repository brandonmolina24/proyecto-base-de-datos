const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(verificarToken);

// Solo Admin o Cartera pueden crear pagos
router.post('/', verificarRol('Admin', 'Cartera'), pagoController.crear);

module.exports = router;