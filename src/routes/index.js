const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
//const { body, validationResult } = require("express-validator");
//const crud =(require ("../controllers/controller"));
//const { registrarGanador } = require("../controllers/ganadoresController");
//const { verificarToken } = require("../middleware/authMiddleware");
//const jwt = require("jsonwebtoken");


//pagina inicial
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/info', (req, res) => {
  // Obtener total de participantes
  db.query("SELECT COUNT(*) AS total FROM participantes", (err, totalRes) => {
    if (err) throw err;

    // Obtener ganadores ordenados por posición
    db.query(`
      SELECT g.posicion, p.id AS dorsal, p.nombre, p.apellido
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