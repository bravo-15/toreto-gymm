# TORETO GYM Backend Ordenado

## Instalación

```bash
npm install
npm run dev
```

## Base de datos

Importa el archivo:

```txt
sql/toreto_gym.sql
```

o ejecútalo en phpMyAdmin.

## Configuración `.env`

```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=toreto_gym
DB_PORT=3307
JWT_SECRET=toreto_gym_secret
```

## Rutas principales

- POST `/api/auth/login`
- GET/POST/PUT/DELETE `/api/clientes`
- GET/POST/PUT/DELETE `/api/membresias`
- GET/POST/PUT/DELETE `/api/pagos`
- GET/POST/PUT/DELETE `/api/asistencias`
- GET/POST/PUT/DELETE `/api/rutinas`
- GET/POST/PUT/DELETE `/api/usuarios`
- GET/POST/PUT/DELETE `/api/notificaciones`
- GET `/api/dashboard/resumen`

## Login inicial

Correo: `admin@toreto.com`
Contraseña: `123456`
