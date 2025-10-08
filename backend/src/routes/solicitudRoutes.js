const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(verificarToken);

router.post('/', solicitudController.crear);
router.get('/', solicitudController.listar);
router.get('/:id', solicitudController.obtenerPorId);

router.patch('/:id/estado', verificarRol('Analista', 'Admin'), solicitudController.actualizarEstado);
module.exports = router;
