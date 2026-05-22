const express = require('express');
const router = express.Router();
const db = require("../../config/db");
const bcrypt = require('bcrypt');

// Mostrar formulario de restablecer
router.get('/restablecer-password/:token', (req, res) => {
  const { token } = req.params;

  db.query(
    'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
    [token],
    (err, results) => {
      if (err || results.length === 0) return res.send('Token inválido o expirado');

      res.render('restablecer-password', { token });
    }
  );
});

// Guardar nueva contraseña
router.post('/restablecer-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  db.query(
    'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
    [token],
    async (err, results) => {
      if (err || results.length === 0) return res.send('Token inválido o expirado');

      const user_id = results[0].user_id;
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query('UPDATE participantes SET password = ? WHERE id = ?', [hashedPassword, user_id], (err2) => {
        if (err2) return res.send('Error al actualizar contraseña');

        // Borrar token
        db.query('DELETE FROM reset_tokens WHERE user_id = ?', [user_id], (err3) => {
          if (err3) console.error(err3);
          res.send('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
        });
      });
    }
  );
});

module.exports = router;
