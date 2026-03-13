# Arquitectura de la Aplicación

## Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Aplicación React (Frontend)                 │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  InitialPage                                    │ │ │
│  │  │  ├─ RegisterPage                               │ │ │
│  │  │  ├─ LoginPage                                  │ │ │
│  │  │  └─ WelcomePage                                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                       ↓ HTTP/API                      │ │
│  │           (Axios + Context API)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP REST
┌─────────────────────────────────────────────────────────────┐
│               Servidor Express (Backend)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes (Rutas)                                        │ │
│  │  ├─ /api/auth/register                              │ │
│  │  ├─ /api/auth/login                                 │ │
│  │  ├─ /api/auth/verify-dni                            │ │
│  │  ├─ /api/users/:id                                  │ │
│  │  └─ /api/health                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                       ↓                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Controllers (Lógica de Negocio)                      │ │
│  │  ├─ authController.js                               │ │
│  │  └─ userController.js                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                       ↓                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Middleware                                            │ │
│  │  ├─ CORS                                             │ │
│  │  ├─ Body Parser                                     │ │
│  │  └─ Error Handler                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                       ↓ SQL                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Base de Datos MySQL                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Tabla: clientes                                      │ │
│  │  ├─ id (PK)                                          │ │
│  │  ├─ dni (UNIQUE KEY)                                │ │
│  │  ├─ nombre                                           │ │
│  │  ├─ apellidos                                        │ │
│  │  ├─ telefono                                         │ │
│  │  ├─ usuario                                          │ │
│  │  ├─ contraseña (hashed)                             │ │
│  │  ├─ metodo_registro                                │ │
│  │  ├─ fecha_registro                                 │ │
│  │  └─ fecha_actualizacion                            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Tabla: sesiones                                      │ │
│  │  ├─ id (PK)                                          │ │
│  │  ├─ cliente_id (FK)                                │ │
│  │  ├─ token                                            │ │
│  │  ├─ fecha_creacion                                 │ │
│  │  └─ fecha_expiracion                               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Registro Completo

```
USUARIO
  │
  ├─→ Accede a la aplicación
  │     │
  │     └─→ Frontend muestra pantalla inicial
  │
  ├─→ Selecciona "Soy nuevo cliente"
  │     │
  │     └─→ Elige método de registro (manual)
  │
  ├─→ Completa formulario
  │     │
  │     ├─→ Frontend valida datos (cliente)
  │     │
  │     └─→ Frontend envía POST /api/auth/register
  │
  ├─→ Backend recibe solicitud
  │     │
  │     ├─→ Valida datos (servidor)
  │     │
  │     ├─→ Verifica DNI único
  │     │     │
  │     │     └─→ Query: SELECT * FROM clientes WHERE dni = ?
  │     │
  │     ├─→ Hash de contraseña con bcrypt
  │     │
  │     ├─→ Inserta en BD
  │     │     │
  │     │     └─→ INSERT INTO clientes (...)
  │     │
  │     ├─→ Genera JWT
  │     │
  │     └─→ Devuelve token y clienteId
  │
  ├─→ Frontend recibe respuesta
  │     │
  │     ├─→ Guarda token en localStorage
  │     │
  │     ├─→ Actualiza contexto de autenticación
  │     │
  │     └─→ Redirige a /welcome
  │
  └─→ Muestra pantalla de bienvenida
```

## Componentes Clave

### Frontend

**Services (API Communication)**
- `api.js`: Instancia de Axios con interceptores

**Context (State Management)**
- `AuthContext.js`: Gestiona estado de autenticación global

**Pages (Pantallas Principales)**
- `InitialPage.js`: Pantalla inicial
- `RegisterPage.js`: Página de registro
- `LoginPage.js`: Página de login
- `WelcomePage.js`: Página de bienvenida

**Styles**
- `global.css`: Estilos globales
- `InitialPage.css`: Estilos de pantalla inicial
- `RegisterPage.css`: Estilos de registro
- `LoginPage.css`: Estilos de login
- `WelcomePage.css`: Estilos bienvenida

### Backend

**Controllers**
- `authController.js`: Registro, login, verificación DNI
- `userController.js`: Obtener y actualizar usuarios

**Routes**
- `auth.js`: Rutas de autenticación
- `users.js`: Rutas de usuarios
- `health.js`: Verificación de salud

**Database**
- `database.js`: Pool de conexiones MySQL

## Flujo de Autenticación

```
1. Usuario se registra
   └─→ Backend crea cliente sin token de OAuth

2. Backend genera JWT
   └─→ Token contiene: clienteId + dni + expiración (24h)

3. Frontend guarda token en localStorage
   └─→ Disponible en futuras solicitudes

4. Interceptor de Axios añade token a headers
   ```
   Authorization: Bearer {token}
   ```

5. Backend valida token en rutas protegidas
   └─→ Futuras fases implementarán middleware de validación
```

## Seguridad

### Implementado
- ✅ Hashing de contraseñas con bcrypt (10 rounds)
- ✅ JWT para autenticación stateless
- ✅ CORS para controlar acceso cross-origin
- ✅ Validación de entrada (servidor)
- ✅ DNI único como constraint

### Pendiente
- [ ] Validación de token en rutas protegidas
- [ ] Rate limiting en endpoints
- [ ] HTTPS en producción
- [ ] Secrets rotación
- [ ] Logs de seguridad

## Escalabilidad Futura

### OAuth Integration
```
├─ Google OAuth 2.0
├─ Apple Sign In
└─ Facebook Login
  └─→ Completar datos faltantes si es necesario
```

### API Externa (Verificación)
```
1. Usuario introduce DNI
2. Sistema consulta API externa
3. Si existe en otro sistema → permitir acceso
4. Si no existe → flujo de registro normal
```

### Base de Datos
```
- Replicación MySQL
- Indexes en búsquedas frecuentes
- Particionamiento si datos > 1M registros
- Cache (Redis) para consultas frecuentes
```

## Deployment

### Desarrollo
```
Backend: http://localhost:5000
Frontend: http://localhost:3000
```

### Producción (Futuro)
```
Backend: Heroku / AWS / Azure
Frontend: Netlify / Vercel / S3 + CloudFront
Database: AWS RDS / Azure MySQL
```

---

Versión: 1.0.0  
Último actualizado: Marzo 2026
