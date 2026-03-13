const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Sin contraseña
      database: 'registro_clientes'
    });

    console.log('✅ Conexión exitosa a MySQL');
    
    const [rows] = await connection.execute('SELECT id,dni,nombre,usuario FROM clientes');
    console.log('✅ Clientes en BD:', rows);
    
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Código:', error.code);
  }
}

testConnection();
