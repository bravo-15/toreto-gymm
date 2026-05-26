# Frontend Context

## Descripción General

Frontend web de TORETO GYM. Su responsabilidad es mostrar la landing pública del gimnasio y el panel administrativo privado para gestionar clientes, membresías, pagos, asistencias, rutinas, usuarios, notificaciones, reportes, QR y dashboard.

El frontend consume una API REST del backend Node.js/Express y usa autenticación JWT para proteger las rutas privadas.

---

## Stack Tecnológico

Framework: React  
Bundler: Vite  
Lenguaje: JavaScript JSX  
UI: CSS modular por componente, diseño dark premium, responsive  
Estado global: localStorage para sesión; useState/useEffect por página  
Formularios: formularios controlados con useState  
HTTP: Axios  
Routing: react-router-dom  
Autenticación: JWT guardado en localStorage  
Validaciones: validaciones manuales en formularios  

---

## Arquitectura Frontend

El frontend está dividido en dos partes principales:

1. Landing pública:
   - Página principal comercial del gimnasio.
   - Incluye secciones como hero, servicios, planes, entrenadores, galería, testimonios, contacto y footer.

2. Panel administrativo:
   - Área privada protegida por login.
   - Permite gestionar datos del gimnasio mediante módulos CRUD.
   - Incluye dashboard, clientes, membresías, pagos, asistencias, rutinas, usuarios, notificaciones, reportes y escáner QR.

---

## Estructura de Carpetas

src/pages/public:
Página pública principal del gimnasio.

src/pages/admin:
Páginas del panel administrativo.

src/components/layout:
Componentes de layout público como Navbar y Footer.

src/components/sections:
Secciones reutilizables de la landing: Hero, About, Services, Plans, Trainers, Gallery, Testimonials, Contact, Stats.

src/components/admin:
Layout administrativo y protección de rutas.

src/components/common:
Componentes comunes como botón de WhatsApp.

src/services:
Configuración de Axios para consumir la API.

src/styles:
Estilos globales.

src/assets/images:
Imágenes del frontend organizadas por secciones.

---

## Rutas

/:
Landing pública de TORETO GYM.

/login:
Pantalla de login administrativo.

/admin:
Layout privado del panel administrativo.

/admin/dashboard:
Dashboard con estadísticas y gráficos.

/admin/clientes:
Gestión de clientes y generación de carnet QR.

/admin/membresias:
Gestión de planes de membresía.

/admin/cliente-membresias:
Asignación de membresías a clientes.

/admin/pagos:
Registro de pagos y generación de boletas.

/admin/asistencias:
Registro y control de asistencias.

/admin/rutinas:
Gestión de rutinas de entrenamiento.

/admin/usuarios:
Gestión de usuarios y roles.

/admin/notificaciones:
Gestión de alertas automáticas.

/admin/escaner-qr:
Escaneo QR para registrar asistencia.

/admin/reportes:
Exportación de reportes PDF y Excel.

---

## Layouts

Navbar:
Menú público responsive con enlaces a secciones de la landing, botón Admin y CTA de planes.

Footer:
Pie de página de la landing.

AdminLayout:
Layout privado del panel. Contiene sidebar, topbar, usuario logueado, campana de notificaciones y Outlet para páginas admin.

ProtectedRoute:
Protege rutas privadas validando token JWT y roles permitidos.

---

## Estado Global

No se usa Redux ni Zustand.

Estado principal:
- token JWT en localStorage con clave `toreto_token`.
- usuario logueado en localStorage con clave `toreto_admin`.
- estados locales con useState en cada página.

Datos por módulo:
- clientes
- membresías
- pagos
- asistencias
- usuarios
- rutinas
- notificaciones
- reportes

---

## Servicios/API

Archivo principal:
src/services/api.js

Patrón:
- Axios centralizado.
- baseURL: http://localhost:3001/api
- interceptor agrega Authorization Bearer token.
- cada página consume endpoints con api.get, api.post, api.put, api.delete.

Endpoints usados:
- /auth
- /clientes
- /membresias
- /cliente-membresias
- /pagos
- /asistencias
- /rutinas
- /usuarios
- /notificaciones
- /dashboard
- /reportes si se agrega backend específico

---

## Autenticación

Login:
El usuario ingresa correo y contraseña. El backend devuelve token y datos del usuario.

Persistencia:
- token guardado en localStorage como `toreto_token`.
- usuario guardado en localStorage como `toreto_admin`.

Logout:
Elimina token y usuario del localStorage y redirige a /login.

Protección:
ProtectedRoute valida:
- existencia del token.
- rol permitido si la ruta define roles.

Roles principales:
- ADMINISTRADOR
- RECEPCIONISTA
- ENTRENADOR

Refresh token:
No implementado.

---

## Formularios y Validaciones

Librerías:
No se usa Formik ni React Hook Form.

Patrón:
Formularios controlados con useState.

Validaciones manuales:
- campos obligatorios
- DNI de 8 dígitos
- celular de 9 dígitos
- correo con @
- monto mayor a 0
- fechas requeridas
- selección de cliente/membresía obligatoria

Feedback:
- react-toastify para mensajes.
- sweetalert2 para confirmaciones.

---

## Componentes Reutilizables

Navbar:
Navegación pública responsive.

Footer:
Footer de landing.

AdminLayout:
Estructura del panel administrativo.

ProtectedRoute:
Control de acceso por token y rol.

WhatsAppButton:
Botón flotante de contacto.

Secciones landing:
Hero, Stats, About, Services, Plans, Trainers, Gallery, Testimonials, Contact.

---

## Hooks Personalizados

No existen hooks personalizados formales.

Se usan hooks nativos:
- useState
- useEffect
- useMemo

---

## Manejo de Errores

Errores de API:
Se capturan con try/catch en cada página.

Feedback visual:
- toast.error para errores.
- toast.success para acciones correctas.
- toast.warning para validaciones.
- SweetAlert2 para confirmar eliminación.

Errores globales:
No existe error boundary global.

---

## Convenciones

Naming:
- Componentes en PascalCase.
- Archivos de componentes en PascalCase.
- CSS por componente.
- Clases CSS con BEM en landing.
- Páginas admin en español.

Patrones usados:
- Separación por páginas públicas y privadas.
- Layout admin con Outlet.
- API centralizada con Axios.
- Formularios controlados.
- Validación manual.
- Protección de rutas por roles.

---

## Dependencias Importantes

react  
react-dom  
react-router-dom  
axios  
recharts  
react-toastify  
sweetalert2  
framer-motion  
qrcode.react  
html5-qrcode  
jspdf  
jspdf-autotable  
xlsx  

---

## Variables de Entorno

Actualmente el frontend usa baseURL fija:

http://localhost:3001/api

Pendiente recomendado:
Crear variable:

VITE_API_URL=http://localhost:3001/api

y usarla en src/services/api.js.

---

## Estado Actual

Funciona:

- Landing pública premium.
- Navbar responsive.
- Secciones públicas responsive.
- Login admin.
- Rutas privadas.
- Roles frontend.
- Dashboard con gráficos.
- CRUD clientes.
- CRUD membresías.
- Asignación cliente-membresía.
- Pagos.
- Boletas.
- Asistencias.
- QR de cliente.
- Escáner QR.
- Rutinas.
- Usuarios.
- Notificaciones automáticas.
- Campana de notificaciones.
- Reportes PDF y Excel.
- Toastify y SweetAlert2.
- Diseño responsive en admin y landing.

---

## Problemas Conocidos

- No hay refresh token.
- No hay error boundary global.
- La URL del backend está fija en api.js.
- Las imágenes reales de landing aún pueden mejorarse.
- No hay modo cliente final.
- El envío real del formulario de contacto puede requerir backend o servicio externo.

---

## Próximos Pasos

1. Migrar baseURL a VITE_API_URL.
2. Agregar imágenes reales premium en landing.
3. Mejorar galería con fotos reales.
4. Agregar loader global.
5. Mejorar carnet digital con foto real.
6. Crear modo cliente.
7. Preparar deploy frontend.
8. Revisar accesibilidad básica.
9. Crear BACKEND_CONTEXT.md.
10. Preparar ZIP final para presentación.
