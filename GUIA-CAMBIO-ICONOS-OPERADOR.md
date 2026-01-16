# Guía Completa: Cambiar Iconos por Imágenes en Vista de Operador

## 📍 ARCHIVO A MODIFICAR

**Archivo:** `src/components/TabletWasteForm.tsx`

**Ubicación exacta:** Líneas 18-148 (array `WASTE_TYPES`)

---

## 🎯 MAPEO EXACTO: Nombre → Archivo de Imagen

| Nombre en el código | Emoji actual | Línea | Archivo de imagen a usar |
|---------------------|--------------|-------|-------------------------|
| Orgánicos | 🍖 | 22 | `Orgánicos.jpg` |
| Orgánicos (naranja/limón) | 🍊 | 30 | `Naranja-Limon.jpg` |
| Inorgánicos - no valorizables | 🗑️ | 38 | `inorganico-no-valorizables.png` |
| Pet | 🍼 | 46 | `Pet.jpg` |
| Plástico duro | 🧴 | 54 | `Plástico-duro.webp` |
| Emplaye | 🛍️ | 62 | `Emplaye.jpg` |
| BOPP (envolturas) | 📄 | 70 | `BOPP.png` |
| Vidrio | 🍾 | 78 | `Vidrio.png` |
| Aluminio | 🥫 | 86 | `Lata-de-aluminio.webp` |
| Cartón | 📦 | 94 | `Cartón.jpg` |
| Papel, libros, revistas y periódicos | 📄 | 102 | `Papel-archivo.jpg` |
| Lata de conserva o latón | 🥫 | 110 | `laton.jpg` |
| Tetrapak | 🧃 | 118 | `Tetrapack.jpg` |
| Textiles | 👕 | 126 | `Textiles.jpg` |
| Chatarra | 🔩 | 134 | `chatarra.jpg` |
| Café para composta | ☕ | 142 | `cafe-composta.jpg` |

---

## 📝 CAMBIOS EXACTOS LÍNEA POR LÍNEA

### Ejemplo 1: Orgánicos (Línea 22)

**ANTES:**
```tsx
{
  id: 'organicos',
  name: 'Orgánicos',
  icon: '🍖',
  color: 'from-green-500 to-emerald-600',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-200'
},
```

**DESPUÉS:**
```tsx
{
  id: 'organicos',
  name: 'Orgánicos',
  icon: './images/residuos/Orgánicos.jpg',
  color: 'from-green-500 to-emerald-600',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-200'
},
```

**Cambio:** Reemplazar `'🍖'` por `'./images/residuos/Orgánicos.jpg'`

---

### Ejemplo 2: Orgánicos (naranja/limón) (Línea 30)

**ANTES:**
```tsx
{
  id: 'organicos-citricos',
  name: 'Orgánicos (naranja/limón)',
  icon: '🍊',
  color: 'from-orange-500 to-amber-600',
  bgColor: 'bg-orange-50',
  borderColor: 'border-orange-200'
},
```

**DESPUÉS:**
```tsx
{
  id: 'organicos-citricos',
  name: 'Orgánicos (naranja/limón)',
  icon: './images/residuos/Naranja-Limon.jpg',
  color: 'from-orange-500 to-amber-600',
  bgColor: 'bg-orange-50',
  borderColor: 'border-orange-200'
},
```

**Cambio:** Reemplazar `'🍊'` por `'./images/residuos/Naranja-Limon.jpg'`

---

### Ejemplo 3: Inorgánicos (Línea 38)

**ANTES:**
```tsx
{
  id: 'inorganicos',
  name: 'Inorgánicos - no valorizables',
  icon: '🗑️',
  color: 'from-gray-500 to-slate-600',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-200'
},
```

**DESPUÉS:**
```tsx
{
  id: 'inorganicos',
  name: 'Inorgánicos - no valorizables',
  icon: './images/residuos/inorganico-no-valorizables.png',
  color: 'from-gray-500 to-slate-600',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-200'
},
```

**Cambio:** Reemplazar `'🗑️'` por `'./images/residuos/inorganico-no-valorizables.png'`

---

### ⚡ TODOS LOS CAMBIOS EN UNA TABLA

| Línea | Buscar esto | Reemplazar por esto |
|-------|------------|---------------------|
| 22 | `icon: '🍖',` | `icon: './images/residuos/Orgánicos.jpg',` |
| 30 | `icon: '🍊',` | `icon: './images/residuos/Naranja-Limon.jpg',` |
| 38 | `icon: '🗑️',` | `icon: './images/residuos/inorganico-no-valorizables.png',` |
| 46 | `icon: '🍼',` | `icon: './images/residuos/Pet.jpg',` |
| 54 | `icon: '🧴',` | `icon: './images/residuos/Plástico-duro.webp',` |
| 62 | `icon: '🛍️',` | `icon: './images/residuos/Emplaye.jpg',` |
| 70 | `icon: '📄',` | `icon: './images/residuos/BOPP.png',` |
| 78 | `icon: '🍾',` | `icon: './images/residuos/Vidrio.png',` |
| 86 | `icon: '🥫',` | `icon: './images/residuos/Lata-de-aluminio.webp',` |
| 94 | `icon: '📦',` | `icon: './images/residuos/Cartón.jpg',` |
| 102 | `icon: '📄',` | `icon: './images/residuos/Papel-archivo.jpg',` |
| 110 | `icon: '🥫',` | `icon: './images/residuos/laton.jpg',` |
| 118 | `icon: '🧃',` | `icon: './images/residuos/Tetrapack.jpg',` |
| 126 | `icon: '👕',` | `icon: './images/residuos/Textiles.jpg',` |
| 134 | `icon: '🔩',` | `icon: './images/residuos/chatarra.jpg',` |
| 142 | `icon: '☕',` | `icon: './images/residuos/cafe-composta.jpg',` |

---

## 🔧 CAMBIO EN EL CÓDIGO DE RENDERIZADO

### Ubicación: Línea 383

El componente actualmente renderiza el emoji directamente. Necesitamos cambiarlo para que soporte imágenes.

**BUSCAR (alrededor de línea 383):**
```tsx
<div className="text-3xl mb-2">{type.icon}</div>
```

**REEMPLAZAR POR:**
```tsx
<div className="flex justify-center items-center mb-2">
  {type.icon.startsWith('./images') ? (
    <img
      src={type.icon}
      alt={type.name}
      className="w-12 h-12 object-contain"
    />
  ) : (
    <div className="text-3xl">{type.icon}</div>
  )}
</div>
```

**Explicación:**
- Detecta si el `icon` es una ruta de imagen (empieza con `./images`)
- Si es imagen: renderiza un `<img>` con tamaño 48x48 px
- Si es emoji: renderiza como antes
- Esto permite transición gradual (puedes cambiar uno por uno)

---

### Ubicación: Línea 424

Hay un segundo lugar donde se muestra el icono en la sección de detalles.

**BUSCAR (alrededor de línea 424):**
```tsx
<span className="text-2xl">{wasteType?.icon}</span>
```

**REEMPLAZAR POR:**
```tsx
{wasteType?.icon.startsWith('./images') ? (
  <img
    src={wasteType.icon}
    alt={wasteType.name}
    className="w-8 h-8 object-contain"
  />
) : (
  <span className="text-2xl">{wasteType.icon}</span>
)}
```

**Explicación:**
- Igual que el anterior pero con tamaño 32x32 px (más pequeño)
- Se usa en la lista de residuos seleccionados

---

## 📁 ESTRUCTURA DE CARPETAS

### En tu Proyecto Local

```
tu-proyecto/
├── public/
│   └── images/
│       └── residuos/
│           ├── BOPP.png
│           ├── cafe-composta.jpg
│           ├── Cartón.jpg
│           ├── chatarra.jpg
│           ├── Emplaye.jpg
│           ├── inorganico-no-valorizables.png
│           ├── Lata-de-aluminio.webp
│           ├── laton.jpg
│           ├── Naranja-Limon.jpg
│           ├── Orgánicos.jpg
│           ├── Papel-archivo.jpg
│           ├── Pet.jpg
│           ├── Plástico-duro.webp
│           ├── Tetrapack.jpg
│           ├── Textiles.jpg
│           └── Vidrio.png
├── src/
└── ...
```

### Después del Build (carpeta dist/)

```
dist/
├── images/
│   └── residuos/
│       ├── BOPP.png
│       ├── cafe-composta.jpg
│       ├── Cartón.jpg
│       └── ... (todas tus imágenes)
├── assets/
│   └── ... (archivos JS y CSS)
├── index.html
└── .htaccess
```

### En Hostinger (public_html)

```
public_html/
├── images/
│   └── residuos/
│       ├── BOPP.png
│       ├── cafe-composta.jpg
│       ├── Cartón.jpg
│       └── ... (todas tus imágenes)
├── assets/
├── index.html
└── .htaccess
```

---

## 🚀 PROCESO COMPLETO PASO A PASO

### Paso 1: Crear Carpeta de Residuos

En tu computadora local:

```bash
# Navega a tu proyecto
cd tu-proyecto

# Crea la carpeta
mkdir -p public/images/residuos
```

---

### Paso 2: Colocar las Imágenes

Copia todos tus archivos de imagen a `public/images/residuos/`:

```
public/images/residuos/
├── BOPP.png
├── cafe-composta.jpg
├── Cartón.jpg
├── chatarra.jpg
├── Emplaye.jpg
├── inorganico-no-valorizables.png
├── Lata-de-aluminio.webp
├── laton.jpg
├── Naranja-Limon.jpg
├── Orgánicos.jpg
├── Papel-archivo.jpg
├── Pet.jpg
├── Plástico-duro.webp
├── Tetrapack.jpg
├── Textiles.jpg
└── Vidrio.png
```

**IMPORTANTE:** Los nombres deben ser EXACTAMENTE como los mencionaste (con mayúsculas, acentos, etc.)

---

### Paso 3: Modificar el Código

Abre `src/components/TabletWasteForm.tsx` y realiza los cambios:

**3.1) Cambiar el array WASTE_TYPES (líneas 18-148)**

Reemplaza cada `icon: 'emoji'` por `icon: './images/residuos/Nombre.ext'` según la tabla anterior.

**3.2) Cambiar el renderizado en línea 383**

Busca:
```tsx
<div className="text-3xl mb-2">{type.icon}</div>
```

Reemplaza con:
```tsx
<div className="flex justify-center items-center mb-2">
  {type.icon.startsWith('./images') ? (
    <img
      src={type.icon}
      alt={type.name}
      className="w-12 h-12 object-contain"
    />
  ) : (
    <div className="text-3xl">{type.icon}</div>
  )}
</div>
```

**3.3) Cambiar el renderizado en línea 424**

Busca:
```tsx
<span className="text-2xl">{wasteType?.icon}</span>
```

Reemplaza con:
```tsx
{wasteType?.icon.startsWith('./images') ? (
  <img
    src={wasteType.icon}
    alt={wasteType.name}
    className="w-8 h-8 object-contain"
  />
) : (
  <span className="text-2xl">{wasteType.icon}</span>
)}
```

---

### Paso 4: Hacer el Build

```bash
npm run build
```

Esto generará la carpeta `dist/` con:
- `dist/images/residuos/` con todas tus imágenes
- `dist/assets/` con JS y CSS compilados
- `dist/index.html`
- `dist/.htaccess`

**Verificar:**
```bash
ls -la dist/images/residuos/

# Deberías ver tus 16 archivos de imagen
```

---

### Paso 5: Subir a Hostinger

#### Opción A: File Manager (Recomendado)

1. **Inicia sesión en Hostinger**
   - Ve a tu panel de control
   - Click en **File Manager**

2. **Navega a public_html**
   - En el File Manager, abre la carpeta `public_html`

3. **Crear carpeta de imágenes (si no existe)**
   - Click en **New Folder**
   - Nombre: `images`
   - Entra a la carpeta `images`
   - Click en **New Folder**
   - Nombre: `residuos`

4. **Subir las imágenes**
   - Entra a `public_html/images/residuos/`
   - Click en **Upload Files**
   - Selecciona TODAS las 16 imágenes desde tu carpeta `dist/images/residuos/`
   - Espera a que termine la carga

5. **Verificar permisos**
   - Selecciona la carpeta `images`
   - Click derecho → **Permissions** → `755`
   - Selecciona todas las imágenes dentro de `residuos/`
   - Click derecho → **Permissions** → `644`

6. **Subir el resto del proyecto**
   - Vuelve a `public_html`
   - Elimina el contenido anterior (assets antiguos, index.html viejo)
   - Sube TODO el contenido de `dist/` a `public_html/`

---

#### Opción B: FTP con FileZilla

1. **Conectar vía FTP**
   - Host: `ftp.tudominio.com`
   - Usuario: Tu usuario FTP
   - Contraseña: Tu contraseña FTP
   - Puerto: 21

2. **Subir carpeta de imágenes**
   - En el panel local (izquierda): navega a `dist/images/`
   - En el panel remoto (derecha): navega a `public_html/`
   - Arrastra la carpeta `images` completa de izquierda a derecha
   - Espera a que termine la transferencia

3. **Subir el resto**
   - Arrastra TODO el contenido de `dist/` a `public_html/`
   - Sobrescribe archivos si te pregunta

---

### Paso 6: Verificar en el Navegador

1. **Verificar que las imágenes existen**

   Visita directamente en tu navegador:
   ```
   https://tudominio.com/images/residuos/Orgánicos.jpg
   https://tudominio.com/images/residuos/Pet.jpg
   https://tudominio.com/images/residuos/BOPP.png
   ```

   Deberías ver las imágenes.

2. **Verificar la aplicación**

   - Visita tu sitio: `https://tudominio.com`
   - Inicia sesión como operador
   - Ve a la vista de registro (tablet)
   - Las imágenes deberían aparecer en lugar de los emojis

3. **Verificar errores**

   - Abre la consola del navegador (F12)
   - Ve a la pestaña **Console**
   - Si hay errores 404, verifica:
     - Que los nombres de archivo sean exactos
     - Que las imágenes estén en `public_html/images/residuos/`
     - Que los permisos sean correctos

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### Problema 1: Las imágenes no aparecen (error 404)

**Causa:** Ruta incorrecta o archivos no subidos

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores tipo: `GET https://tudominio.com/images/residuos/Orgánicos.jpg 404 (Not Found)`
3. Verifica en Hostinger File Manager que el archivo exista en `public_html/images/residuos/Orgánicos.jpg`
4. Verifica que el nombre sea EXACTAMENTE igual (con mayúsculas y acentos)

---

### Problema 2: Las imágenes aparecen en local pero no en Hostinger

**Causa:** Olvidaste subir la carpeta `images/`

**Solución:**
1. Verifica que la carpeta exista en Hostinger: `public_html/images/residuos/`
2. Verifica que las 16 imágenes estén dentro
3. Si no están, súbelas manualmente desde el File Manager

---

### Problema 3: Las imágenes se ven muy grandes o muy pequeñas

**Causa:** Tamaño de imagen incorrecto

**Solución:**
Ajusta las clases de CSS:

```tsx
// Para la selección principal (más grande)
className="w-12 h-12 object-contain"  // 48x48 px

// Para la lista de seleccionados (más pequeño)
className="w-8 h-8 object-contain"   // 32x32 px

// Si quieres más grande
className="w-16 h-16 object-contain" // 64x64 px

// Si quieres más pequeño
className="w-6 h-6 object-contain"   // 24x24 px
```

---

### Problema 4: Algunas imágenes tienen fondo blanco

**Causa:** Formato JPEG o imagen sin transparencia

**Solución:**
- Usa PNG para imágenes con transparencia
- Si es JPG/JPEG, asegúrate de que el fondo combine con tu diseño
- Considera convertir a PNG con fondo transparente

---

### Problema 5: Error de acentos o caracteres especiales

**Causa:** Codificación incorrecta de nombres de archivo

**Síntomas:**
```
GET /images/residuos/Org%C3%A1nicos.jpg 404 (Not Found)
```

**Solución:**
1. Renombra los archivos sin acentos:
   - `Orgánicos.jpg` → `Organicos.jpg`
   - `Cartón.jpg` → `Carton.jpg`

2. Actualiza el código:
   ```tsx
   icon: './images/residuos/Organicos.jpg',
   ```

**Alternativa (mantener acentos):**
- Asegúrate de que tu editor de código use UTF-8
- Verifica que los archivos en Hostinger tengan los nombres correctos con acentos

---

## 📊 VERIFICACIÓN FINAL

Antes de considerar el trabajo completo, verifica:

- [ ] Las 16 imágenes están en `public/images/residuos/`
- [ ] Los nombres de archivo son EXACTOS (mayúsculas, acentos, extensiones)
- [ ] El código en `TabletWasteForm.tsx` tiene las 16 rutas correctas
- [ ] El renderizado en línea 383 fue modificado
- [ ] El renderizado en línea 424 fue modificado
- [ ] Ejecutaste `npm run build` correctamente
- [ ] La carpeta `dist/images/residuos/` contiene las 16 imágenes
- [ ] Subiste TODO el contenido de `dist/` a `public_html/`
- [ ] Los permisos son correctos (755 para carpetas, 644 para archivos)
- [ ] Probaste el sitio en el navegador
- [ ] Las imágenes aparecen en lugar de los emojis
- [ ] No hay errores 404 en la consola

---

## 🎯 RESUMEN DE RUTAS

### Desarrollo (local):
```
public/images/residuos/Orgánicos.jpg → Archivo físico
```

### Código React:
```tsx
icon: './images/residuos/Orgánicos.jpg' → Ruta relativa
```

### Build (dist/):
```
dist/images/residuos/Orgánicos.jpg → Vite copia automáticamente
```

### Producción (Hostinger):
```
public_html/images/residuos/Orgánicos.jpg → Sube manualmente
https://tudominio.com/images/residuos/Orgánicos.jpg → URL final
```

---

## 💡 CONSEJOS ADICIONALES

### 1. Optimizar Imágenes

Antes de subir, optimiza tus imágenes para web:

- **Tamaño recomendado:** 100x100 px a 200x200 px
- **Peso máximo:** 100 KB por imagen
- **Herramientas:**
  - TinyPNG: https://tinypng.com/
  - Squoosh: https://squoosh.app/

### 2. Formatos Recomendados

- **PNG:** Para iconos con fondo transparente
- **JPG:** Para fotos de residuos reales
- **WebP:** Formato moderno, menor peso, buena calidad

### 3. Nombres de Archivo

**Recomendación:** Evita caracteres especiales en nombres de archivo:

En lugar de:
```
Orgánicos.jpg → Organicos.jpg
Cartón.jpg → Carton.jpg
```

Esto evita problemas de codificación en diferentes servidores.

### 4. Respaldo

Antes de modificar el código:

```bash
# Crea una copia del archivo original
cp src/components/TabletWasteForm.tsx src/components/TabletWasteForm.tsx.backup
```

Si algo sale mal, puedes restaurar:

```bash
cp src/components/TabletWasteForm.tsx.backup src/components/TabletWasteForm.tsx
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Sigue este checklist paso a paso:

### Preparación
- [ ] Tengo las 16 imágenes listas
- [ ] Las imágenes están optimizadas (< 100 KB cada una)
- [ ] Los nombres de archivo son correctos
- [ ] Hice backup del archivo original

### Desarrollo Local
- [ ] Creé la carpeta `public/images/residuos/`
- [ ] Copié las 16 imágenes a la carpeta
- [ ] Modifiqué el array WASTE_TYPES (16 cambios)
- [ ] Modifiqué el renderizado en línea 383
- [ ] Modifiqué el renderizado en línea 424
- [ ] Guardé el archivo
- [ ] Probé en local con `npm run dev`
- [ ] Las imágenes se ven correctamente

### Build
- [ ] Ejecuté `npm run build`
- [ ] Verifiqué que `dist/images/residuos/` tiene las 16 imágenes
- [ ] Verifiqué que `.htaccess` existe en `dist/`

### Hostinger
- [ ] Subí la carpeta `images/residuos/` completa a `public_html/`
- [ ] Verifiqué permisos: carpetas 755, archivos 644
- [ ] Subí el resto del contenido de `dist/` a `public_html/`
- [ ] Probé URLs directas de imágenes en el navegador
- [ ] Probé la aplicación completa
- [ ] No hay errores en la consola
- [ ] Las imágenes se cargan correctamente

---

¡Con esta guía completa podrás cambiar todos los emojis por tus imágenes reales sin problemas!
