const mysql = require('mysql2');
require('dotenv').config();

// Callback-based connection
const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT
});

// Proper promise-based pool (recommended for async/await)
const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT
});

const promisePool = pool.promise(); // ✅ THIS is correct

module.exports = {
   connection,   // callback style
   promisePool   // promise/async style
};
