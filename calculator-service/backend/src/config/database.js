const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calculation_history (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        calculator_type VARCHAR(50) NOT NULL,
        input_params JSONB NOT NULL,
        result JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON calculation_history(user_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_calculator_type ON calculation_history(calculator_type)
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { pool, initDatabase };
