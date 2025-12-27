const { pool } = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Verificando estructura de la base de datos...');

    // Crear tabla usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'secretario') DEFAULT 'secretario',
        activo TINYINT(1) DEFAULT 1,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla lavadores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lavadores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        activo TINYINT(1) DEFAULT 1,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla servicios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS servicios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        tipo_vehiculo ENUM('car', 'motorcycle', 'pickup', 'truck') NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        activo TINYINT(1) DEFAULT 1,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla registros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registros (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        vehiculo ENUM('car', 'motorcycle', 'pickup', 'truck') NOT NULL,
        placa VARCHAR(20),
        id_servicio INT NOT NULL,
        costo DECIMAL(10,2) NOT NULL,
        porcentaje DECIMAL(5,2) NOT NULL,
        id_lavador INT NOT NULL,
        lavador VARCHAR(200) NOT NULL,
        observaciones TEXT,
        pago ENUM('Pendiente', 'Pagado') DEFAULT 'Pendiente',
        id_usuario INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_servicio) REFERENCES servicios(id),
        FOREIGN KEY (id_lavador) REFERENCES lavadores(id),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
      )
    `);

    console.log('✅ Estructura de tablas verificada');

    // Verificar si hay datos iniciales
    const [usuarios] = await pool.query('SELECT COUNT(*) as count FROM usuarios');
    
    if (usuarios[0].count === 0) {
      console.log('📝 Insertando datos iniciales...');

      // Insertar usuario admin (password: admin123)
      await pool.query(`
        INSERT INTO usuarios (nombre, email, password, rol) VALUES
        ('Admin', 'admin@quiliwash.com', '$2a$10$YvN8qJ5vZ8mK.WxYzJ9fJ3eLmQXJxK8vZ8mK.WxYzJ9fJ3eLmQXJxK', 'admin')
      `);

      // Insertar lavadores
      await pool.query(`
        INSERT INTO lavadores (nombre, apellido) VALUES
        ('Juan', 'Pérez'),
        ('María', 'García'),
        ('Carlos', 'López')
      `);

      // Insertar servicios para automóviles
      await pool.query(`
        INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio) VALUES
        ('Lavado Básico Auto', 'Lavado exterior del automóvil', 'car', 15000),
        ('Lavado Premium Auto', 'Lavado exterior + interior + encerado', 'car', 30000),
        ('Lavado Completo Auto', 'Lavado premium + aspirado + motor', 'car', 45000)
      `);

      // Insertar servicios para motocicletas
      await pool.query(`
        INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio) VALUES
        ('Lavado Básico Moto', 'Lavado exterior de la motocicleta', 'motorcycle', 8000),
        ('Lavado Premium Moto', 'Lavado completo + encerado', 'motorcycle', 15000)
      `);

      // Insertar servicios para camionetas
      await pool.query(`
        INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio) VALUES
        ('Lavado Básico Camioneta', 'Lavado exterior de la camioneta', 'pickup', 20000),
        ('Lavado Premium Camioneta', 'Lavado exterior + interior + encerado', 'pickup', 40000),
        ('Lavado Completo Camioneta', 'Lavado premium + aspirado + motor', 'pickup', 60000)
      `);

      // Insertar servicios para camiones
      await pool.query(`
        INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio) VALUES
        ('Lavado Básico Camión', 'Lavado exterior del camión', 'truck', 30000),
        ('Lavado Premium Camión', 'Lavado completo + encerado', 'truck', 50000)
      `);

      console.log('✅ Datos iniciales insertados correctamente');
    } else {
      console.log('✅ Base de datos ya contiene datos');
    }

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

module.exports = { initDatabase };
