# 📘 Guía Técnica Completa de Despliegue y Configuración

## Sistema de Gestión de Residuos - Documentación Técnica

---

## 📑 ÍNDICE

1. [Despliegue en Render](#1-despliegue-en-render)
2. [Configuración de Base de Datos PostgreSQL](#2-configuración-de-base-de-datos-postgresql)
3. [Variables de Entorno](#3-variables-de-entorno)
4. [Errores Comunes y Soluciones](#4-errores-comunes-y-soluciones)
5. [Estructura Interna del Proyecto](#5-estructura-interna-del-proyecto)
6. [Gestión de Iconos e Imágenes](#6-gestión-de-iconos-e-imágenes)
7. [Conexión con Hostinger](#7-conexión-con-hostinger)
8. [Mantenimiento y Actualización](#8-mantenimiento-y-actualización)

---

## 1. DESPLIEGUE EN RENDER

### Opción A: Despliegue con GitHub (RECOMENDADO)

#### Paso 1: Preparar el Repositorio

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - Sistema de gestión de residuos"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

#### Paso 2: Crear Servicio en Render

1. **Acceder a Render:**
   - Ve a https://render.com
   - Inicia sesión o crea una cuenta

2. **Nuevo Servicio Web:**
   - Click en "New +"
   - Selecciona "Web Service"
   - Conecta tu cuenta de GitHub
   - Autoriza acceso a tu repositorio

3. **Configuración del Servicio:**
   ```yaml
   Name: sistema-residuos-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

4. **Variables de Entorno:**
   - Click en "Environment"
   - Agregar las siguientes variables (ver sección 3)

5. **Deploy:**
   - Click en "Create Web Service"
   - Esperar a que termine el despliegue (3-5 minutos)

#### Ventajas de GitHub:
- ✅ Auto-deploy en cada push
- ✅ Historial de versiones
- ✅ Rollback fácil
- ✅ Colaboración en equipo

---

### Opción B: Despliegue Directo desde Visual Studio Code

#### Paso 1: Preparar el Proyecto

1. **Instalar Render CLI:**
   ```bash
   npm install -g @render/cli
   ```

2. **Autenticar:**
   ```bash
   render login
   ```

3. **Crear render.yaml en la raíz del proyecto:**
   ```yaml
   services:
     - type: web
       name: sistema-residuos-backend
       env: node
       region: oregon
       plan: free
       buildCommand: cd backend && npm install
       startCommand: cd backend && node server.js
       envVars:
         - key: DATABASE_URL
           sync: false
         - key: PORT
           value: 3001
         - key: NODE_ENV
           value: production
   ```

4. **Desplegar:**
   ```bash
   render deploy
   ```

#### Paso 2: Actualizar Variables de Entorno

1. Ve al Dashboard de Render
2. Selecciona tu servicio
3. Click en "Environment"
4. Agregar variables necesarias

---

### Opción C: Despliegue desde Terminal (Git)

```bash
# Crear archivo .gitignore si no existe
cat > .gitignore << EOL
node_modules/
.env
dist/
.DS_Store
*.log
EOL

# Preparar backend para despliegue
cd backend
npm install
cd ..

# Commit y push
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

Luego seguir los pasos de la Opción A desde el paso 2.

---

## 2. CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL

### Opción 1: PostgreSQL en Render (RECOMENDADO)

#### Crear Base de Datos en Render:

1. **Dashboard de Render:**
   - Click en "New +"
   - Selecciona "PostgreSQL"

2. **Configuración:**
   ```yaml
   Name: sistema-residuos-db
   Database: residuos_db
   User: residuos_admin
   Region: Oregon (US West)
   Instance Type: Free (1 GB Storage)
   ```

3. **Obtener Credenciales:**
   - Una vez creada, copia los valores:
     - Internal Database URL
     - External Database URL
     - PSQL Command

4. **Conectar con el Backend:**
   - Ve al servicio web (backend)
   - Environment → Add Environment Variable
   - Key: `DATABASE_URL`
   - Value: Pega la "Internal Database URL"

#### Crear Tablas (Migración Inicial):

```sql
-- Conectar con PSQL
psql -h dpg-xxx.oregon-postgres.render.com -U residuos_admin residuos_db

-- Crear tabla de registros
CREATE TABLE IF NOT EXISTS waste_records (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS operator_messages (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_waste_date ON waste_records(date);
CREATE INDEX idx_waste_type ON waste_records(type);
CREATE INDEX idx_waste_location ON waste_records(location);
CREATE INDEX idx_messages_read ON operator_messages(is_read);

-- Verificar tablas
\dt
```

---

### Opción 2: PostgreSQL en Supabase

Si prefieres usar Supabase (ya configurado en el proyecto):

1. **Ir a Supabase:**
   - https://supabase.com
   - Crear proyecto

2. **Obtener Credenciales:**
   - Settings → Database
   - Copiar "Connection String"

3. **Configurar en Render:**
   - Environment → DATABASE_URL
   - Pegar connection string

---

### Opción 3: PostgreSQL Local para Desarrollo

```bash
# Instalar PostgreSQL
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Iniciar servicio
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Crear base de datos
createdb residuos_db

# Conectar
psql residuos_db

# Ejecutar SQL de migración (ver arriba)
```

---

## 3. VARIABLES DE ENTORNO

### Backend (.env en /backend):

```env
# Puerto del servidor
PORT=3001

# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:password@host:5432/database_name

# Entorno
NODE_ENV=production

# CORS - Permitir frontend
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Opcional: Supabase (si usas Supabase)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend (.env en raíz):

```env
# API Backend
VITE_API_URL=https://sistema-residuos-backend.onrender.com

# Opcional: Si usas Supabase directamente desde frontend
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configurar en Render:

1. **Backend Service:**
   - Environment
   - Add Environment Variable
   - Agregar cada variable individualmente

2. **Variables Obligatorias:**
   - `DATABASE_URL` (PostgreSQL connection string)
   - `PORT` (3001)
   - `NODE_ENV` (production)

3. **Variables Opcionales:**
   - `ALLOWED_ORIGINS` (tu dominio de frontend)
   - Credenciales de Supabase si aplica

---

## 4. ERRORES COMUNES Y SOLUCIONES

### Error 1: "Cannot connect to database"

**Causa:** DATABASE_URL incorrecta o base de datos no accesible

**Solución:**
```bash
# Verificar connection string
echo $DATABASE_URL

# Probar conexión
psql $DATABASE_URL

# Si falla, revisar:
# 1. ¿El host es correcto?
# 2. ¿El usuario y password son correctos?
# 3. ¿El firewall permite la conexión?
# 4. ¿Las tablas existen?
```

---

### Error 2: "Port already in use"

**Causa:** El puerto 3001 ya está en uso

**Solución:**
```bash
# Cambiar PORT en .env
PORT=3002

# O matar proceso en puerto 3001
lsof -ti:3001 | xargs kill -9
```

---

### Error 3: "CORS Error" en Frontend

**Causa:** Backend no permite solicitudes desde tu dominio

**Solución:**

En `backend/server.js`, verificar:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tu-dominio.com',
    'https://www.tu-dominio.com'
  ],
  credentials: true
}));
```

---

### Error 4: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ..
rm -rf node_modules package-lock.json
npm install
```

---

### Error 5: "Build failed" en Render

**Causa:** Comando de build incorrecto o dependencias faltantes

**Solución:**

1. **Verificar package.json:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Verificar Root Directory en Render:**
   - Debe ser `backend` si el servidor está en /backend
   - O dejar vacío si está en la raíz

3. **Build Command:**
   ```bash
   npm install
   ```

4. **Start Command:**
   ```bash
   node server.js
   ```

---

### Error 6: "Database tables don't exist"

**Causa:** No se ejecutó la migración inicial

**Solución:**
```bash
# Conectar a la base de datos
psql $DATABASE_URL

# Ejecutar SQL de migración (ver sección 2)
# O usar script de migración
node backend/scripts/migrate.js
```

---

## 5. ESTRUCTURA INTERNA DEL PROYECTO

### Arquitectura General

```
proyecto-raiz/
│
├── backend/                    # Backend Node.js + Express
│   ├── server.js              # Punto de entrada del servidor
│   ├── package.json           # Dependencias backend
│   ├── .env                   # Variables de entorno (NO subir a Git)
│   ├── .env.example           # Plantilla de variables
│   └── scripts/
│       └── migrate.js         # Scripts de migración DB
│
├── src/                       # Frontend React + TypeScript
│   ├── components/            # Componentes React
│   │   ├── Dashboard.tsx      # Vista de gráficas
│   │   ├── WasteForm.tsx      # Formulario administrador
│   │   ├── TabletWasteForm.tsx # Formulario operador
│   │   ├── Reports.tsx        # Reportes y exportación
│   │   ├── Configuration.tsx  # Configuración
│   │   ├── Login.tsx          # Autenticación
│   │   ├── Layout.tsx         # Layout general
│   │   └── NotificationBell.tsx # Notificaciones
│   │
│   ├── utils/                 # Utilidades
│   │   ├── api.ts            # Llamadas al backend
│   │   ├── storage.ts        # LocalStorage management
│   │   └── database.ts       # Conexión DB (Supabase)
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts          # Definición de tipos
│   │
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales
│
├── public/                    # Archivos estáticos
│   └── images/               # Imágenes del proyecto
│       └── residuos/         # Imágenes de tipos de residuos
│
├── dist/                      # Build de producción (generado)
│
├── package.json              # Dependencias frontend
├── vite.config.ts            # Configuración Vite
├── tsconfig.json             # Configuración TypeScript
├── tailwind.config.js        # Configuración Tailwind CSS
└── README.md                 # Documentación principal
```

---

### Archivos Clave

#### 1. `backend/server.js` - Servidor Express

**Responsabilidades:**
- API REST endpoints
- Conexión a PostgreSQL
- CORS configuration
- Manejo de errores

**Endpoints principales:**
```javascript
GET  /api/records          # Obtener todos los registros
POST /api/records          # Crear nuevo registro
GET  /api/messages         # Obtener mensajes
POST /api/messages         # Crear mensaje
PUT  /api/messages/:id     # Marcar mensaje como leído
```

---

#### 2. `src/components/Dashboard.tsx` - Vista de Análisis

**Responsabilidades:**
- Mostrar gráficas (Chart.js)
- Filtros multi-select
- Procesamiento de datos
- Generación de colores

**Configuración de gráficas:**
- Líneas 37-109: Definición de tipos y ubicaciones
- Líneas 175-198: Procesamiento de datos
- Líneas 196-234: Funciones de colores
- Líneas 236-307: Configuración de gráficas

---

#### 3. `src/components/TabletWasteForm.tsx` - Vista Operador

**Responsabilidades:**
- Formulario optimizado para tablet
- Captura de múltiples residuos
- Envío de mensajes a administrador
- Validación de datos

**Configuración:**
- Líneas 18-157: Tipos de residuos (WASTE_TYPES)
- Líneas 159-208: Ubicaciones (HOTEL_AREAS)

---

#### 4. `src/components/WasteForm.tsx` - Vista Administrador

**Responsabilidades:**
- Formulario completo de captura
- Validación de datos
- Integración con backend

**Configuración:**
- Líneas 11-29: Tipos de residuos (WASTE_TYPES)
- Líneas 31-80: Ubicaciones (LOCATIONS)

---

#### 5. `src/utils/api.ts` - Cliente API

**Responsabilidades:**
- Comunicación con backend
- Manejo de errores HTTP
- Transformación de datos

**URL del backend:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

---

## 6. GESTIÓN DE ICONOS E IMÁGENES

### Iconos vs Imágenes

El proyecto usa dos sistemas:

1. **Iconos Emoji (Actual):** 🍖 🍊 🗑️
2. **Iconos Lucide:** Componentes SVG importados

### Opción A: Cambiar Emojis por Imágenes

#### Paso 1: Preparar Imágenes

```bash
# Crear directorio si no existe
mkdir -p public/images/residuos

# Copiar imágenes (formato PNG o SVG, tamaño 64x64px)
# Nombres sugeridos:
public/images/residuos/
├── organicos.png
├── organicos-citricos.png
├── inorganicos.png
├── pet.png
├── plastico-duro.png
├── emplaye.png
├── bopp.png
├── vidrio.png
├── aluminio.png
├── carton.png
├── papel.png
├── lata.png
├── tetrapak.png
├── textiles.png
├── chatarra.png
├── cafe.png
└── residuos-rancho.png
```

#### Paso 2: Modificar TabletWasteForm.tsx

**ANTES (Emojis):**
```typescript
const WASTE_TYPES = [
  {
    id: 'organicos',
    name: 'Orgánicos',
    icon: '🍖',  // Emoji
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  // ...
];
```

**DESPUÉS (Imágenes):**
```typescript
const WASTE_TYPES = [
  {
    id: 'organicos',
    name: 'Orgánicos',
    icon: '/images/residuos/organicos.png',  // Ruta imagen
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  // ...
];
```

#### Paso 3: Modificar el Renderizado

**Buscar en TabletWasteForm.tsx (línea ~300):**

**ANTES:**
```tsx
<div className="text-4xl mb-2">{waste.icon}</div>
```

**DESPUÉS:**
```tsx
<img
  src={waste.icon}
  alt={waste.name}
  className="w-16 h-16 mb-2 object-contain"
/>
```

---

### Opción B: Usar Iconos Lucide React

#### Paso 1: Importar Iconos

```typescript
import {
  Beef,          // Orgánicos
  Orange,        // Cítricos
  Trash2,        // Inorgánicos
  Bottle,        // PET
  Container,     // Plástico duro
  ShoppingBag,   // Emplaye
  FileText,      // BOPP
  Wine,          // Vidrio
  Droplet,       // Aluminio
  Box,           // Cartón
  BookOpen,      // Papel
  Soup,          // Lata
  Package,       // Tetrapak
  Shirt,         // Textiles
  Wrench,        // Chatarra
  Coffee         // Café
} from 'lucide-react';
```

#### Paso 2: Modificar Array

```typescript
const WASTE_TYPES = [
  {
    id: 'organicos',
    name: 'Orgánicos',
    IconComponent: Beef,  // Componente Lucide
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  // ...
];
```

#### Paso 3: Renderizar

```tsx
<waste.IconComponent className="w-16 h-16 mb-2 text-green-600" />
```

---

### Rutas de Imágenes

#### Desarrollo (Vite):
```typescript
// Imágenes en /public se sirven desde la raíz
<img src="/images/residuos/organicos.png" />

// Imágenes en /src/assets requieren import
import organicoImg from './assets/organicos.png';
<img src={organicoImg} />
```

#### Producción:
```typescript
// Después del build, las imágenes de /public están en /dist
// La ruta es la misma: /images/residuos/organicos.png
```

---

### Optimización de Imágenes

```bash
# Convertir a WebP (mejor compresión)
cwebp -q 80 organicos.png -o organicos.webp

# Redimensionar todas a 64x64
for img in *.png; do
  convert "$img" -resize 64x64 "$img"
done
```

---

### Iconos de Ubicaciones (HOTEL_AREAS)

**Actual:**
```typescript
const HOTEL_AREAS = [
  { id: 'na', name: 'NA (No aplica)', icon: '🚫' },
  { id: 'cocina-central', name: 'Cocina central', icon: '👨‍🍳' },
  // ...
];
```

**Para cambiar a imágenes:**
```typescript
const HOTEL_AREAS = [
  {
    id: 'na',
    name: 'NA (No aplica)',
    icon: '/images/ubicaciones/na.png'
  },
  {
    id: 'cocina-central',
    name: 'Cocina central',
    icon: '/images/ubicaciones/cocina.png'
  },
  // ...
];
```

---

## 7. CONEXIÓN CON HOSTINGER

### Paso 1: Configurar DNS en Hostinger

1. **Acceder a Hostinger:**
   - Panel de Control → Dominios
   - Seleccionar tu dominio

2. **Configurar DNS:**
   - Click en "Administrar DNS"
   - Agregar registros:

#### Opción A: Dominio Principal

```
Tipo: A
Nombre: @
Valor: [IP de Render]
TTL: 3600
```

```
Tipo: CNAME
Nombre: www
Valor: tu-app.onrender.com
TTL: 3600
```

#### Opción B: Subdominio

```
Tipo: CNAME
Nombre: residuos
Valor: tu-app.onrender.com
TTL: 3600
```

---

### Paso 2: Configurar Dominio Personalizado en Render

1. **Dashboard de Render:**
   - Selecciona tu servicio web
   - Settings → Custom Domain

2. **Agregar Dominio:**
   ```
   tudominio.com
   www.tudominio.com
   ```

3. **Verificar:**
   - Render validará automáticamente
   - Esperar propagación DNS (5-30 minutos)

4. **SSL/HTTPS:**
   - Render provee certificado SSL gratis
   - Se activa automáticamente

---

### Paso 3: Actualizar Frontend

En `.env`:
```env
VITE_API_URL=https://api.tudominio.com
```

Rebuild y redeploy:
```bash
npm run build
# Subir dist/ a Hostinger o redeploy en Render
```

---

### Paso 4: Desplegar Frontend en Hostinger

#### Opción 1: Frontend en Hostinger, Backend en Render

1. **Build del Frontend:**
   ```bash
   npm run build
   ```

2. **Subir a Hostinger:**
   - FileManager → public_html/
   - Subir TODO el contenido de `dist/`

3. **Estructura en Hostinger:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-xxx.js
   │   ├── index-xxx.css
   │   └── ...
   └── images/
   ```

4. **Configurar .htaccess (SPA):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

#### Opción 2: Todo en Render

- Frontend como Static Site
- Backend como Web Service
- Más simple, todo centralizado

---

### Configuración DNS Completa

```
# Dominio principal → Frontend en Hostinger
Tipo: A
Nombre: @
Valor: [IP de Hostinger]

# www → Frontend en Hostinger
Tipo: CNAME
Nombre: www
Valor: tudominio.com

# api → Backend en Render
Tipo: CNAME
Nombre: api
Valor: tu-backend.onrender.com

# Resultado:
# https://tudominio.com → Frontend
# https://www.tudominio.com → Frontend
# https://api.tudominio.com → Backend API
```

---

## 8. MANTENIMIENTO Y ACTUALIZACIÓN

### Actualizar Código

#### Con GitHub (Auto-deploy):
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
# Render despliega automáticamente
```

#### Sin GitHub:
1. Dashboard de Render
2. Manual Deploy → Deploy latest commit

---

### Backup de Base de Datos

```bash
# Backup manual
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Backup automático con cron
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql
```

---

### Restaurar Base de Datos

```bash
# Restaurar desde backup
psql $DATABASE_URL < backup-20250101.sql
```

---

### Monitoreo

#### Logs en Render:
1. Dashboard → Tu servicio
2. Logs (tiempo real)
3. Filtrar por errores

#### Métricas:
- Dashboard → Metrics
- CPU, Memory, Response time

---

### Escalabilidad

#### Cuando el Free tier no es suficiente:

1. **Starter Plan ($7/mes):**
   - 512 MB RAM
   - 0.5 CPU
   - Sin sleep automático

2. **Standard Plan ($25/mes):**
   - 2 GB RAM
   - 1 CPU
   - Health checks

3. **Optimizaciones:**
   - Implementar Redis para caché
   - Usar CDN para assets estáticos
   - Optimizar queries SQL con índices

---

## 🔒 SEGURIDAD

### Mejores Prácticas

1. **Nunca subir .env a Git:**
   ```bash
   # Verificar .gitignore
   cat .gitignore | grep .env
   ```

2. **Usar variables de entorno:**
   - No hardcodear credenciales
   - Usar process.env en Node.js
   - Usar import.meta.env en Vite

3. **CORS restrictivo:**
   ```javascript
   // Permitir solo dominios conocidos
   app.use(cors({
     origin: ['https://tudominio.com']
   }));
   ```

4. **Validar inputs:**
   ```javascript
   // Backend validation
   if (!type || !location || !weight) {
     return res.status(400).json({ error: 'Missing fields' });
   }
   ```

5. **SQL Injection Protection:**
   ```javascript
   // Usar prepared statements
   const query = 'SELECT * FROM records WHERE id = $1';
   db.query(query, [id]);
   ```

---

## 📞 SOPORTE Y CONTACTO

### Recursos Útiles

- **Render Docs:** https://render.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Vite Docs:** https://vitejs.dev/
- **React Docs:** https://react.dev/

### Logs y Debugging

```bash
# Ver logs en tiempo real (Render)
render logs -f

# Probar endpoint local
curl http://localhost:3001/api/records

# Probar endpoint producción
curl https://api.tudominio.com/api/records
```

---

## ✅ CHECKLIST DE DESPLIEGUE

### Pre-deployment:
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y migrada
- [ ] Build local exitoso
- [ ] Tests pasando
- [ ] .gitignore actualizado

### Deployment:
- [ ] Código subido a GitHub
- [ ] Servicio web creado en Render
- [ ] Variables de entorno en Render
- [ ] Base de datos conectada
- [ ] Primer deploy exitoso

### Post-deployment:
- [ ] URL funcional
- [ ] API endpoints responden
- [ ] Frontend conecta con backend
- [ ] DNS configurado (si aplica)
- [ ] SSL activo
- [ ] Backup configurado

---

## 🎉 ¡PROYECTO DESPLEGADO!

Tu aplicación está ahora en producción y accesible desde cualquier lugar.

**URLs típicas:**
- Frontend: https://tudominio.com
- Backend API: https://api.tudominio.com
- Base de datos: Interna en Render

**Próximos pasos:**
1. Monitorear logs regularmente
2. Configurar alertas
3. Planear backups automáticos
4. Documentar cambios
5. Capacitar equipo

---

**Documento creado:** 2025
**Versión:** 1.0
**Autor:** Sistema de Gestión de Residuos - Equipo Técnico
