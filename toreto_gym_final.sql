-- =========================================================
-- SCRIPT SQL FINAL - TORETO GYM
-- Base de datos: MySQL / XAMPP
-- =========================================================

DROP DATABASE IF EXISTS toreto_gym;
CREATE DATABASE toreto_gym CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE toreto_gym;

-- =========================================================
-- TABLA: usuarios
-- =========================================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('ADMINISTRADOR','RECEPCIONISTA','ENTRENADOR') NOT NULL DEFAULT 'ADMINISTRADOR',
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: clientes
-- =========================================================
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  dni VARCHAR(8) NOT NULL UNIQUE,
  telefono VARCHAR(9),
  correo VARCHAR(120),
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: membresias
-- =========================================================
CREATE TABLE membresias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  duracion VARCHAR(50) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: cliente_membresias
-- =========================================================
CREATE TABLE cliente_membresias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  membresia_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('ACTIVO','VENCIDO','SUSPENDIDO') NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_cliente_membresias_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_cliente_membresias_membresia
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =========================================================
-- TABLA: pagos
-- =========================================================
CREATE TABLE pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  membresia_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('EFECTIVO','YAPE','PLIN','TARJETA','TRANSFERENCIA') NOT NULL DEFAULT 'EFECTIVO',
  fecha_pago DATE NOT NULL,
  estado ENUM('PAGADO','PENDIENTE','ANULADO') NOT NULL DEFAULT 'PAGADO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_pagos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_pagos_membresia
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =========================================================
-- TABLA: asistencias
-- =========================================================
CREATE TABLE asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora_ingreso TIME,
  hora_salida TIME,
  estado ENUM('VALIDO','DENEGADO') NOT NULL DEFAULT 'VALIDO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_asistencias_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================================================
-- TABLA: rutinas
-- =========================================================
CREATE TABLE rutinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  grupo_muscular VARCHAR(80) NOT NULL,
  series INT NOT NULL,
  repeticiones INT NOT NULL,
  nivel ENUM('PRINCIPIANTE','INTERMEDIO','AVANZADO') NOT NULL DEFAULT 'PRINCIPIANTE',
  duracion VARCHAR(50) NOT NULL,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: notificaciones
-- =========================================================
CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NULL,
  titulo VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo ENUM('MEMBRESIA_VENCIDA','POR_VENCER','SISTEMA') NOT NULL DEFAULT 'SISTEMA',
  estado ENUM('NO_LEIDO','LEIDO') NOT NULL DEFAULT 'NO_LEIDO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_notificaciones_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================================================
-- ÍNDICES
-- =========================================================
CREATE INDEX idx_clientes_dni ON clientes(dni);
CREATE INDEX idx_clientes_estado ON clientes(estado);

CREATE INDEX idx_cliente_membresias_cliente ON cliente_membresias(cliente_id);
CREATE INDEX idx_cliente_membresias_estado ON cliente_membresias(estado);
CREATE INDEX idx_cliente_membresias_fechas ON cliente_membresias(fecha_inicio, fecha_fin);

CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_pagos_estado ON pagos(estado);

CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_asistencias_cliente_fecha ON asistencias(cliente_id, fecha);

CREATE INDEX idx_notificaciones_estado ON notificaciones(estado);

-- =========================================================
-- DATOS INICIALES
-- NOTA: passwords de ejemplo en texto plano solo para pruebas locales.
-- Recomendado: usar bcrypt en producción.
-- =========================================================

INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES
('Administrador', 'admin@toreto.com', '123', 'ADMINISTRADOR', 'ACTIVO'),
('Recepcionista', 'recepcion@toreto.com', '123', 'RECEPCIONISTA', 'ACTIVO'),
('Entrenador', 'entrenador@toreto.com', '123', 'ENTRENADOR', 'ACTIVO');

INSERT INTO clientes (nombre, dni, telefono, correo, estado) VALUES
('Juan Perez', '12345678', '987654321', 'juan@gmail.com', 'ACTIVO'),
('Maria Torres', '87654321', '912345678', 'maria@gmail.com', 'ACTIVO'),
('Carlos Ramirez', '11223344', '923456789', 'carlos@gmail.com', 'ACTIVO');

INSERT INTO membresias (nombre, duracion, precio, descripcion, estado) VALUES
('Plan Diario', '1 día', 8.00, 'Acceso por un día al gimnasio.', 'ACTIVO'),
('Plan Semanal', '7 días', 25.00, 'Acceso semanal a máquinas y cardio.', 'ACTIVO'),
('Plan Mensual', '30 días', 80.00, 'Acceso mensual completo.', 'ACTIVO'),
('Plan Trimestral', '90 días', 210.00, 'Plan de tres meses con mejor precio.', 'ACTIVO'),
('Plan Anual', '365 días', 750.00, 'Acceso anual completo al gimnasio.', 'ACTIVO');

INSERT INTO cliente_membresias (cliente_id, membresia_id, fecha_inicio, fecha_fin, estado) VALUES
(1, 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ACTIVO'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'VENCIDO'),
(3, 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'ACTIVO');

INSERT INTO pagos (cliente_id, membresia_id, monto, metodo_pago, fecha_pago, estado) VALUES
(1, 3, 80.00, 'EFECTIVO', CURDATE(), 'PAGADO'),
(2, 2, 25.00, 'YAPE', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'PAGADO'),
(3, 3, 80.00, 'PLIN', CURDATE(), 'PAGADO');

INSERT INTO asistencias (cliente_id, fecha, hora_ingreso, hora_salida, estado) VALUES
(1, CURDATE(), CURTIME(), NULL, 'VALIDO'),
(2, CURDATE(), CURTIME(), NULL, 'DENEGADO');

INSERT INTO rutinas (nombre, grupo_muscular, series, repeticiones, nivel, duracion, estado) VALUES
('Pecho básico', 'Pecho', 4, 12, 'PRINCIPIANTE', '45 min', 'ACTIVO'),
('Espalda fuerza', 'Espalda', 4, 10, 'INTERMEDIO', '50 min', 'ACTIVO'),
('Piernas completas', 'Piernas', 5, 12, 'AVANZADO', '60 min', 'ACTIVO'),
('Abdomen definido', 'Abdomen', 4, 20, 'PRINCIPIANTE', '30 min', 'ACTIVO');

INSERT INTO notificaciones (cliente_id, titulo, mensaje, tipo, estado) VALUES
(2, 'Membresía vencida', 'La membresía del cliente Maria Torres se encuentra vencida.', 'MEMBRESIA_VENCIDA', 'NO_LEIDO'),
(3, 'Membresía por vencer', 'La membresía del cliente Carlos Ramirez está próxima a vencer.', 'POR_VENCER', 'NO_LEIDO');

-- =========================================================
-- CONSULTAS DE PRUEBA
-- =========================================================

SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM membresias;
SELECT * FROM cliente_membresias;
SELECT * FROM pagos;
SELECT * FROM asistencias;
SELECT * FROM rutinas;
SELECT * FROM notificaciones;
