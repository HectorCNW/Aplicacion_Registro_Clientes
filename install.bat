@echo off
REM Script de instalación para Windows

echo ========================================
echo Instalacion de Aplicacion de Registro de Clientes
echo ========================================

REM Instalar backend
echo.
echo 1. Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error en la instalacion del backend
    exit /b 1
)
cd ..

REM Instalar frontend
echo.
echo 2. Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error en la instalacion del frontend
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Instalacion completada con exito!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Configura la base de datos ejecutando: mysql -u root -p < database\schema.sql
echo 2. Configura las variables de entorno en backend\.env
echo 3. Configura las variables de entorno en frontend\.env
echo 4. Inicia el backend: cd backend ^&^& npm start
echo 5. En otra terminal, inicia el frontend: cd frontend ^&^& npm start
echo.
pause
