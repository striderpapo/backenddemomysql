// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || null,
  database: process.env.DB_NAME || 'demonodemysql',
  waitForConnections: true,
  connectionLimit: 5, // coincide con Clever Cloud
  queueLimit: 0
});

// exportamos pool con promesas
module.exports = pool.promise();

