# Guía de Despliegue en Hostinger

## Solución al Error 403

El error 403 "Access to this resource on the server is denied" se ha solucionado con las siguientes configuraciones:

### 1. Archivo .htaccess Incluido

Se ha creado automáticamente un archivo `.htaccess` en la carpeta `dist/` que:
- Habilita la reescritura de URLs para Single Page Applications
- Deshabilita el listado de directorios
- Configura compresión y caché
- Añade encabezados de seguridad

### 2. Instrucciones de Despliegue

#### Paso 1: Construir el proyecto
```bash
npm run build
```

#### Paso 2: Acceder al File Manager de Hostinger
1. Inicia sesión en tu panel de Hostinger
2. Ve a "File Manager"
3. Navega a la carpeta `public_html` (o la carpeta raíz de tu dominio)

#### Paso 3: Subir los archivos
1. **IMPORTANTE**: Elimina cualquier archivo anterior en `public_html`
2. Sube TODO el contenido de la carpeta `dist/` a `public_html`
   - Asegúrate de incluir el archivo `.htaccess` (archivos ocultos)
   - Asegúrate de incluir la carpeta `assets/`
   - Asegúrate de incluir el archivo `index.html`

#### Paso 4: Verificar permisos
En el File Manager de Hostinger, verifica que los permisos sean:
- Carpetas: 755
- Archivos: 644
- `.htaccess`: 644

Para cambiar permisos:
1. Click derecho en el archivo/carpeta
2. Selecciona "Permissions"
3. Establece los permisos correctos

#### Paso 5: Verificar estructura
Tu `public_html` debe verse así:
```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    ├── vendor-[hash].js
    ├── charts-[hash].js
    └── icons-[hash].js
```

### 3. Solución de Problemas Comunes

#### Error 403 persiste
- Verifica que el archivo `.htaccess` se haya subido correctamente
- Verifica que no haya un archivo `.htaccess` previo en conflicto
- Asegúrate de que los permisos sean correctos (644 para .htaccess)
- Contacta al soporte de Hostinger para verificar que mod_rewrite esté habilitado

#### La página no carga los estilos/scripts
- Verifica que la carpeta `assets/` esté completa
- Verifica que los permisos de la carpeta `assets/` sean 755
- Verifica que los archivos dentro de `assets/` tengan permisos 644

#### Página en blanco
- Abre la consola del navegador (F12) para ver errores
- Verifica que el archivo `index.html` esté en la raíz de `public_html`
- Verifica que todos los archivos JS se hayan subido correctamente

### 4. Verificación Post-Despliegue

1. Visita tu dominio en el navegador
2. Verifica que la aplicación cargue correctamente
3. Prueba la navegación entre secciones
4. Abre la consola del navegador (F12) y verifica que no haya errores

### 5. Actualizar la Aplicación

Para actualizar la aplicación después de hacer cambios:

```bash
# 1. Hacer cambios en el código
# 2. Reconstruir
npm run build

# 3. Subir SOLO los archivos nuevos de la carpeta dist/ a public_html
# (Puedes reemplazar todos los archivos para mayor seguridad)
```

### Notas Importantes

- El archivo `.htaccess` se genera automáticamente en cada build
- NO modifiques manualmente el archivo `.htaccess` en `dist/`
- Si necesitas hacer cambios al `.htaccess`, edita el plugin en `vite.config.ts`
- Los archivos tienen hashes únicos, por lo que puedes cachearlos de forma agresiva
- La aplicación funciona con rutas relativas (`./`) para máxima compatibilidad
