#!/bin/bash

# Script de instalación para Linux/Mac

echo "========================================"
echo "Instalacion de Aplicacion de Registro de Clientes"
echo "========================================"

# Instalar backend
echo ""
echo "1. Instalando dependencias del backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error en la instalacion del backend"
    exit 1
fi
cd ..

# Instalar frontend
echo ""
echo "2. Instalando dependencias del frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error en la instalacion del frontend"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "Instalacion completada con exito!"
echo "========================================"
echo ""
echo "Proximos pasos:"
echo "1. Configura la base de datos ejecutando: mysql -u root -p < database/schema.sql"
echo "2. Configura las variables de entorno en backend/.env"
echo "3. Configura las variables de entorno en frontend/.env"
echo "4. Inicia el backend: cd backend && npm start"
echo "5. En otra terminal, inicia el frontend: cd frontend && npm start"
echo ""
