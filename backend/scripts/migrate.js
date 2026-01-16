const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const SCHEMA = `
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'operator')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registros de residuos
CREATE TABLE IF NOT EXISTS waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuración de emails
CREATE TABLE IF NOT EXISTS email_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes de operadores
CREATE TABLE IF NOT EXISTS operator_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES users(id),
    operator_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    record_id UUID REFERENCES waste_records(id),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_waste_records_date ON waste_records(date);
CREATE INDEX IF NOT EXISTS idx_waste_records_type ON waste_records(type);
CREATE INDEX IF NOT EXISTS idx_waste_records_location ON waste_records(location);
CREATE INDEX IF NOT EXISTS idx_waste_records_created_by ON waste_records(created_by);
CREATE INDEX IF NOT EXISTS idx_operator_messages_read ON operator_messages(read);
CREATE INDEX IF NOT EXISTS idx_operator_messages_operator_id ON operator_messages(operator_id);
`;

async function runMigrations() {
  try {
    console.log('🔄 Ejecutando migraciones...');
    
    await pool.query(SCHEMA);
    
    console.log('✅ Migraciones completadas exitosamente');
    
    // Crear usuarios por defecto
    const bcrypt = require('bcryptjs');
    const adminHash = await bcrypt.hash('admin123', 10);
    const operatorHash = await bcrypt.hash('op123', 10);
    
    await pool.query(`
      INSERT INTO users (username, password_hash, name, role) VALUES 
      ('admin', $1, 'Administrador del Sistema', 'admin'),
      ('operador', $2, 'Operador de Campo', 'operator')
      ON CONFLICT (username) DO NOTHING
    `, [adminHash, operatorHash]);
    
    console.log('✅ Usuarios por defecto creados');
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();