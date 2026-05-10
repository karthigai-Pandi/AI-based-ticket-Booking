const mysql = require('mysql2/promise');
const { initializeSQLite, run: sqliteRun, get: sqliteGet, all: sqliteAll } = require('./sqliteDb');

let pool;
let useSQLite = false;

async function initialize() {
  try {
    // Try MySQL first
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ai_service_desk',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('MySQL connection established');
  } catch (mysqlError) {
    console.log('MySQL connection failed, falling back to SQLite:', mysqlError.message);
    try {
      await initializeSQLite();
      useSQLite = true;
      console.log('SQLite database initialized for development');
    } catch (sqliteError) {
      console.error('Both MySQL and SQLite failed:', sqliteError.message);
      throw sqliteError;
    }
  }
}

function getPool() {
  if (!pool && !useSQLite) {
    throw new Error('Database has not been initialized');
  }
  return pool;
}

async function execute(sql, params = []) {
  if (useSQLite) {
    if (sql.toLowerCase().trim().startsWith('select')) {
      return [await sqliteAll(sql, params)];
    } else {
      return [await sqliteRun(sql, params)];
    }
  } else {
    return await pool.execute(sql, params);
  }
}

module.exports = {
  initialize,
  getPool,
  execute,
  useSQLite
};
