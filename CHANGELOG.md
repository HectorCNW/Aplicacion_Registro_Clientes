# Changelog

Todos los cambios importantes en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-12

### Agregado
- Estructura inicial del proyecto (Backend + Frontend + BD)
- Sistema de registro de clientes con múltiples métodos
- Validación de DNI único en cliente y servidor
- Autenticación basada en JWT
- Contexto de autenticación global con React Context
- Pantalla inicial con opciones de registro/login
- Página de registro manual con validación
- Página de bienvenida post-registro
- Base de datos MySQL con esquema relacional
- Endpoint `/api/auth/register` para registrar clientes
- Endpoint `/api/auth/login` para autenticación
- Endpoint `/api/auth/verify-dni` para verificar disponibilidad
- Endpoints `/api/users/:id` para gestionar datos de usuario
- Endpoint `/api/health` para verificar estado del servidor
- Estilos responsivos (PC, tablet, móvil)
- Documentación completa (README, INSTRUCCIONES, ARQUITECTURA)
- Scripts de instalación (Windows: install.bat, Linux/Mac: install.sh)
- Variables de entorno configurables (.env.example)

### Por hacer
- [ ] Integración OAuth con Google, Apple, Facebook
- [ ] Completar formulario para datos faltantes de OAuth
- [ ] Consulta de API externa para verificar clientes existentes
- [ ] Implementar recuperación de contraseña
- [ ] Agregar dashboard de usuario
- [ ] Panel administrativo
- [ ] Tests automatizados (unitarios e integración)
- [ ] Logging y monitoreo
- [ ] Documentación de API (Swagger/OpenAPI)

## Notas de Desarrollo

### v1.0.0
- Primera fase completada con funcionalidad de registro manual
- Implementación de arquitectura escalable para futuras integraciones
- Base sólida para incorporar OAuth en próximas fases

---

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.
