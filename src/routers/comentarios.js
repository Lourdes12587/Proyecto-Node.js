const express = require('express');
const router = express.Router();
const db = require("../../config/db");

router.get('/comments', (req, res) => {
  db.query('SELECT * FROM comments WHERE approved = 1 ORDER BY created_at DESC LIMIT 200', (err, rows) => {
    if (err) {
      console.error('Error get comments:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});

router.post('/comments', (req, res) => {
  const { name, message, participant_id } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Mensaje vacío' });

  const sql = 'INSERT INTO comments (participant_id, name, message, approved) VALUES (?, ?, ?, ?)';
  // Cambia el último 1 por 0 si quieres moderación manual
  db.query(sql, [participant_id || null, name || null, message.trim(), 1], (err, result) => {
    if (err) {
      console.error('Error insert comment:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    db.query('SELECT * FROM comments WHERE id = ?', [result.insertId], (err2, rows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'DB error' });
      }
      const comment = rows[0];
      // Si tienes socket.io configurado en app: emitir a clientes
      if (req.app && req.app.get('io')) req.app.get('io').emit('broadcast-comment', comment);
      res.json({ success: true, comment });
    });
  });
});

module.exports = router;
