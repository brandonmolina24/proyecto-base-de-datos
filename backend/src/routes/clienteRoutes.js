const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(verificarToken);

router.get('/', clienteController.listar);
router.post('/', verificarRol('Admin', 'Analista'), clienteController.crear);
router.get('/:id', clienteController.obtenerPorId);
router.put('/:id', verificarRol('Admin', 'Analista'), clienteController.actualizar);

module.exports = router;
