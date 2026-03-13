const mysql = require('mysql2/promise');
require('dotenv').config();

// Valores hardcodeados para diagnóstico
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD === undefined ? '' : (process.env.DB_PASSWORD === '' ? '' : process.env.DB_PASSWORD);
const DB_NAME = process.env.DB_NAME || 'registro_clientes';

console.log('DB Config - FINAL:', {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD === '' ? 'VACIO/EMPTY' : DB_PASSWORD,
  database: DB_NAME,
  passwordType: typeof DB_PASSWORD
});

// Pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
