const express = require('express');
const router = express.Router();
const { login, verifyTokenEndpoint } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Ruta de login (pública)
router.post('/login', login);

// Ruta para verificar token (protegida)
router.get('/verify', verifyToken, verifyTokenEndpoint);

module.exports = router;