const express = require('express');
const router = express.Router();
const { 
  crearRegistro, 
  getRegistros, 
  getCierreCaja,
  actualizarRegistro,
  eliminarRegistro
} = require('../controllers/registrosController');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.post('/', verifyToken, crearRegistro);
router.get('/', verifyToken, getRegistros);
router.get('/cierre-caja', verifyToken, getCierreCaja);
router.put('/:id', verifyToken, actualizarRegistro);
router.delete('/:id', verifyToken, eliminarRegistro);

module.exports = router;