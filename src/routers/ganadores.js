const express = require('express');
const router = express.Router();
const db = require("../../config/db");

function isAdmin(req, res, next) {
  if (req.session && req.session.rol === "admin") return next();
  res.redirect('/loginadmin');
}

router.get('/ganadores', isAdmin, (req, res) => {
  res.render('ganadores', { mensaje: null });
});

router.post('/ganadores', isAdmin, (req, res) => {
  let { primero, segundo, tercero } = req.body;

  primero = parseInt(primero, 10);
  segundo = parseInt(segundo, 10);
  tercero = parseInt(tercero, 10);

  if (!primero || !segundo || !tercero) {
    return res.render('ganadores', { mensaje: 'Por favor ingrese dorsales válidos.', mensajeTipo: 'error' });
  }

  if (primero === segundo || primero === tercero || segundo === tercero) {
    return res.render('ganadores', { mensaje: 'Los dorsales no deben repetirse entre las posiciones.', mensajeTipo: 'error' });
  }

  db.query(
    "SELECT id FROM participantes WHERE id IN (?, ?, ?)",
    [primero, segundo, tercero],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.render('ganadores', { mensaje: 'Error al validar dorsales (DB).', mensajeTipo: 'error' });
      }

      if (!results || results.length !== 3) {
        return res.render('ganadores', { mensaje: 'Uno o más dorsales no existen.', mensajeTipo: 'error' });
      }


      db.query("DELETE FROM ganadores", (err) => {
        if (err) {
          console.error(err);
          return res.render('ganadores', { mensaje: 'Error al limpiar ganadores.', mensajeTipo: 'error' });
        }

        db.query(
          "INSERT INTO ganadores (participante_id, posicion) VALUES (?, ?), (?, ?), (?, ?)",
          [primero, 1, segundo, 2, tercero, 3],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.render('ganadores', { mensaje: 'Error al registrar ganadores.', mensajeTipo: 'error' });
            }
   
            return res.render('ganadores', { mensaje: 'Ganadores registrados correctamente.', mensajeTipo: 'success' });
            // o redirigir a /admin: res.redirect('/admin');
          }
        );
      });
    }
  );
});

module.exports = router;
