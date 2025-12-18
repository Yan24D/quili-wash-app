const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// LOGIN
const login = async (req, res) => {
  try {
    console.log('📨 Petición de login recibida');
    console.log('Body:', req.body);

    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
      console.log('❌ Faltan datos');
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    console.log('🔍 Buscando usuario:', email);

    // Buscar usuario en la BD
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
      [email]
    );

    console.log('👤 Usuarios encontrados:', users.length);

    if (users.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('✅ Usuario encontrado:', user.nombre);

    // Verificar contraseña
    console.log('🔐 Verificando contraseña...');
    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log('🔐 Contraseña válida:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('🎟️ Generando token...');

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        nombre: user.nombre,
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generado exitosamente');

    // Responder con el token y datos del usuario
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

    console.log('✅ Respuesta enviada al cliente');

  } catch (error) {
    console.error('💥 ERROR EN LOGIN:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// VERIFICAR TOKEN (para mantener sesión)
const verifyTokenEndpoint = async (req, res) => {
  try {
    const { id } = req.user;

    const [users] = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND activo = 1',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, verifyTokenEndpoint };