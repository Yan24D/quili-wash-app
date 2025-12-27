const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');
const { initDatabase } = require('./scripts/initDatabase');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const lavadoresRoutes = require('./routes/lavadoresRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const registrosRoutes = require('./routes/registrosRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Quili Wash funcionando correctamente' });
});

// Ruta para verificar conexión a BD
app.get('/test-db', async (req, res) => {
  const connected = await testConnection();
  if (connected) {
    res.json({ message: 'Conexión a base de datos exitosa' });
  } else {
    res.status(500).json({ message: 'Error al conectar con la base de datos' });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/lavadores', lavadoresRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/registros', registrosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Accesible en todas las interfaces de red`);
  
  // Probar conexión
  await testConnection();
  
  // Inicializar base de datos
  try {
    await initDatabase();
    console.log('🎉 Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
  }
});