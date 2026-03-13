# Aplicación Híbrida de Registro de Clientes 

## Descripción

Aplicación web responsiva para registro de nuevos clientes con múltiples métodos de autenticación:
- **Registro Manual**: Usuario y contraseña
- **OAuth Multi-Provider**: 
  - 🔵 Google Login
  - 🍎 Apple Sign In
  - 🔷 Facebook Login
- Validación de DNI único como identificador principal
- Acceso directo a registro sin página de selección

## Cambios Principales (Fase 2)

- ✅ Integración completa de Google OAuth
- ✅ Integración completa de Apple Sign In
- ✅ Integración completa de Facebook Login
- ✅ Flujo simplificado: directo a registro manual u OAuth
- ✅ Botones OAuth con logos y estilos consistentes
- ✅ Formulario de completación de datos para OAuth

## Estructura del Proyecto

```
Aplicacion_Registro_Clientes/
├── backend/                 # Servidor Node.js/Express
│   ├── controllers/        # Lógica de negocio
│   ├── routes/             # Definición de rutas
│   ├── middleware/         # Middleware personalizado
│   ├── utils/              # Funciones auxiliares
│   ├── database.js         # Configuración de BD
│   ├── server.js           # Punto de entrada
│   ├── .env                # Variables de entorno
│   └── package.json        # Dependencias
│
├── frontend/               # Aplicación React
│   ├── public/             # Archivos estáticos
│   ├── src/
│   │   ├── pages/          # Componentes de páginas
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Servicios de API
│   │   ├── context/        # Context API (autenticación)
│   │   ├── styles/         # Estilos CSS
│   │   ├── App.js          # Componente raíz
│   │   └── index.js        # Punto de entrada
│   └── package.json        # Dependencias
│
└── database/               # Scripts SQL
    └── schema.sql          # Esquema de base de datos
```

## Configuración de OAuth Providers

### Google OAuth
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear un proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0 (Aplicación web)
5. Google Client ID se configura automáticamente en el frontend

### Apple Sign In
1. Ir a [Apple Developer](https://developer.apple.com)
2. Registrar tu aplicación
3. Configurar Sign In with Apple capability
4. Apple ID se configura automáticamente en el frontend

### Facebook Login
1. Ir a [Facebook for Developers](https://developers.facebook.com)
2. Crear una nueva app
3. Obtener el **App ID**
4. Reemplazar `1234567890123456` con tu App ID en:
   - `frontend/src/pages/RegisterPage.js` (línea con `appId=`)
   - `frontend/public/index.html` (en el script del SDK)

## Instalación

### 1. Configuración de la Base de Datos

```bash
# Ejecutar el script SQL en tu cliente MySQL
mysql -u root -p < database/schema.sql
```

### 2. Instalación del Backend

```bash
cd backend
npm install
```

Configurar variables de entorno en `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=registro_clientes
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Instalación del Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

Configurar constantes en `src/` (opcional):
- Google Client ID (si no está en variable de entorno)
- Facebook App ID (obligatorio)

## Uso

### Iniciar el Backend

```bash
cd backend
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

El servidor se ejecutará en `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Características Implementadas

- ✅ Registro manual de nuevos clientes
- ✅ Validación de DNI único como identificador
- ✅ Almacenamiento seguro en MySQL
- ✅ Autenticación JWT
- ✅ Google OAuth (con GoogleLogin oficial)
- ✅ Apple Sign In (con AppleSignin oficial)
- ✅ Facebook Login (con FacebookLogin oficial)
- ✅ Botones OAuth con logos y estilos consistentes
- ✅ Formulario de completación de datos para OAuth
- ✅ Diseño responsivo (desktop, tablet, móvil)
- ✅ Página de bienvenida post-registro/autenticación
- ✅ Contexto de autenticación global
- ✅ Navegación entre pantallas de inicio, login y registro

## Características Pendientes (Futuras Fases)

- [ ] Consulta de API externa para verificar clientes existentes
- [ ] Recuperación/Reset de contraseña
- [ ] Panel de administración de clientes
- [ ] Integraciones con sistemas externos
- [ ] Estadísticas y reportes
- [ ] Two-Factor Authentication (2FA)

## Reglas de Negocio

1. **DNI Obligatorio**: Todos los clientes deben tener un DNI
2. **DNI Único**: Un DNI solo puede estar registrado una vez
3. **Datos Mínimos**: 
   - DNI (obligatorio)
   - Nombre (obligatorio)
   - Apellidos (obligatorio)
   - Teléfono (obligatorio)
   - Usuario y contraseña (solo registro manual)

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo cliente (manual)
- `POST /api/auth/login` - Iniciar sesión con usuario/contraseña
- `POST /api/auth/verify-dni` - Verificar disponibilidad de DNI
- `POST /api/auth/complete-data` - Completar datos faltantes

### OAuth
- `POST /api/oauth/google/verify` - Verificar token de Google
- `POST /api/oauth/apple/verify` - Verificar token de Apple
- `POST /api/oauth/facebook/verify` - Verificar token de Facebook
- `GET /api/oauth/status` - Estado del servidor OAuth

### Usuarios
- `GET /api/users/:id` - Obtener información del usuario
- `PUT /api/users/:id` - Actualizar información del usuario

### Salud
- `GET /api/health` - Verificar estado del servidor

## Flujo de Registro

### Registro Manual
1. Usuario hace click en "Soy nuevo cliente"
2. Completa formulario con datos personales
3. Sistema valida DNI (debe ser único)
4. Se crea cuenta con usuario/contraseña
5. Se inicia sesión automática
6. Redirección a página de bienvenida

### Registro con OAuth
1. Usuario hace click en botón de proveedor (Google/Apple/Facebook)
2. Se abre popup de autenticación del proveedor
3. Usuario se autentica con su cuenta
4. Backend verifica token y crea/busca usuario
5. Se genera JWT token
6. Se inicia sesión automática
7. Redirección a página de bienvenida

## Métodos de Entrada

La aplicación tiene dos puntos de entrada principales:
- **Primera vez**: Botón "Soy nuevo cliente" en página inicial
- **Cliente existente**: Botón "Ya soy cliente" (acceder con usuario/contraseña)
- React Router v6 se utiliza para navegación
- Axios para llamadas a API
- Context API para estado global de autenticación

## Licencia

ISC
