# Aplicación Híbrida de Registro de Clientes - Fase 1

## Descripción

Aplicación web responsiva para registro de nuevos clientes con soporte para múltiples métodos de autenticación:
- Registro manual con usuario y contraseña
- Registro mediante OAuth (Google, Apple, Facebook)
- Validación de DNI único como identificador principal

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

## Requisitos Previos

- Node.js versión 14 o superior
- MySQL 5.7 o superior
- npm o yarn

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
```

### 3. Instalación del Frontend

```bash
cd frontend
npm install
```

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

- ✅ Pantalla inicial con opciones "Ya soy cliente" y "Soy nuevo cliente"
- ✅ Registro manual de nuevos clientes
- ✅ Validación de DNI único
- ✅ Almacenamiento de datos en MySQL
- ✅ Autenticación básica con JWT
- ✅ Diseño responsivo (PC, tablet, móvil)
- ✅ Página de bienvenida post-registro
- ✅ Contexto de autenticación global

## Características Pendientes (Futuras Fases)

- [ ] Integración con OAuth (Google, Apple, Facebook)
- [ ] Consulta de API externa para verificar clientes existentes
- [ ] Completar formulario para datos faltantes de OAuth
- [ ] Recuperación de contraseña
- [ ] Panel de administración
- [ ] Integraciones con sistemas externos

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
- `POST /api/auth/register` - Registrar nuevo cliente
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verify-dni` - Verificar disponibilidad de DNI
- `POST /api/auth/complete-data` - Completar datos faltantes

### Usuarios
- `GET /api/users/:id` - Obtener información del usuario
- `PUT /api/users/:id` - Actualizar información del usuario

### Salud
- `GET /api/health` - Verificar estado del servidor

## Notas de Desarrollo

- La aplicación usa MySQL como base de datos
- JWT se utiliza para autenticación
- Las contraseñas se hashean con bcrypt
- React Router v6 se utiliza para navegación
- Axios para llamadas a API
- Context API para estado global de autenticación

## Licencia

ISC
