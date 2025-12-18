const express = require('express');
const router = express.Router();
const { getServicios, getServiciosPorVehiculo } = require('../controllers/serviciosController');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.get('/', verifyToken, getServicios);
router.get('/vehiculo/:tipo', verifyToken, getServiciosPorVehiculo);

module.exports = router;