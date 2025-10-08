const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(verificarToken);
router.get('/', prestamoController.listar);
router.get('/:id', prestamoController.obtenerPorId);
router.patch('/:id/desembolsar', verificarRol('Admin', 'Cartera'), prestamoController.desembolsar);
module.exports = router;