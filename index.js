// index.js
const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// --- Rutas CRUD de USUARIOS ---

// ✅ Create
app.post('/usuarios', (req, res) => {
  const { nombre, email, telefono, contraseña } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, telefono, contraseña) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, email, telefono, contraseña], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nombre, email, telefono });
  });
});

// ✅ Read all
app.get('/usuarios', (req, res) => {
  db.query('SELECT id, nombre, email, telefono FROM usuarios', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Read by ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nombre, email, telefono FROM usuarios WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  });
});

// ✅ Update
app.put('/usuarios/:id', (req, res) => {
  const { nombre, email, telefono, contraseña } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, contraseña = ? WHERE id = ?';
  db.query(sql, [nombre, email, telefono, contraseña, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Usuario actualizado' });
  });
});

// ✅ Delete
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Usuario eliminado' });
  });
});

// --- Iniciar el servidor ---
app.listen(3000, () => {
  console.log('🚀 Servidor escuchando en http://localhost:3000');
});

// --- Rutas CRUD de SALAS ---

// ✅ CREATE
app.post('/salas', (req, res) => {
  const { nombre, descripcion, hora_apertura, hora_cierre } = req.body;
  const sql = 'INSERT INTO salas (nombre, descripcion, hora_apertura, hora_cierre) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, descripcion, hora_apertura, hora_cierre], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nombre, descripcion, hora_apertura, hora_cierre });
  });
});

// ✅ READ ALL
app.get('/salas', (req, res) => {
  db.query('SELECT * FROM salas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ READ BY ID
app.get('/salas/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM salas WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Sala no encontrada' });
    res.json(rows[0]);
  });
});

// ✅ UPDATE
app.put('/salas/:id', (req, res) => {
  const { nombre, descripcion, hora_apertura, hora_cierre } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE salas SET nombre = ?, descripcion = ?, hora_apertura = ?, hora_cierre = ? WHERE id = ?';
  db.query(sql, [nombre, descripcion, hora_apertura, hora_cierre, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Sala actualizada' });
  });
});

// ✅ DELETE
app.delete('/salas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM salas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Sala eliminada' });
  });
});

// --- Rutas CRUD de RESERVAS ---

// ✅ CREATE
app.post('/reservas', (req, res) => {
  const { id_usuario, id_sala, fecha, hora_inicio, hora_fin } = req.body;
  const sql = 'INSERT INTO reservas (id_usuario, id_sala, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id_usuario, id_sala, fecha, hora_inicio, hora_fin], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, id_usuario, id_sala, fecha, hora_inicio, hora_fin });
  });
});

// ✅ READ ALL
app.get('/reservas', (req, res) => {
  const sql = `
    SELECT r.id, u.nombre AS usuario, s.nombre AS sala, r.fecha, r.hora_inicio, r.hora_fin
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN salas s ON r.id_sala = s.id
    ORDER BY r.fecha, r.hora_inicio
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ READ BY ID
app.get('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT r.id, u.nombre AS usuario, s.nombre AS sala, r.fecha, r.hora_inicio, r.hora_fin
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN salas s ON r.id_sala = s.id
    WHERE r.id = ?
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json(rows[0]);
  });
});

// ✅ UPDATE
app.put('/reservas/:id', (req, res) => {
  const { id_usuario, id_sala, fecha, hora_inicio, hora_fin } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE reservas SET id_usuario = ?, id_sala = ?, fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?';
  db.query(sql, [id_usuario, id_sala, fecha, hora_inicio, hora_fin, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Reserva actualizada' });
  });
});

// ✅ DELETE
app.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reservas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Reserva eliminada' });
  });
});

app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND contraseña = ?';
  db.query(sql, [email, contraseña], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const { id, nombre, rol } = results[0];
    res.json({ id, nombre, rol });
  });
});