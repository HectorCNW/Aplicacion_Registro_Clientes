# Guía de Testing

## Testing Manual - Fase 1

### 1. Test de Registro Manual

#### Precondiciones
- Base de datos creada y ejecutándose
- Backend funcionando en puerto 5000
- Frontend funcionando en puerto 3000

#### Pasos

1. **Acceso a la aplicación**
   - Abrir `http://localhost:3000`
   - Verificar que se carga la pantalla inicial
   - ✓ Debería mostrar dos botones: "Ya soy cliente" y "Soy nuevo cliente"

2. **Seleccionar registro manual**
   - Click en "Soy nuevo cliente"
   - ✓ Debería mostrar opciones de registro
   - Click en "Registro Manual"
   - ✓ Debería mostrar formulario

3. **Llenar formulario válido**
   - DNI: `12345678A`
   - Nombre: `Juan`
   - Apellidos: `García López`
   - Teléfono: `600123456`
   - Usuario: `jgarcia`
   - Contraseña: `Password123`
   - Confirmar Contraseña: `Password123`
   - Click en "Registrarse"
   - ✓ Debería mostrar pantalla de bienvenida con "¡Bienvenido Juan!"

4. **Verificar base de datos**
   ```sql
   SELECT * FROM clientes WHERE dni = '12345678A';
   ```
   - ✓ Debería encontrar registro con todos los datos
   - ✓ La contraseña debería estar hasheada (no texto plano)

### 2. Test de Validación

#### Campos requeridos
1. **Sin DNI**
   - Dejar campo DNI en blanco
   - Click "Registrarse"
   - ✓ Debe mostrar error: "DNI es obligatorio"

2. **DNI duplicado**
   - Usar `12345678A` (del test anterior)
   - Rellenar otros datos
   - Click "Registrarse"
   - ✓ Debe mostrar error: "El DNI ya está registrado"

3. **Contraseñas no coinciden**
   - Llenar todos los campos
   - Contraseña: `Password123`
   - Confirmar: `Password456`
   - Click "Registrarse"
   - ✓ Debe mostrar error: "Las contraseñas no coinciden"

### 3. Test de Responsividad

#### Dispositivos a probar
1. **PC (1920x1080)**
   - Abrir en navegador normal
   - ✓ Elementos bien distribuidos

2. **Tablet (768x1024)**
   - Usar DevTools (F12) → Toggle device toolbar
   - Seleccionar "iPad"
   - ✓ Interfaz se adapta correctamente

3. **Móvil (375x667)**
   - Usar DevTools
   - Seleccionar "iPhone 12"
   - ✓ Botones y formularios accesibles
   - ✓ No hay scrolleo horizontal

### 4. Test de Navegación

1. **Volver desde registro**
   - En pantalla de método de registro
   - Click en "Volver" (si existe)
   - ✓ Debe volver a pantalla inicial

2. **Cerrar sesión**
   - Completar registro (¡Bienvenido!)
   - Click "Cerrar Sesión"
   - ✓ Debe volver a pantalla inicial

### 5. Test de API Backend

#### Verificar que el servidor está activo
```bash
curl http://localhost:5000/
# Respuesta esperada: {"message": "Servidor de Registro de Clientes funcionando correctamente"}
```

#### Verificar salud del servidor
```bash
curl http://localhost:5000/api/health
# Respuesta esperada: {"status": "OK", "message": "Servidor en línea"}
```

#### Test de registro por API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "87654321B",
    "nombre": "María",
    "apellidos": "Rodríguez Pérez",
    "telefono": "650987654",
    "usuario": "mrodriguez",
    "contraseña": "Password456",
    "metodo": "manual"
  }'
# Respuesta esperada: token y clienteId
```

#### Test de verificación DNI
```bash
curl -X POST http://localhost:5000/api/auth/verify-dni \
  -H "Content-Type: application/json" \
  -d '{"dni": "12345678A"}'
# Respuesta esperada: {"exists": true}
```

### 6. Test de Base de Datos

#### Verificar estructura
```sql
DESC clientes;
DESC sesiones;
```

#### Contar registros
```sql
SELECT COUNT(*) as total FROM clientes;
```

#### Verificar índices
```sql
SHOW INDEXES FROM clientes;
```

## Testing Automatizado (Futuro)

### Backend Tests
```bash
# Tests unitarios
npm run test

# Coverage
npm run test:coverage
```

### Frontend Tests
```bash
# Tests de componentes
npm run test

# Coverage
npm run test:coverage

# E2E
npm run test:e2e
```

## Checklist de Validación

- [ ] Registro manual completo funciona
- [ ] Validación de campos requeridos
- [ ] Validación de DNI único
- [ ] Hash de contraseña guardado en BD
- [ ] JWT generado correctamente
- [ ] Login con usuario/contraseña funciona
- [ ] Pantalla bienvenida muestra nombre correcto
- [ ] Interfaz responsiva en PC/Tablet/Móvil
- [ ] Mensajes de error claros
- [ ] Base de datos crea registros correctamente
- [ ] CORS funciona correctamente
- [ ] API retorna JSON válido

## Problemas Comunes y Soluciones

### Backend

**Error: "Cannot find module 'mysql2'"**
```bash
cd backend
npm install
```

**Error: "ECONNREFUSED" (BD)**
- Verificar que MySQL está ejecutándose
- Verificar credenciales en .env
- Verificar que la BD existe: `SHOW DATABASES;`

**Error: "Port 5000 already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Frontend

**Error: "Failed to compile"**
- Guardar archivo nuevamente
- Verificar errores de sintaxis en consola

**No conecta con backend**
- Verificar que backend está corriendo
- Verificar URL en REACT_APP_API_URL
- Verificar CORS habilitado en backend

**Contraseña hasheada incorrectamente**
- Verificar que bcrypt está instalado: `npm list bcrypt`
- Backend recibió la solicitud con hash?

## Especificaciones de Prueba

### Datos de Prueba Válidos
```
DNI: 12345678A, 87654321B, 11223344C
Nombre: Juan, María, Carlos
Teléfono: 600123456, 650987654, 700555888
```

### Datos de Prueba Inválidos
```
DNI vacío, DNI duplicado, Nombre vacío
Teléfono vacío, Usuario vacío, Contraseña vacía
```

---

Versión: 1.0.0  
Última actualización: Marzo 2026
