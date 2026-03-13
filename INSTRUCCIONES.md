# Guía de Instalación y Configuración

## 1. Requisitos del Sistema

- Node.js v14+ (https://nodejs.org/)
- MySQL 5.7+ (https://www.mysql.com/)
- npm (incluido con Node.js)
- Git (recomendado)

## 2. Pasos de Configuración Rápida

### Windows

```batch
# Ejecutar el script de instalación
install.bat
```

### Linux/Mac

```bash
# Hacer el script ejecutable
chmod +x install.sh

# Ejecutar el script de instalación
./install.sh
```

## 3. Configuración Manual de la Base de Datos

### Windows

```bash
# Abrir MySQL
mysql -u root -p

# Ejecutar el script SQL
mysql -u root -p < database\schema.sql
```

### Linux/Mac

```bash
mysql -u root -p < database/schema.sql
```

## 4. Variables de Entorno

### Backend (backend/.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=registro_clientes
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development

# Para futuras integraciones OAuth (dejar en blanco por ahora)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

### Frontend (frontend/.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## 5. Iniciar la Aplicación

### Terminal 1 - Backend

```bash
cd backend
npm start
```

Esperarás ver: `Servidor ejecutándose en puerto 5000`

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 6. Pruebas Iniciales

### Test de Backend
```bash
# Verificar que el backend está funcionando
curl http://localhost:5000/
curl http://localhost:5000/api/health
```

### Test de Registro

1. Abre la aplicación en navegador
2. Haz clic en "Soy nuevo cliente"
3. Selecciona "Registro Manual"
4. Completa el formulario
5. Deberías ver la pantalla de bienvenida

### Test de Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p registro_clientes

# Ver los clientes registrados
SELECT * FROM clientes;

# Salir
exit
```

## 7. Troubleshooting

### Error: "Cannot find module 'express'"
```bash
# Solución: Instalar dependencias
npm install
```

### Error: "ECONNREFUSED" al conectar BD
- Verifica que MySQL está ejecutándose
- Comprueba las credenciales en .env
- Verifica que la base de datos "registro_clientes" existe

### Error: "Port 5000 already in use"
```bash
# En Windows
netstat -ano | findstr :5000

# En Linux/Mac
lsof -i :5000

# Cambiar PORT en .env
```

### Error: "Module not found" en React
```bash
# Limpiar cache y reinstalar
cd frontend
rm -rf node_modules
npm install
npm start
```

## 8. Desarrollo

### Scripts Disponibles

**Backend:**
```bash
npm start        # Producción
npm run dev      # Desarrollo con hot-reload
```

**Frontend:**
```bash
npm start        # Desarrollo
npm run build    # Build de producción
npm test         # Ejecutar tests
```

## 9. Estructura de Carpetas

```
proyecto/
├── backend/
│   ├── controllers/       # Lógica de negocio
│   ├── routes/            # Definición de endpoints
│   ├── middleware/        # Middleware personalizado
│   ├── utils/             # Funciones auxiliares
│   ├── database.js        # Conexión a BD
│   ├── server.js          # Servidor Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Pantallas
│   │   ├── components/    # Componentes
│   │   ├── services/      # Llamadas a API
│   │   ├── context/       # Estado global
│   │   ├── styles/        # CSS
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── database/
│   └── schema.sql         # Esquema SQL
│
├── README.md              # Documentación
└── install.sh/bat         # Script instalación
```

## 10. Recursos Útiles

- [Documentación Express](https://expressjs.com/)
- [Documentación React](https://react.dev/)
- [Documentación MySQL](https://dev.mysql.com/doc/)
- [Documentación React Router](https://reactrouter.com/)

## 11. Contacto y Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

Versión: 1.0.0  
Última actualización: Marzo 2026
