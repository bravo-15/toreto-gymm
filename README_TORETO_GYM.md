# TORETO GYM

## 1. Descripción del proyecto

TORETO GYM es un sistema web de gestión para un gimnasio. El sistema permite administrar clientes, membresías, pagos, asistencias, rutinas, usuarios, roles, reportes y notificaciones automáticas.

El proyecto está desarrollado con una arquitectura separada en frontend y backend:

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: MySQL con XAMPP
- Autenticación: JWT
- Reportes: PDF y Excel
- Diseño: interfaz moderna, responsive y estilo premium

---

## 2. Problema identificado

Muchos gimnasios llevan el control de clientes, pagos y asistencias de forma manual o usando hojas de cálculo. Esto puede generar errores, pérdida de información, membresías vencidas sin detectar, pagos mal registrados y poca organización administrativa.

TORETO GYM busca solucionar este problema mediante una plataforma web que centraliza la información y automatiza procesos importantes.

---

## 3. Objetivo general

Desarrollar un sistema web para la gestión integral de un gimnasio, permitiendo controlar clientes, membresías, pagos, asistencias, rutinas, usuarios, notificaciones y reportes de manera segura, organizada y eficiente.

---

## 4. Objetivos específicos

- Registrar y administrar clientes del gimnasio.
- Gestionar planes de membresía.
- Asignar membresías a clientes.
- Registrar pagos y generar boletas.
- Controlar asistencias de clientes.
- Validar el ingreso según membresía activa.
- Generar códigos QR para clientes.
- Implementar escáner QR para asistencia automática.
- Generar notificaciones de membresías vencidas o por vencer.
- Mostrar estadísticas en un dashboard administrativo.
- Exportar reportes en PDF y Excel.
- Proteger el sistema mediante roles y JWT.

---

## 5. Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Recharts
- React Toastify
- SweetAlert2
- Framer Motion
- HTML5 QR Code
- QRCode React

### Backend

- Node.js
- Express
- MySQL2
- JSON Web Token
- Dotenv
- CORS
- Bcrypt

### Base de datos

- MySQL
- XAMPP
- phpMyAdmin

---

## 6. Módulos del sistema

### Módulo de autenticación

Permite iniciar sesión mediante correo y contraseña. El sistema valida las credenciales y genera un token JWT para proteger las rutas privadas.

### Módulo de clientes

Permite registrar, editar, buscar y eliminar clientes. También genera un carnet digital con código QR para cada cliente.

### Módulo de membresías

Permite crear planes de membresía con duración, precio, descripción y estado.

### Módulo cliente-membresías

Permite asignar una membresía a un cliente, indicando fecha de inicio, fecha de vencimiento y estado.

### Módulo de pagos

Permite registrar pagos, seleccionar método de pago, generar boletas y controlar ingresos del gimnasio.

### Módulo de asistencias

Permite registrar el ingreso y salida de clientes. El sistema valida si el cliente tiene una membresía activa.

### Módulo QR

Permite generar un QR para cada cliente y escanearlo para registrar asistencia automáticamente.

### Módulo de rutinas

Permite registrar rutinas de entrenamiento por grupo muscular, nivel, series, repeticiones y duración.

### Módulo de usuarios

Permite administrar usuarios del sistema, asignando roles como administrador, recepcionista y entrenador.

### Módulo de notificaciones

Genera alertas automáticas cuando una membresía está vencida o próxima a vencer. También muestra una campana de notificaciones en el panel.

### Módulo de reportes

Permite exportar información en PDF y Excel sobre clientes, pagos, asistencias y membresías.

### Dashboard

Muestra estadísticas importantes como clientes registrados, membresías activas, membresías vencidas, pagos del mes, asistencias del día y notificaciones pendientes.

---

## 7. Roles del sistema

| Rol | Funciones principales |
|---|---|
| Administrador | Acceso total al sistema |
| Recepcionista | Clientes, pagos, asistencias, QR y notificaciones |
| Entrenador | Gestión de rutinas y visualización del dashboard |

---

## 8. Requerimientos funcionales

1. El sistema debe permitir iniciar sesión con correo y contraseña.
2. El sistema debe permitir gestionar usuarios y roles.
3. El sistema debe permitir registrar, editar, buscar y eliminar clientes.
4. El sistema debe permitir gestionar planes de membresía.
5. El sistema debe permitir asignar membresías a clientes.
6. El sistema debe permitir registrar pagos.
7. El sistema debe generar boletas de pago.
8. El sistema debe registrar asistencias.
9. El sistema debe validar membresías antes de permitir el ingreso.
10. El sistema debe generar código QR para cada cliente.
11. El sistema debe permitir escanear QR para registrar asistencia.
12. El sistema debe gestionar rutinas de entrenamiento.
13. El sistema debe generar notificaciones automáticas.
14. El sistema debe mostrar estadísticas en el dashboard.
15. El sistema debe exportar reportes en PDF y Excel.
16. El sistema debe restringir accesos según rol.

---

## 9. Requerimientos no funcionales

1. El sistema debe tener una interfaz moderna y fácil de usar.
2. El sistema debe ser responsive para computadoras, tablets y celulares.
3. El sistema debe proteger el acceso mediante JWT.
4. El sistema debe validar los datos antes de guardarlos.
5. El sistema debe mantener la integridad de datos.
6. El sistema debe responder de forma rápida a consultas y registros.
7. El sistema debe estar organizado en frontend y backend separados.
8. El sistema debe permitir futuras mejoras.
9. El sistema debe mostrar alertas visuales para acciones exitosas o errores.
10. El sistema debe funcionar en navegadores modernos.

---

## 10. Sprints del proyecto

### Sprint 1: Análisis y planificación

Se definió el problema, los objetivos, los módulos principales y la arquitectura del sistema.

### Sprint 2: Backend y base de datos

Se creó la base de datos MySQL, la conexión con Node.js y las rutas principales del backend.

### Sprint 3: Autenticación y seguridad

Se implementó login, JWT, rutas protegidas y control de acceso por roles.

### Sprint 4: Clientes y membresías

Se desarrollaron los CRUDs de clientes y membresías, incluyendo búsqueda, validaciones y diseño administrativo.

### Sprint 5: Pagos y boletas

Se implementó el registro de pagos, métodos de pago, boletas y activación de membresías.

### Sprint 6: Asistencias y QR

Se desarrolló el registro de asistencias, validación de membresías y escáner QR.

### Sprint 7: Notificaciones

Se implementaron alertas automáticas de membresías vencidas o próximas a vencer.

### Sprint 8: Dashboard y reportes

Se agregó dashboard con gráficos, estadísticas y exportación de reportes en PDF y Excel.

### Sprint 9: Diseño y experiencia de usuario

Se mejoró la interfaz con diseño responsive, animaciones, Toastify, SweetAlert2 y estilo premium.

---

## 11. Instalación del proyecto

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 12. Variables de entorno del backend

Crear un archivo `.env` en el backend:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=toreto_gym
DB_PORT=3306
JWT_SECRET=toreto_gym_secret
```

---

## 13. Conclusión

El sistema TORETO GYM permite mejorar la administración de un gimnasio mediante una plataforma web moderna, segura y eficiente. El proyecto integra módulos esenciales como clientes, membresías, pagos, asistencias, rutinas, reportes, QR y notificaciones automáticas, logrando una solución completa para la gestión del negocio.
