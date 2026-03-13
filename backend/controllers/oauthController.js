const jwt = require('jsonwebtoken');
const pool = require('../database');
const { OAuth2Client } = require('google-auth-library');

// Inicializar cliente de Google OAuth
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
);

// Verificar y procesar token de Google
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de Google es requerido' });
    }

    // Verificar el token con Google
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
      });
    } catch (error) {
      // En desarrollo, aceptar tokens mock
      console.warn('Token de Google no verificable en desarrollo, usando datos del token');
    }

    // Extraer datos del payload
    const payload = ticket ? ticket.getPayload() : extractMockPayload(token);
    
    if (!payload) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || 'Usuario Google';

    // Buscar o crear usuario por email
    const [existingUser] = await pool.execute(
      'SELECT * FROM clientes WHERE email = ?',
      [email]
    );

    let clienteId;
    let isNewUser = false;

    if (existingUser.length > 0) {
      // Usuario existe
      clienteId = existingUser[0].id;
    } else {
      // Crear nuevo usuario
      // Parsear nombre
      const nameParts = name.split(' ');
      const nombre = nameParts[0];
      const apellidos = nameParts.slice(1).join(' ') || 'Google';

      const [result] = await pool.execute(
        'INSERT INTO clientes (nombre, apellidos, email, metodo_registro, fecha_registro) VALUES (?, ?, ?, ?, NOW())',
        [nombre, apellidos, email, 'google']
      );
      clienteId = result.insertId;
      isNewUser = true;
    }

    // Generar token JWT
    const jwtToken = jwt.sign(
      { clienteId: clienteId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: isNewUser ? 'Usuario registrado con Google' : 'Autenticado con Google',
      token: jwtToken,
      clienteId: clienteId,
      nombre: nombre,
      email: email,
      isNewUser: isNewUser,
      provider: 'google'
    });

  } catch (error) {
    console.error('Error verificando token de Google:', error);
    res.status(500).json({ 
      error: 'Error al procesar autenticación de Google',
      details: error.message 
    });
  }
};

// Función auxiliar para extraer payload de token mock
function extractMockPayload(token) {
  try {
    // En desarrollo, intentar decodificar el token mock
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Mock Google OAuth - Simular flujo de autenticación
exports.googleAuth = async (req, res) => {
  try {
    const { dni, nombre, apellidos, telefono, email } = req.body;

    // Validar datos mínimos
    if (!dni || !nombre || !apellidos || !telefono) {
      return res.status(400).json({ 
        error: 'Datos incompletos para registro con Google',
        requiredFields: ['dni', 'nombre', 'apellidos', 'telefono']
      });
    }

    // Verificar si el DNI ya existe
    const [existingUser] = await pool.execute(
      'SELECT id FROM clientes WHERE dni = ?',
      [dni]
    );

    let clienteId;

    if (existingUser.length > 0) {
      // Usuario existe, retornar error (DNI único)
      return res.status(400).json({ 
        error: 'Este DNI ya está registrado en el sistema'
      });
    } else {
      // Crear nuevo usuario con método Google
      const [result] = await pool.execute(
        'INSERT INTO clientes (dni, nombre, apellidos, telefono, email, metodo_registro, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [dni, nombre, apellidos, telefono, email || null, 'google']
      );
      clienteId = result.insertId;
    }

    // Generar token JWT
    const token = jwt.sign(
      { clienteId: clienteId, dni: dni },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar token y datos del cliente
    res.json({
      success: true,
      message: 'Cliente registrado con Google exitosamente',
      token: token,
      clienteId: clienteId,
      nombre: nombre,
      provider: 'google'
    });

  } catch (error) {
    console.error('Error en Google OAuth:', error);
    res.status(500).json({ 
      error: 'Error al procesar registro con Google',
      details: error.message 
    });
  }
};

// Health check para OAuth
exports.oauthStatus = async (req, res) => {
  res.json({
    message: 'Google OAuth server',
    provider: 'google',
    mode: process.env.NODE_ENV || 'development'
  });
};

// Verificar y procesar token de Facebook
exports.verifyFacebookToken = async (req, res) => {
  try {
    const { token, userID } = req.body;

    if (!token || !userID) {
      return res.status(400).json({ error: 'Token y userID de Facebook son requeridos' });
    }

    // En producción, verificar el token con Facebook Graph API
    // Para desarrollo, aceptar el token directamente
    // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`);
    // const userData = await response.json();

    // Mock: Simular datos de Facebook
    const facebookId = userID;
    const email = `facebook_${userID}@facebook.com`; // Placeholder - en producción venir de Facebook

    // Buscar o crear usuario por Facebook ID
    const [existingUser] = await pool.execute(
      'SELECT * FROM clientes WHERE metodo_registro = ? AND email = ?',
      ['facebook', email]
    );

    let clienteId;
    let nombre = 'Facebook User';
    let isNewUser = false;

    if (existingUser.length > 0) {
      // Usuario existe
      clienteId = existingUser[0].id;
      nombre = existingUser[0].nombre;
    } else {
      // Crear nuevo usuario con método Facebook
      const [result] = await pool.execute(
        'INSERT INTO clientes (nombre, email, metodo_registro, fecha_registro) VALUES (?, ?, ?, NOW())',
        [nombre, email, 'facebook']
      );
      clienteId = result.insertId;
      isNewUser = true;
    }

    // Generar token JWT
    const jwtToken = jwt.sign(
      { clienteId: clienteId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: isNewUser ? 'Usuario registrado con Facebook' : 'Autenticado con Facebook',
      token: jwtToken,
      clienteId: clienteId,
      nombre: nombre,
      email: email,
      isNewUser: isNewUser,
      provider: 'facebook'
    });

  } catch (error) {
    console.error('Error verificando token de Facebook:', error);
    res.status(500).json({ 
      error: 'Error al procesar autenticación de Facebook',
      details: error.message 
    });
  }
};

// Verificar y procesar token de Apple
exports.verifyAppleToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de Apple es requerido' });
    }

    // En producción, verificar el token con Apple
    // Para desarrollo, aceptar el token directamente
    
    // Mock: Extraer datos del token
    const appleId = 'apple_user_' + Math.random().toString(36);
    const email = `apple_${appleId}@apple.com`; // Placeholder - en producción venir de Apple
    const nombre = 'Apple User';

    // Buscar o crear usuario por Apple ID
    const [existingUser] = await pool.execute(
      'SELECT * FROM clientes WHERE metodo_registro = ? AND email = ?',
      ['apple', email]
    );

    let clienteId;
    let isNewUser = false;

    if (existingUser.length > 0) {
      // Usuario existe
      clienteId = existingUser[0].id;
    } else {
      // Crear nuevo usuario con método Apple
      const [result] = await pool.execute(
        'INSERT INTO clientes (nombre, email, metodo_registro, fecha_registro) VALUES (?, ?, ?, NOW())',
        [nombre, email, 'apple']
      );
      clienteId = result.insertId;
      isNewUser = true;
    }

    // Generar token JWT
    const jwtToken = jwt.sign(
      { clienteId: clienteId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: isNewUser ? 'Usuario registrado con Apple' : 'Autenticado con Apple',
      token: jwtToken,
      clienteId: clienteId,
      nombre: nombre,
      email: email,
      isNewUser: isNewUser,
      provider: 'apple'
    });

  } catch (error) {
    console.error('Error verificando token de Apple:', error);
    res.status(500).json({ 
      error: 'Error al procesar autenticación de Apple',
      details: error.message 
    });
  }
};


