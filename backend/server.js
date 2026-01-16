const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Conexión a Base de Datos (Render en la Nube)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

// 2. Seguridad y Permisos
app.use(helmet());
app.use(cors({
  origin: true, // Permite conexiones 
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- RUTAS ---

// A. LOGIN (Busca en DB, si falla usa respaldo)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`📨 Login solicitado: ${username}`);

    let user = null;

    // 1. Buscar en Base de Datos Real
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        user = result.rows[0];
      }
    } catch (dbError) {
      console.log("⚠️ DB vacía o sin usuarios, revisando respaldo local...");
    }

    // 2. Si no está en DB, usar credenciales de respaldo 
    if (!user) {
      const usuariosFijos = {
        'admin': { 
            id_usuario: 1, 
            username: 'admin', 
            password_hash: 'admin123', 
            rol: 'admin', 
            nombre_completo: 'Administrador Principal' 
        },
        'operador': { 
            id_usuario: 2, 
            username: 'operador', 
            password_hash: 'op123', 
            rol: 'operator', 
            nombre_completo: 'Operador de Turno' 
        }
      };

      if (usuariosFijos[username]) {
        console.log("⚡ Usando usuario de respaldo (Memoria Local)");
        user = usuariosFijos[username];
      }
    }

    // 3. Validar contraseña
    if (!user || password !== user.password_hash) {
       return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

// 4. Generar Token (Con respaldo por si falla Render)
    const token = jwt.sign(
      { userId: user.id_usuario, role: user.rol },
      process.env.JWT_SECRET || 'SecretsPlayaBlanca_Respaldo_2026',
      { expiresIn: '24h' }
    );

    // Mandamos la respuesta al navegador para que te deje entrar
    res.json({
      token,
      user: {
        id: user.id_usuario,
        username: user.username,
        name: user.nombre_completo,
        role: user.rol,
      },
    });

  } catch (error) {
    console.error("🔥 Error Login:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Middleware de Seguridad (También con seguro)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Acceso denegado: Token requerido' });
  
  // Usamos la misma palabra de respaldo aquí
  const secret = process.env.JWT_SECRET || 'SecretsPlayaBlanca_Respaldo_2026';
  
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

// B. GUARDAR RESIDUOS (Create)
app.post('/api/waste-records', authenticateToken, async (req, res) => {
  try {
    console.log("📢 Guardando registro:", req.body);
    const { type, location, weight } = req.body; 

    // Buscar IDs correspondientes a los nombres
    const tipoRes = await pool.query('SELECT id_tipo_residuo FROM cat_tipo_residuo WHERE nombre = $1', [type]);
    const ubi = await pool.query('SELECT id_ubicacion FROM cat_ubicacion WHERE nombre = $1', [location]);

    if (tipoRes.rows.length === 0 || ubi.rows.length === 0) {
      return res.status(400).json({ error: 'Error: Tipo de residuo o ubicación no existen en la DB.' });
    }

    // Insertar
    const nuevo = await pool.query(
      `INSERT INTO registro_residuo (id_tipo_residuo_fk, id_ubicacion_fk, peso_kg, fecha_ingreso)
       VALUES ($1, $2, $3, NOW()) RETURNING id_registro`,
      [tipoRes.rows[0].id_tipo_residuo, ubi.rows[0].id_ubicacion, weight]
    );

    console.log("✅ Guardado ID:", nuevo.rows[0].id_registro);
    res.status(201).json({ message: 'Guardado con éxito', id: nuevo.rows[0].id_registro });

  } catch (error) {
    console.error('🔥 Error al guardar:', error);
    res.status(500).json({ error: error.message });
  }
});

// C. OBTENER RESIDUOS (Read) - ¡ACTUALIZADO PARA EL DASHBOARD!
app.get('/api/waste-records', authenticateToken, async (req, res) => {
  try {
    // Consulta para unir las tablas y traer nombres en lugar de IDs
    const query = `
      SELECT 
        r.id_registro as id,
        tr.nombre as type,
        u.nombre as location,
        r.peso_kg as weight,
        to_char(r.fecha_ingreso, 'YYYY-MM-DD') as date,
        to_char(r.fecha_ingreso, 'HH24:MI') as time
      FROM registro_residuo r
      JOIN cat_tipo_residuo tr ON r.id_tipo_residuo_fk = tr.id_tipo_residuo
      JOIN cat_ubicacion u ON r.id_ubicacion_fk = u.id_ubicacion
      ORDER BY r.fecha_ingreso DESC
    `;
    
    const result = await pool.query(query);
    
    // Aseguramos que el peso sea un número 
    const data = result.rows.map(row => ({
      ...row,
      weight: parseFloat(row.weight)
    }));

    res.json(data);
  } catch (error) {
    console.error("🔥 Error al leer registros:", error);
    res.status(500).json({ error: error.message });
  }
});

// Arrancar Servidor
app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR LISTO en puerto ${PORT}`);
  console.log(`📡 Conectado a Render DB`);
  console.log(`🔓 Modo CORS: Permisivo (IPs locales aceptadas)`);
  console.log(`🔑 Usuarios activos: Admin / Operador (Respaldo + DB)`);
});