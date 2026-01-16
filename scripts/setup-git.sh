#!/bin/bash

# Script para configurar Git con diferentes cuentas

echo "🔧 Configurando Git para el proyecto..."

# Leer variables de entorno o solicitar input
read -p "Ingresa tu usuario de GitHub: " GITHUB_USER
read -p "Ingresa el nombre del repositorio: " REPO_NAME
read -p "Ingresa tu email de GitHub: " GITHUB_EMAIL

# Configurar Git local
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_EMAIL"

# Configurar repositorio remoto
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "✅ Git configurado correctamente"
echo "📁 Repositorio: $REPO_URL"
echo "👤 Usuario: $GITHUB_USER"
echo "📧 Email: $GITHUB_EMAIL"

# Verificar configuración
echo ""
echo "🔍 Verificando configuración:"
git config --list | grep -E "(user.name|user.email|remote.origin.url)"