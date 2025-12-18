const express = require('express');
const router = express.Router();
const { getLavadores, getComisionesPorLavador } = require('../controllers/lavadoresController');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.get('/', verifyToken, getLavadores);

// ✅ NUEVA RUTA: Obtener comisiones por lavador
router.get('/comisiones', verifyToken, getComisionesPorLavador);

module.exports = router;