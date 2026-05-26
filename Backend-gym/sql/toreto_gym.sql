CREATE DATABASE IF NOT EXISTS toreto_gym;
USE toreto_gym;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR','RECEPCIONISTA','ENTRENADOR') DEFAULT 'RECEPCIONISTA',
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(15),
    correo VARCHAR(100),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membresias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion VARCHAR(50),
    precio DECIMAL(10,2),
    descripcion TEXT,
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    membresia_id INT,
    monto DECIMAL(10,2),
    metodo_pago ENUM('EFECTIVO','YAPE','PLIN','TARJETA') DEFAULT 'EFECTIVO',
    estado ENUM('PAGADO','PENDIENTE','ANULADO') DEFAULT 'PAGADO',
    fecha_pago DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
);

CREATE TABLE IF NOT EXISTS asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha DATE,
    hora_ingreso TIME,
    hora_salida TIME,
    estado ENUM('VALIDO','DENEGADO') DEFAULT 'VALIDO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS rutinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    grupo_muscular VARCHAR(100),
    series INT,
    repeticiones INT,
    nivel ENUM('PRINCIPIANTE','INTERMEDIO','AVANZADO') DEFAULT 'PRINCIPIANTE',
    duracion VARCHAR(50),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150),
    mensaje TEXT,
    tipo ENUM('INFO','PAGO','MEMBRESIA','ASISTENCIA','SISTEMA') DEFAULT 'INFO',
    estado ENUM('LEIDO','NO_LEIDO') DEFAULT 'NO_LEIDO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario inicial: admin@toreto.com / 123456
INSERT INTO usuarios (nombre, correo, password, rol, estado)
VALUES ('Administrador', 'admin@toreto.com', '$2a$10$vuq3YxH9360mqfqcUuDewed3xLCfdYiWq7fEgw.gYgLGR2GidCZI6', 'ADMINISTRADOR', 'ACTIVO')
ON DUPLICATE KEY UPDATE correo = correo;
