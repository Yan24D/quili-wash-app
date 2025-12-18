const { pool } = require('../config/database');

// Obtener todos los servicios activos
const getServicios = async (req, res) => {
  try {
    const [servicios] = await pool.query(
      'SELECT id, nombre, descripcion FROM servicios ORDER BY nombre ASC'
    );

    res.json({ servicios });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener servicios con precios por tipo de vehículo
const getServiciosPorVehiculo = async (req, res) => {
  try {
    const { tipo } = req.params; // motorcycle, car, pickup, truck

    const [servicios] = await pool.query(
      `SELECT 
        s.id,
        s.nombre,
        s.descripcion,
        sp.precio
      FROM servicios s
      INNER JOIN servicio_precios sp ON s.id = sp.id_servicio
      WHERE sp.tipo_vehiculo = ? AND sp.activo = 1
      ORDER BY sp.precio ASC`,
      [tipo]
    );

    res.json({ servicios });

  } catch (error) {
    console.error('Error al obtener servicios por vehículo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { getServicios, getServiciosPorVehiculo };