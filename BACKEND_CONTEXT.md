# Backend Context

## Descripción General

Backend del sistema TORETO GYM. Su responsabilidad es exponer una API REST para gestionar clientes, membresías, pagos, asistencias, rutinas, usuarios, notificaciones, dashboard, autenticación y control de roles.

El backend se conecta a MySQL mediante mysql2/promise y protege rutas privadas usando JWT.

---

## Stack Tecnológico

Runtime: Node.js  
Framework: Express  
Lenguaje: JavaScript CommonJS  
Base de datos: MySQL  
Driver DB: mysql2/promise  
Autenticación: JSON Web Token  
Variables de entorno: dotenv  
Seguridad: JWT + middleware de roles  
CORS: cors  
Hash password: bcrypt si está configurado en auth  
Servidor local: localhost:3001  

---

## Arquitectura Backend

El backend está organizado por capas:

- server.js: configuración principal del servidor Express.
- config/database.js: conexión a MySQL.
- routes: definición de endpoints.
- controllers: lógica de negocio y consultas SQL.
- middlewares: autenticación JWT y permisos por rol.
- factories: generación reutilizable de CRUDs si aplica.

Patrón principal:
Ruta → Middleware → Controller → Base de datos → Respuesta JSON.

---

## Estructura de Carpetas

backend/config:
Configuración de conexión a la base de datos.

backend/controllers:
Controladores de módulos como clientes, membresías, pagos, asistencias, usuarios, dashboard y notificaciones.

backend/routes:
Rutas Express para exponer endpoints REST.

backend/middlewares:
Middleware de autenticación y autorización por roles.

backend/server.js:
Punto principal de entrada del backend.

backend/.env:
Variables de entorno.

---

## Variables de Entorno

PORT:
Puerto donde corre el backend. Valor usado: 3001.

DB_HOST:
Host de MySQL. Normalmente localhost.

DB_USER:
Usuario de MySQL. Normalmente root en XAMPP.

DB_PASSWORD:
Contraseña de MySQL.

DB_NAME:
Nombre de la base de datos. Valor recomendado: toreto_gym.

DB_PORT:
Puerto MySQL. Normalmente 3306.

JWT_SECRET:
Clave secreta para firmar tokens JWT.

---

## Base de Datos

Motor:
MySQL.

Nombre:
toreto_gym.

Tablas principales:
- usuarios
- roles si existe tabla separada
- clientes
- membresias
- cliente_membresias
- pagos
- asistencias
- rutinas
- notificaciones

Relaciones importantes:
- cliente_membresias relaciona clientes con membresías.
- pagos relaciona clientes y membresías.
- asistencias relaciona clientes con registros de ingreso.
- notificaciones puede relacionarse con clientes o eventos del sistema.

---

## Autenticación

Login:
Endpoint principal:
POST /api/auth/login

Proceso:
- Recibe correo y password.
- Valida existencia del usuario.
- Verifica estado activo.
- Verifica contraseña.
- Genera token JWT.
- Devuelve token y datos del usuario.

Persistencia:
El frontend guarda:
- token en localStorage como `toreto_token`.
- usuario en localStorage como `toreto_admin`.

Logout:
Se realiza en frontend eliminando localStorage.

Refresh token:
No implementado.

---

## Seguridad y Roles

Middleware principal:
middlewares/auth.middleware.js

Funciones:
- verificarToken
- verificarRol

verificarToken:
- Lee Authorization Bearer token.
- Valida JWT.
- Guarda payload en req.usuario.
- Bloquea token ausente, inválido o expirado.

verificarRol:
- Recibe roles permitidos.
- Compara req.usuario.rol.
- Retorna 403 si no tiene permisos.

Roles principales:
- ADMINISTRADOR
- RECEPCIONISTA
- ENTRENADOR

Permisos actuales:
ADMINISTRADOR:
Acceso total.

RECEPCIONISTA:
Clientes, pagos, asistencias, cliente-membresías, QR y notificaciones.

ENTRENADOR:
Rutinas y dashboard.

---

## Rutas Principales

GET /
Prueba de servidor.

POST /api/auth/login
Inicio de sesión.

CRUD /api/clientes
Gestión de clientes.

CRUD /api/membresias
Gestión de planes de membresía.

CRUD /api/cliente-membresias
Asignación de membresías a clientes.

CRUD /api/pagos
Gestión de pagos.

CRUD /api/asistencias
Registro y control de asistencias.

CRUD /api/rutinas
Gestión de rutinas.

CRUD /api/usuarios
Gestión de usuarios.

CRUD /api/notificaciones
Gestión de notificaciones.

POST /api/notificaciones/generar-alertas-membresias
Generación manual de alertas por vencimiento.

GET /api/dashboard/resumen
Resumen del dashboard.

---

## Controladores

auth.controller:
Gestiona login y generación de token.

clientes.controller:
CRUD de clientes.

membresias.controller:
CRUD de planes de membresía.

cliente_membresias.controller:
Asigna y actualiza membresías de clientes.

pagos.controller:
Registra pagos, lista pagos y permite boletas desde frontend.

asistencias.controller:
Registra asistencias y valida membresía activa.

rutinas.controller:
CRUD de rutinas.

usuarios.controller:
CRUD de usuarios y gestión de rol/estado.

notificaciones.controller:
Genera, lista, actualiza y elimina notificaciones.

dashboard.controller:
Calcula métricas principales del sistema.

---

## Lógica de Negocio Importante

### Validación de asistencia

Cuando se registra asistencia:
- Se busca la membresía más reciente del cliente.
- Si no existe membresía activa, se registra como DENEGADO.
- Si la membresía está vencida, se registra como DENEGADO.
- Si está vigente, se registra como VALIDO.

### Pagos

Cuando se registra un pago:
- Se guarda monto, método, fecha y estado.
- El frontend permite generar boleta.
- Puede activar o asociar membresía según lógica implementada en backend.

### Dashboard

Calcula:
- total de clientes
- membresías activas
- membresías vencidas
- membresías próximas a vencer
- pagos del mes
- asistencias del día
- notificaciones no leídas

### Notificaciones automáticas

El servidor revisa membresías:
- vencidas
- próximas a vencer

Se ejecuta:
- al iniciar servidor
- cada 1 hora mediante setInterval

La lógica llama a generarAlertasMembresias desde notificaciones.controller.

---

## Servicios Internos

No hay servicios separados formales. La lógica está principalmente en controllers.

Pendiente recomendado:
Separar lógica compleja en services:
- auth.service.js
- pagos.service.js
- asistencias.service.js
- notificaciones.service.js
- dashboard.service.js

---

## Factories y CRUD

El proyecto usa o ha usado un patrón reutilizable:
- crud.factory.js
- crud.routes.js

Objetivo:
Reducir código repetido en CRUDs simples.

Rutas importantes protegidas manualmente:
- usuarios
- clientes
- membresias
- pagos
- asistencias

---

## Manejo de Errores

Patrón:
try/catch en controladores.

Respuesta de error:
status 500 con JSON:
{
  mensaje: "...",
  error: error.message
}

Errores de autenticación:
401 para token ausente o inválido.

Errores de autorización:
403 para rol sin permiso.

---

## Convenciones

Naming:
- Archivos de rutas: modulo.routes.js
- Archivos de controladores: modulo.controller.js
- Middleware: auth.middleware.js
- Tablas en plural o snake_case.
- Campos en snake_case.

Estilo:
- CommonJS con require/module.exports.
- async/await.
- respuestas JSON.
- rutas agrupadas por módulo.

---

## Dependencias Importantes

express  
cors  
dotenv  
mysql2  
jsonwebtoken  
bcrypt o bcryptjs si está instalado  
nodemon en desarrollo  

---

## Estado Actual

Funciona:
- servidor Express
- conexión MySQL
- login JWT
- protección por token
- protección por roles
- CRUD clientes
- CRUD membresías
- asignación cliente-membresía
- pagos
- asistencias
- rutinas
- usuarios
- notificaciones automáticas
- dashboard resumen
- integración con frontend React
- generación de reportes desde frontend usando datos API

---

## Problemas Conocidos

- No existe refresh token.
- No existe rate limiting.
- No existe validación con librerías como Joi o Zod.
- No existe logger profesional.
- No existe documentación Swagger.
- Algunos CRUDs pueden depender de factories genéricas.
- La lógica de negocio está mezclada en controllers.
- Falta hardening para producción.

---

## Próximos Pasos

1. Crear BACKEND_CONTEXT actualizado si cambian rutas.
2. Migrar validaciones a Joi o Zod.
3. Agregar Swagger/OpenAPI.
4. Separar lógica de negocio en services.
5. Agregar rate limiting.
6. Agregar helmet.
7. Mejorar manejo global de errores.
8. Configurar variables para producción.
9. Preparar deploy backend.
10. Migrar base de datos a servicio online.
11. Crear script SQL final.
12. Crear ZIP final frontend + backend.
