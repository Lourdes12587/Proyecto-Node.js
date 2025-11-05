const express = require('express');
const router = express.Router();
const db = require("../../config/db");

//pagina inicial
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/info', (req, res) => {

  db.query("SELECT COUNT(*) AS total FROM participantes", (err, totalRes) => {
    if (err) throw err;

    db.query(`
      SELECT g.posicion, p.id AS dorsal, p.nombre, p.apellido, p.foto
      FROM ganadores g
      JOIN participantes p ON g.participante_id = p.id
      ORDER BY g.posicion ASC
    `, (err, ganadoresRes) => {
      if (err) throw err;

      res.render('info', {
        total: totalRes[0].total,
        ganadores: ganadoresRes
      });
    });
  });
});
module.exports = router;