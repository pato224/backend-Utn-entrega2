const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // ⚠️ Cambiar según tu configuración
  password: '',          // ⚠️
  database: 'salas_ensayo_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

module.exports = db;