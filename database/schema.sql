-- Crear base de datos
CREATE DATABASE IF NOT EXISTS registro_clientes;
USE registro_clientes;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  usuario VARCHAR(100),
  contraseña VARCHAR(255),
  metodo_registro ENUM('manual', 'google', 'apple', 'facebook') NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para optimizar búsquedas
CREATE INDEX idx_dni ON clientes(dni);
CREATE INDEX idx_usuario ON clientes(usuario);
CREATE INDEX idx_fecha_registro ON clientes(fecha_registro);

-- Tabla de sesiones (opcional, para mejor control)
CREATE TABLE IF NOT EXISTS sesiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cliente_id ON sesiones(cliente_id);
CREATE INDEX idx_token ON sesiones(token);
