# Guía Completa para Manejo de Imágenes

## 1. Estructura de Carpetas

### En tu proyecto local:
```
tu-proyecto/
├── public/
│   └── images/
│       ├── logo-residuos.png
│       ├── icono-formulario.png
│       ├── icono-dashboard.png
│       ├── icono-reportes.png
│       └── ... (otras imágenes)
├── src/
└── ...
```

### Después del build (carpeta dist/):
```
dist/
├── images/
│   ├── logo-residuos.png
│   ├── icono-formulario.png
│   └── ... (todas tus imágenes)
├── assets/
│   └── ... (archivos JS y CSS)
├── index.html
└── .htaccess
```

### En Hostinger (public_html):
```
public_html/
├── images/
│   ├── logo-residuos.png
│   ├── icono-formulario.png
│   └── ... (todas tus imágenes)
├── assets/
├── index.html
└── .htaccess
```

---

## 2. Cómo Preparar tus Imágenes

### Paso 1: Crear las imágenes
1. Crea o descarga las imágenes que necesites (.png o .jpg)
2. Renómbralas con nombres descriptivos sin espacios:
   - ✅ `logo-residuos.png`
   - ✅ `icono-dashboard.png`
   - ❌ `Logo Residuos.png`
   - ❌ `icono dashboard.png`

### Paso 2: Optimizar las imágenes (recomendado)
- Tamaño recomendado para iconos: 24x24 px a 48x48 px
- Tamaño recomendado para logos: 256x256 px o menor
- Formato: PNG con fondo transparente para iconos/logos
- Compresión: Usa herramientas como TinyPNG o Squoosh

### Paso 3: Colocar en el proyecto
1. Copia todas tus imágenes a: `public/images/`
2. Verifica que estén en la ubicación correcta

---

## 3. Cómo Reemplazar Iconos por Imágenes en el Código

### ANTES (con icono de lucide-react):
```tsx
import { Trash2 } from 'lucide-react';

<div className="bg-gradient-to-r from-blue-600 to-teal-600 w-10 h-10 rounded-full flex items-center justify-center">
  <Trash2 className="w-6 h-6 text-white" />
</div>
```

### DESPUÉS (con imagen):
```tsx
<div className="bg-gradient-to-r from-blue-600 to-teal-600 w-10 h-10 rounded-full flex items-center justify-center">
  <img
    src="./images/logo-residuos.png"
    alt="Logo Residuos"
    className="w-6 h-6 object-contain"
  />
</div>
```

### Ubicaciones exactas donde reemplazar iconos:

#### 1. Layout.tsx (línea 25) - Logo del header
**Ubicación:** `src/components/Layout.tsx`

**ANTES:**
```tsx
<Trash2 className="w-6 h-6 text-white" />
```

**DESPUÉS:**
```tsx
<img
  src="./images/logo-residuos.png"
  alt="Logo Sistema de Residuos"
  className="w-6 h-6 object-contain"
/>
```

#### 2. WasteForm.tsx (línea 129) - Icono del formulario
**Ubicación:** `src/components/WasteForm.tsx`

**ANTES:**
```tsx
<Plus className="w-5 h-5 text-green-600" />
```

**DESPUÉS:**
```tsx
<img
  src="./images/icono-formulario.png"
  alt="Formulario"
  className="w-5 h-5 object-contain"
/>
```

#### 3. Dashboard.tsx (línea 197) - Icono del dashboard
**Ubicación:** `src/components/Dashboard.tsx`

**ANTES:**
```tsx
<BarChart3 className="w-5 h-5 text-blue-600" />
```

**DESPUÉS:**
```tsx
<img
  src="./images/icono-dashboard.png"
  alt="Dashboard"
  className="w-5 h-5 object-contain"
/>
```

#### 4. Reports.tsx (línea 329) - Icono de reportes
**Ubicación:** `src/components/Reports.tsx`

**ANTES:**
```tsx
<FileText className="w-5 h-5 text-purple-600" />
```

**DESPUÉS:**
```tsx
<img
  src="./images/icono-reportes.png"
  alt="Reportes"
  className="w-5 h-5 object-contain"
/>
```

---

## 4. Rutas y Referencias en el Código

### Ruta en desarrollo y producción:
```tsx
// Siempre usa rutas relativas que empiecen con ./
<img src="./images/nombre-imagen.png" alt="Descripción" />
```

### ¿Por qué usar `./` al inicio?
- `./` significa "desde la carpeta raíz del proyecto compilado"
- Funciona tanto en desarrollo como en producción
- Es compatible con Hostinger

### Ejemplos de rutas correctas:
```tsx
<img src="./images/logo.png" />          ✅ Correcto
<img src="./images/iconos/trash.png" /> ✅ Correcto (con subcarpeta)
```

### Ejemplos de rutas incorrectas:
```tsx
<img src="/images/logo.png" />          ❌ Incorrecto (ruta absoluta)
<img src="images/logo.png" />           ❌ Incorrecto (falta ./)
<img src="../public/images/logo.png" /> ❌ Incorrecto (ruta de desarrollo)
```

---

## 5. Proceso Completo: De Local a Hostinger

### Paso 1: Preparar imágenes localmente
```bash
# En tu proyecto local
cd tu-proyecto
mkdir -p public/images
# Copia tus imágenes a public/images/
```

### Paso 2: Actualizar el código
- Reemplaza los iconos por tags `<img>` usando las rutas de la sección 3
- Guarda todos los cambios

### Paso 3: Hacer el build
```bash
npm run build
```

Esto creará la carpeta `dist/` con:
- `dist/images/` → Copia exacta de `public/images/`
- `dist/assets/` → Archivos JS y CSS compilados
- `dist/index.html` → Página principal
- `dist/.htaccess` → Configuración del servidor

### Paso 4: Verificar el build localmente
```bash
# Verifica que las imágenes estén en dist/
ls -la dist/images/

# Deberías ver tus archivos:
# logo-residuos.png
# icono-formulario.png
# icono-dashboard.png
# etc.
```

### Paso 5: Subir a Hostinger

#### Opción A: File Manager (Recomendado)
1. Inicia sesión en tu panel de Hostinger
2. Ve a **File Manager**
3. Navega a la carpeta `public_html`
4. **IMPORTANTE:** Elimina todo el contenido anterior de `public_html`
5. Sube TODO el contenido de tu carpeta `dist/` a `public_html`:
   - Selecciona todos los archivos dentro de `dist/`
   - Click en **Upload**
   - Espera a que termine la carga
6. Verifica que la estructura sea:
   ```
   public_html/
   ├── images/          ← Carpeta completa
   ├── assets/          ← Carpeta completa
   ├── index.html       ← Archivo
   ├── .htaccess        ← Archivo (puede estar oculto)
   └── favicon.ico      ← Archivo
   ```

#### Opción B: FTP con FileZilla
1. Descarga e instala FileZilla
2. Conéctate con tus credenciales FTP de Hostinger:
   - Host: `ftp.tudominio.com`
   - Usuario: Tu usuario FTP
   - Contraseña: Tu contraseña FTP
   - Puerto: 21
3. Navega en el servidor a `public_html`
4. Elimina todo el contenido anterior
5. Arrastra TODO el contenido de tu carpeta `dist/` local a `public_html` remoto
6. Espera a que termine la transferencia

### Paso 6: Verificar permisos en Hostinger
En el File Manager:
1. Click derecho en la carpeta `images/` → **Permissions** → `755`
2. Click derecho en cada imagen → **Permissions** → `644`

Permisos correctos:
- **Carpetas:** 755 (rwxr-xr-x)
- **Archivos:** 644 (rw-r--r--)

### Paso 7: Probar en el navegador
1. Visita tu dominio: `https://tudominio.com`
2. Verifica que las imágenes carguen correctamente
3. Abre la consola del navegador (F12) → pestaña **Console**
4. Si hay errores 404 en imágenes:
   - Verifica que las imágenes existan en `public_html/images/`
   - Verifica las rutas en el código
   - Verifica los permisos

---

## 6. Solución de Problemas Comunes

### Problema 1: Las imágenes no aparecen (error 404)
**Causa:** Ruta incorrecta o archivos no subidos

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores tipo: `GET https://tudominio.com/images/logo.png 404 (Not Found)`
3. Verifica en Hostinger File Manager que el archivo exista en `public_html/images/logo.png`
4. Verifica en tu código que la ruta sea: `./images/logo.png`

### Problema 2: Las imágenes aparecen en local pero no en Hostinger
**Causa:** Olvidaste subir la carpeta `images/`

**Solución:**
1. Verifica que hayas subido la carpeta `dist/images/` completa a Hostinger
2. Verifica que la carpeta esté en `public_html/images/` (NO dentro de `assets/`)

### Problema 3: Las imágenes se ven borrosas o pixeladas
**Causa:** Tamaño incorrecto de la imagen

**Solución:**
1. Usa imágenes con el doble de resolución (ej: 48x48 px para un icono de 24x24)
2. Usa formato PNG para iconos y logos
3. Asegúrate de que `object-contain` o `object-cover` estén en el className

### Problema 4: El icono queda muy grande o muy pequeño
**Causa:** Clases de tamaño incorrectas

**Solución:**
Ajusta las clases de Tailwind CSS:
```tsx
// Muy pequeño
<img className="w-4 h-4" />

// Pequeño
<img className="w-5 h-5" />

// Mediano (recomendado para iconos)
<img className="w-6 h-6" />

// Grande
<img className="w-8 h-8" />

// Extra grande
<img className="w-10 h-10" />
```

### Problema 5: La imagen tiene fondo blanco en lugar de transparente
**Causa:** Formato JPEG en lugar de PNG

**Solución:**
1. Convierte la imagen a PNG con fondo transparente
2. Usa herramientas como Photoshop, GIMP, o online: remove.bg

---

## 7. Ejemplo Completo Paso a Paso

### Escenario: Quiero reemplazar el logo del header

**Paso 1:** Tengo mi imagen `logo-secrets.png` (256x256 px, fondo transparente)

**Paso 2:** La coloco en `public/images/logo-secrets.png`

**Paso 3:** Abro `src/components/Layout.tsx` y busco línea 25:
```tsx
// ANTES:
<Trash2 className="w-6 h-6 text-white" />

// DESPUÉS:
<img
  src="./images/logo-secrets.png"
  alt="Logo Secrets"
  className="w-6 h-6 object-contain"
/>
```

**Paso 4:** También elimino el import que ya no necesito:
```tsx
// ANTES:
import { LogOut, Trash2, User } from 'lucide-react';

// DESPUÉS:
import { LogOut, User } from 'lucide-react';
```

**Paso 5:** Guardo y hago build:
```bash
npm run build
```

**Paso 6:** Verifico que la imagen esté en `dist/images/logo-secrets.png`

**Paso 7:** Subo TODO el contenido de `dist/` a `public_html/` en Hostinger

**Paso 8:** Visito mi sitio y veo el nuevo logo

---

## 8. Lista de Imágenes Sugeridas

Para reemplazar todos los iconos de tu aplicación, necesitarás estas imágenes:

| Archivo | Ubicación en código | Tamaño recomendado | Descripción |
|---------|---------------------|-------------------|-------------|
| `logo-residuos.png` | Layout.tsx línea 25 | 48x48 px | Logo principal del sistema |
| `icono-formulario.png` | WasteForm.tsx línea 129 | 40x40 px | Icono de formulario de registro |
| `icono-dashboard.png` | Dashboard.tsx línea 197 | 40x40 px | Icono de dashboard |
| `icono-reportes.png` | Reports.tsx línea 329 | 40x40 px | Icono de reportes |
| `icono-grafica-barras.png` | Dashboard.tsx línea 372 | 40x40 px | Icono de gráfica de barras |
| `icono-grafica-pastel.png` | Dashboard.tsx línea 396 | 40x40 px | Icono de gráfica de pastel |
| `icono-tendencia.png` | Dashboard.tsx línea 407 | 40x40 px | Icono de tendencia temporal |

**Recomendaciones:**
- Usa PNG con fondo transparente
- Colores que combinen con tu paleta (azules, verdes, naranjas)
- Estilo consistente (todos flat, todos 3D, etc.)

---

## 9. Checklist Final

Antes de subir a producción, verifica:

- [ ] Todas las imágenes están en `public/images/`
- [ ] Los nombres de archivo no tienen espacios ni caracteres especiales
- [ ] Las rutas en el código usan `./images/nombre.png`
- [ ] Ejecutaste `npm run build` correctamente
- [ ] La carpeta `dist/images/` contiene todas las imágenes
- [ ] Subiste TODO el contenido de `dist/` a `public_html/`
- [ ] Los permisos son correctos (755 para carpetas, 644 para archivos)
- [ ] Probaste el sitio en el navegador
- [ ] No hay errores 404 en la consola del navegador
- [ ] Las imágenes se ven bien en desktop, tablet y móvil

---

## 10. Recursos Adicionales

### Herramientas para optimizar imágenes:
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **Remove.bg:** https://www.remove.bg/ (para quitar fondos)

### Herramientas para crear iconos:
- **Flaticon:** https://www.flaticon.com/ (iconos gratis)
- **Icons8:** https://icons8.com/
- **Canva:** https://www.canva.com/ (diseño de logos)

### Verificar rutas en Hostinger:
Puedes verificar si una imagen existe visitando directamente:
```
https://tudominio.com/images/logo-residuos.png
```

Si aparece la imagen, la ruta es correcta. Si da 404, algo está mal.

---

¡Con esta guía completa podrás manejar las imágenes de tu proyecto sin problemas!
