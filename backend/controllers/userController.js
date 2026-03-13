const pool = require('../database');

// Obtener información del usuario
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute('SELECT id, dni, nombre, apellidos, telefono, usuario, metodo_registro, fecha_registro FROM clientes WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

// Actualizar información del usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, telefono } = req.body;

    const [result] = await pool.execute(
      'UPDATE clientes SET nombre = ?, apellidos = ?, telefono = ? WHERE id = ?',
      [nombre, apellidos, telefono, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
};
