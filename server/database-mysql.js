const mysql = require('mysql2/promise');

// Configuración para PlanetScale
const dbConfig = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true
  }
};

let connection;

const connectDB = async () => {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
};

// Adapter para mantener compatibilidad con SQLite
const db = {
  get: async (sql, params = []) => {
    const conn = await connectDB();
    const [rows] = await conn.execute(sql, params);
    return rows[0];
  },
  
  all: async (sql, params = []) => {
    const conn = await connectDB();
    const [rows] = await conn.execute(sql, params);
    return rows;
  },
  
  run: async (sql, params = []) => {
    const conn = await connectDB();
    const [result] = await conn.execute(sql, params);
    return { lastID: result.insertId, changes: result.affectedRows };
  }
};

module.exports = db;