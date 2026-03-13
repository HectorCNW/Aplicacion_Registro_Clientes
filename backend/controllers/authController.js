const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');

// Registrar nuevo cliente
exports.register = async (req, res) => {
  try {
    const { dni, nombre, apellidos, telefono, usuario, contraseña, metodo } = req.body;

    // Validaciones básicas
    if (!dni || !nombre || !apellidos || !telefono) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    // Verificar que el DNI sea único
    const [existingUser] = await pool.execute('SELECT * FROM clientes WHERE dni = ?', [dni]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }

    // Hash de contraseña si es registro manual
    let passwordHash = null;
    if (metodo === 'manual' && contraseña) {
      passwordHash = await bcrypt.hash(contraseña, 10);
    }

    // Insertar cliente
    const [result] = await pool.execute(
      'INSERT INTO clientes (dni, nombre, apellidos, telefono, usuario, contraseña, metodo_registro, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [dni, nombre, apellidos, telefono, usuario || null, passwordHash, metodo]
    );

    // Generar token JWT
    const token = jwt.sign(
      { clienteId: result.insertId, dni: dni },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      token: token,
      clienteId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar cliente', details: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const [clients] = await pool.execute('SELECT * FROM clientes WHERE usuario = ?', [usuario]);

    if (clients.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const client = clients[0];
    const validPassword = await bcrypt.compare(contraseña, client.contraseña);

    if (!validPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { clienteId: client.id, dni: client.dni },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token: token,
      clienteId: client.id,
      nombre: client.nombre
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login', details: error.message });
  }
};

// Verificar DNI único
exports.verifyDNI = async (req, res) => {
  try {
    const { dni } = req.body;

    if (!dni) {
      return res.status(400).json({ error: 'DNI es requerido' });
    }

    const [clients] = await pool.execute('SELECT id FROM clientes WHERE dni = ?', [dni]);

    if (clients.length > 0) {
      return res.status(400).json({ error: 'El DNI ya está registrado', exists: true });
    }

    res.json({ message: 'DNI disponible', exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar DNI', details: error.message });
  }
};

// Completar datos (para OAuth sin ciertos campos)
exports.completeData = async (req, res) => {
  try {
    const { clienteId, dni, nombre, apellidos, telefono } = req.body;

    if (!clienteId || !dni || !nombre || !apellidos || !telefono) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const [result] = await pool.execute(
      'UPDATE clientes SET dni = ?, nombre = ?, apellidos = ?, telefono = ? WHERE id = ?',
      [dni, nombre, apellidos, telefono, clienteId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Datos completados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al completar datos', details: error.message });
  }
};
