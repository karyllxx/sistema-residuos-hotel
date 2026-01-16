# Resumen: Cambiar Emojis por Imágenes en Vista Operador

## ✅ Lo que necesitas hacer

### 1️⃣ Preparar las Imágenes (16 archivos)

Coloca tus imágenes en: `public/images/residuos/`

**Lista de archivos requeridos:**
1. `Orgánicos.jpg`
2. `Naranja-Limon.jpg`
3. `inorganico-no-valorizables.png`
4. `Pet.jpg`
5. `Plástico-duro.webp`
6. `Emplaye.jpg`
7. `BOPP.png`
8. `Vidrio.png`
9. `Lata-de-aluminio.webp`
10. `Cartón.jpg`
11. `Papel-archivo.jpg`
12. `laton.jpg`
13. `Tetrapack.jpg`
14. `Textiles.jpg`
15. `chatarra.jpg`
16. `cafe-composta.jpg`

---

### 2️⃣ Modificar el Código

**Archivo:** `src/components/TabletWasteForm.tsx`

#### Cambio 1: Actualizar el array WASTE_TYPES (líneas 18-148)

Busca cada línea con `icon: 'emoji'` y reemplázala por la ruta de la imagen:

**Ejemplo:**
```tsx
// ANTES:
icon: '🍖',

// DESPUÉS:
icon: './images/residuos/Orgánicos.jpg',
```

**Todos los cambios:**
```tsx
icon: '🍖',   → icon: './images/residuos/Orgánicos.jpg',
icon: '🍊',   → icon: './images/residuos/Naranja-Limon.jpg',
icon: '🗑️',  → icon: './images/residuos/inorganico-no-valorizables.png',
icon: '🍼',   → icon: './images/residuos/Pet.jpg',
icon: '🧴',   → icon: './images/residuos/Plástico-duro.webp',
icon: '🛍️',  → icon: './images/residuos/Emplaye.jpg',
icon: '📄',   → icon: './images/residuos/BOPP.png',
icon: '🍾',   → icon: './images/residuos/Vidrio.png',
icon: '🥫',   → icon: './images/residuos/Lata-de-aluminio.webp',
icon: '📦',   → icon: './images/residuos/Cartón.jpg',
icon: '📄',   → icon: './images/residuos/Papel-archivo.jpg',
icon: '🥫',   → icon: './images/residuos/laton.jpg',
icon: '🧃',   → icon: './images/residuos/Tetrapack.jpg',
icon: '👕',   → icon: './images/residuos/Textiles.jpg',
icon: '🔩',   → icon: './images/residuos/chatarra.jpg',
icon: '☕',   → icon: './images/residuos/cafe-composta.jpg',
```

---

#### Cambio 2: Actualizar renderizado (línea ~383)

**BUSCAR:**
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

---

#### Cambio 3: Actualizar segundo renderizado (línea ~424)

**BUSCAR:**
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

---

### 3️⃣ Hacer el Build

```bash
npm run build
```

Verifica que las imágenes se copiaron:
```bash
ls dist/images/residuos/
# Deberías ver tus 16 archivos
```

---

### 4️⃣ Subir a Hostinger

**Opción A: File Manager**

1. Inicia sesión en Hostinger
2. Ve a **File Manager** → `public_html`
3. Crea carpeta: `images` → `residuos`
4. Sube las 16 imágenes a `public_html/images/residuos/`
5. Verifica permisos: carpetas **755**, archivos **644**
6. Sube el resto del contenido de `dist/` a `public_html/`

**Opción B: FTP**

1. Conecta con FileZilla
2. Sube carpeta `dist/images/residuos/` completa a `public_html/images/residuos/`
3. Sube el resto de `dist/` a `public_html/`

---

### 5️⃣ Verificar

**Probar URLs directas:**
```
https://tudominio.com/images/residuos/Orgánicos.jpg
https://tudominio.com/images/residuos/Pet.jpg
```

**Probar la aplicación:**
- Inicia sesión como operador
- Ve a la vista de registro (tablet)
- Las imágenes deben aparecer en lugar de los emojis

**Verificar errores:**
- Abre consola del navegador (F12)
- No debe haber errores 404

---

## 📁 Estructura Final

```
public_html/
├── images/
│   └── residuos/
│       ├── BOPP.png
│       ├── cafe-composta.jpg
│       ├── Cartón.jpg
│       ├── chatarra.jpg
│       ├── Emplaye.jpg
│       ├── inorganico-no-valorizables.png
│       ├── Lata-de-aluminio.webp
│       ├── laton.jpg
│       ├── Naranja-Limon.jpg
│       ├── Orgánicos.jpg
│       ├── Papel-archivo.jpg
│       ├── Pet.jpg
│       ├── Plástico-duro.webp
│       ├── Tetrapack.jpg
│       ├── Textiles.jpg
│       └── Vidrio.png
├── assets/
├── index.html
└── .htaccess
```

---

## ⚡ Comandos Rápidos

```bash
# Crear carpeta local
mkdir -p public/images/residuos

# Verificar build
ls dist/images/residuos/

# Hacer build
npm run build
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- **GUIA-CAMBIO-ICONOS-OPERADOR.md** - Guía completa paso a paso
- **public/images/residuos/README.md** - Lista de archivos requeridos

---

## ✅ Checklist Rápido

- [ ] Coloqué 16 imágenes en `public/images/residuos/`
- [ ] Modifiqué el array WASTE_TYPES (16 cambios)
- [ ] Actualicé renderizado en línea ~383
- [ ] Actualicé renderizado en línea ~424
- [ ] Ejecuté `npm run build`
- [ ] Verifiqué que `dist/images/residuos/` tiene las 16 imágenes
- [ ] Subí la carpeta completa a Hostinger
- [ ] Verifiqué permisos (755/644)
- [ ] Probé URLs directas
- [ ] Probé la aplicación
- [ ] No hay errores 404

---

## 🎯 LO QUE NO CAMBIA

✅ **Mantiene igual:**
- Lógica de registro de residuos
- Validaciones de formulario
- Función de inserción en base de datos
- Estilos generales del proyecto
- Funcionalidad de selección múltiple
- Compatibilidad con tablet/móvil

❌ **Solo cambia:**
- Los emojis por imágenes reales
- El código de renderizado para soportar imágenes

---

¡Todo listo! Ahora solo necesitas tus 16 imágenes y seguir los pasos.
