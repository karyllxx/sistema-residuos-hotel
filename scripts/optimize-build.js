const fs = require('fs');
const path = require('path');

console.log('🔧 Optimizando build para Hostinger...');

const distPath = path.join(__dirname, '../dist');

// Crear .htaccess para Hostinger
const htaccessContent = `# Configuración para SPA React en Hostinger
RewriteEngine On

# Manejar rutas de React Router
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compresión GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache para archivos estáticos
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Seguridad básica
<Files ".htaccess">
    Order Allow,Deny
    Deny from all
</Files>`;

// Escribir .htaccess
fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent);

// Crear robots.txt
const robotsContent = `User-agent: *
Allow: /

Sitemap: https://tu-dominio.com/sitemap.xml`;

fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsContent);

// Crear sitemap.xml básico
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tu-dominio.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapContent);

console.log('✅ Archivos de optimización creados:');
console.log('   - .htaccess (configuración Apache)');
console.log('   - robots.txt (SEO)');
console.log('   - sitemap.xml (SEO)');
console.log('');
console.log('📁 Carpeta lista para subir: ./dist/');
console.log('🌐 Sube todo el contenido de la carpeta dist/ a public_html en Hostinger');