const { pool } = require('../config/database');

// Obtener todos los lavadores activos
const getLavadores = async (req, res) => {
  try {
    const [lavadores] = await pool.query(
      'SELECT id, nombre, apellido FROM lavadores WHERE activo = 1 ORDER BY nombre ASC'
    );

    res.json({ lavadores });

  } catch (error) {
    console.error('Error al obtener lavadores:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// ✅ NUEVA FUNCIÓN - Agregar después de getLavadores
const getComisionesPorLavador = async (req, res) => {
  try {
    let { fecha } = req.query;
    
    if (!fecha) {
      const ahora = new Date();
      ahora.setHours(ahora.getHours() - 5);
      fecha = ahora.toISOString().split('T')[0];
    }

    console.log('📅 Consultando comisiones por lavador para fecha:', fecha);

    const [comisiones] = await pool.query(
      `SELECT 
        r.id_lavador,
        r.lavador,
        COUNT(*) as cantidad_servicios,
        SUM(r.costo) as total_servicios,
        SUM(r.costo * r.porcentaje / 100) as total_comision,
        AVG(r.porcentaje) as porcentaje_promedio
      FROM registros r
      WHERE r.fecha = ? AND r.pago = 'Pagado'
      GROUP BY r.id_lavador, r.lavador
      ORDER BY total_comision DESC`,
      [fecha]
    );

    const totales = comisiones.reduce((acc, lavador) => ({
      servicios: acc.servicios + lavador.cantidad_servicios,
      comisiones: acc.comisiones + parseFloat(lavador.total_comision)
    }), { servicios: 0, comisiones: 0 });

    res.json({
      fecha,
      lavadores: comisiones.map(c => ({
        id_lavador: c.id_lavador,
        nombre: c.lavador,
        cantidad_servicios: c.cantidad_servicios,
        total_servicios: parseFloat(c.total_servicios),
        total_comision: parseFloat(c.total_comision),
        porcentaje_promedio: parseFloat(c.porcentaje_promedio)
      })),
      totales
    });

  } catch (error) {
    console.error('Error al obtener comisiones por lavador:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { 
  getLavadores,
  getComisionesPorLavador 
};