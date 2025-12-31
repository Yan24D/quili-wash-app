const { pool } = require('../config/database');

// Función para obtener fecha/hora en zona horaria de Colombia (UTC-5)
const obtenerFechaHoraColombia = () => {
  const ahora = new Date();
  // Ajustar a UTC-5 (Colombia)
  const offsetColombia = -5 * 60; // minutos
  const offsetActual = ahora.getTimezoneOffset(); // minutos
  const diferencia = offsetColombia - offsetActual;
  
  ahora.setMinutes(ahora.getMinutes() + diferencia);
  
  const fecha = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
  const hora = ahora.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
  
  return { fecha, hora };
};

// Crear un nuevo registro
const crearRegistro = async (req, res) => {
  try {
    const {
      vehiculo,
      placa,
      id_servicio,
      costo,
      porcentaje,
      id_lavador,
      observaciones,
      pago
    } = req.body;

    const id_usuario = req.user.id; // Del token JWT

    // Validaciones básicas
    if (!vehiculo || !id_servicio || !costo || !porcentaje || !id_lavador) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios' 
      });
    }

    // Obtener el nombre del lavador
    const [lavadorResult] = await pool.query(
      'SELECT CONCAT(nombre, " ", apellido) as nombre_completo FROM lavadores WHERE id = ?',
      [id_lavador]
    );

    const lavador = lavadorResult.length > 0 ? lavadorResult[0].nombre_completo : null;

    // Obtener fecha y hora en zona horaria de Colombia
    const { fecha, hora } = obtenerFechaHoraColombia();

    // Insertar registro
    const [result] = await pool.query(
      `INSERT INTO registros 
      (fecha, hora, vehiculo, placa, id_servicio, costo, porcentaje, lavador, id_lavador, observaciones, pago, id_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha, hora, vehiculo, placa || null, id_servicio, costo, porcentaje, lavador, id_lavador, observaciones || null, pago || 'Pendiente', id_usuario]
    );

    res.status(201).json({
      message: 'Registro creado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener historial de registros
const getRegistros = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, placa } = req.query;

    let query = `
      SELECT 
        r.id,
        r.fecha,
        r.hora,
        r.vehiculo,
        CASE r.vehiculo
          WHEN 'car' THEN 'Automóvil'
          WHEN 'pickup' THEN 'Camioneta'
          WHEN 'motorcycle' THEN 'Motocicleta'
          WHEN 'truck' THEN 'Camión'
          ELSE r.vehiculo
        END as vehiculo_nombre,
        r.placa,
        r.id_servicio,
        s.nombre as servicio_nombre,
        r.costo,
        r.porcentaje,
        r.id_lavador,
        r.lavador,
        r.observaciones,
        r.pago
      FROM registros r
      LEFT JOIN servicios s ON r.id_servicio = s.id
      WHERE 1=1
    `;

    const params = [];

    // Filtros opcionales
    if (fecha_inicio && fecha_fin) {
      query += ' AND r.fecha BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    }

    if (placa) {
      query += ' AND r.placa LIKE ?';
      params.push(`%${placa}%`);
    }

    query += ' ORDER BY r.fecha DESC, r.hora DESC LIMIT 100';

    const [registros] = await pool.query(query, params);

    res.json({ registros });

  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ACTUALIZADO: Obtener estadísticas para cierre de caja - SOLO SERVICIOS PAGADOS
const getCierreCaja = async (req, res) => {
  try {
    let { fecha } = req.query;
    
    // Si no viene fecha, usar la fecha actual en zona horaria de Colombia
    if (!fecha) {
      const { fecha: fechaColombia } = obtenerFechaHoraColombia();
      fecha = fechaColombia;
    }

    console.log('📅 Consultando cierre de caja para fecha:', fecha);

    // Ingresos totales del día - SOLO PAGADOS
    const [ingresos] = await pool.query(
      'SELECT COALESCE(SUM(costo), 0) as total FROM registros WHERE fecha = ? AND pago = "Pagado"',
      [fecha]
    );

    // Comisiones pagadas - SOLO PAGADOS
    const [comisiones] = await pool.query(
      'SELECT COALESCE(SUM(costo * porcentaje / 100), 0) as total FROM registros WHERE fecha = ? AND pago = "Pagado"',
      [fecha]
    );

    // Cantidad de servicios - SOLO PAGADOS
    const [servicios] = await pool.query(
      'SELECT COUNT(*) as total FROM registros WHERE fecha = ? AND pago = "Pagado"',
      [fecha]
    );

    // Total de servicios pendientes
    const [pendientes] = await pool.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(costo), 0) as monto FROM registros WHERE fecha = ? AND pago = "Pendiente"',
      [fecha]
    );

    const ingresoTotal = parseFloat(ingresos[0].total);
    const comisionTotal = parseFloat(comisiones[0].total);
    const gananciaNetaTotal = ingresoTotal - comisionTotal;
    const cantidadServicios = servicios[0].total;
    const cantidadPendientes = pendientes[0].total;
    const montoPendiente = parseFloat(pendientes[0].monto);

    const promedioServicio = cantidadServicios > 0 ? ingresoTotal / cantidadServicios : 0;

    res.json({
      fecha,
      ingresos_totales: ingresoTotal,
      comisiones_pagadas: comisionTotal,
      ganancia_neta: gananciaNetaTotal,
      cantidad_servicios: cantidadServicios,
      promedio_por_servicio: promedioServicio,
      servicios_pendientes: cantidadPendientes,
      monto_pendiente: montoPendiente
    });

  } catch (error) {
    console.error('Error al obtener cierre de caja:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar un registro - soporta cambiar servicio y lavador
const actualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehiculo,
      placa,
      id_servicio,
      costo,
      porcentaje,
      id_lavador,
      lavador,
      observaciones,
      pago
    } = req.body;

    // Validaciones básicas
    if (!costo || !porcentaje) {
      return res.status(400).json({ 
        message: 'Costo y porcentaje son obligatorios' 
      });
    }

    // Verificar que el registro existe
    const [registroExistente] = await pool.query(
      'SELECT * FROM registros WHERE id = ?',
      [id]
    );

    if (registroExistente.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Preparar campos a actualizar
    let updateFields = [];
    let updateValues = [];

    // Campos básicos
    if (vehiculo !== undefined) {
      updateFields.push('vehiculo = ?');
      updateValues.push(vehiculo);
    }
    
    if (placa !== undefined) {
      updateFields.push('placa = ?');
      updateValues.push(placa || null);
    }

    updateFields.push('costo = ?');
    updateValues.push(costo);

    updateFields.push('porcentaje = ?');
    updateValues.push(porcentaje);

    if (observaciones !== undefined) {
      updateFields.push('observaciones = ?');
      updateValues.push(observaciones || null);
    }

    updateFields.push('pago = ?');
    updateValues.push(pago);

    // Si se proporciona un nuevo servicio, actualizarlo
    if (id_servicio !== undefined && id_servicio !== null) {
      updateFields.push('id_servicio = ?');
      updateValues.push(id_servicio);
    }

    // Si se proporciona un nuevo lavador, actualizarlo
    if (id_lavador !== undefined && id_lavador !== null) {
      updateFields.push('id_lavador = ?');
      updateValues.push(id_lavador);

      // Obtener el nombre completo del lavador
      const [lavadorResult] = await pool.query(
        'SELECT CONCAT(nombre, " ", apellido) as nombre_completo FROM lavadores WHERE id = ?',
        [id_lavador]
      );

      if (lavadorResult.length > 0) {
        updateFields.push('lavador = ?');
        updateValues.push(lavadorResult[0].nombre_completo);
      }
    } else if (lavador !== undefined) {
      // Si se proporciona el nombre del lavador directamente
      updateFields.push('lavador = ?');
      updateValues.push(lavador);
    }

    // Agregar el ID al final de los valores
    updateValues.push(id);

    // Construir y ejecutar la query
    const updateQuery = `UPDATE registros SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await pool.query(updateQuery, updateValues);

    res.json({ message: 'Registro actualizado exitosamente' });

  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un registro
const eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el registro existe
    const [registroExistente] = await pool.query(
      'SELECT * FROM registros WHERE id = ?',
      [id]
    );

    if (registroExistente.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Eliminar registro
    await pool.query('DELETE FROM registros WHERE id = ?', [id]);

    res.json({ message: 'Registro eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { 
  crearRegistro, 
  getRegistros, 
  getCierreCaja,
  actualizarRegistro,
  eliminarRegistro
};