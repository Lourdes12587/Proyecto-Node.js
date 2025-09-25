const express = require('express');
const router = express.Router();
//const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
//const { body, validationResult } = require("express-validator");
const crud = (require ("../../controllers/updateAdmin"));
//const controller = (require ("../controllers/saveAdmin"));
//const jwt = require("jsonwebtoken");
//const verifyAdmin = (require ("../middlewares/verifyAdmin"));
//const verifyToken = (require ("../middlewares/verifyToken"));
//const authController = require('../../controllers/authController');

function isAdmin(req, res, next) {
  if (req.session.rol === "admin") return next();
  res.redirect('/loginadmin');
}

router.get('/admin', isAdmin, (req, res) => {
  db.query("SELECT * FROM participantes", (err, results) => {
    if (err) return res.send("Error al cargar participantes");

    db.query("SELECT COUNT(*) AS total FROM participantes", (err, count) => {
     if (err) return res.send("Error al contar participantes");

      res.render("admin", {
        //participantes: results,
        //totalParticipantes: count[0].total,
        //login: req.session.user || null
        participantes: results,
        totalParticipantes: count[0].total,
      });
    });
  });
})


router.get("/editadmin/:id", isAdmin, (req, res) => {
    const id = req.params.id;

      db.query("SELECT * FROM participantes WHERE id = ?", [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.redirect("/admin");
        }
        if (results.length === 0) {
            return res.send("Participante no encontrado");
        }

        res.render("editadmin", {
            participante: results[0]  
        });
    });
});


router.get('/delete/:id', isAdmin, (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM participantes WHERE id = ?", [id], (err, result) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/admin');
        }
    });
});

//actualizar
router.post('/updateAdmin', isAdmin, crud.update);


router.post('/ganadores', isAdmin, (req, res) => {
  let { primero, segundo, tercero } = req.body;

  // Convertir a números
  primero = parseInt(primero);
  segundo = parseInt(segundo);
  tercero = parseInt(tercero);

  // Validar que sean números válidos
  if (!primero || !segundo || !tercero) {
    return res.send("Por favor ingrese dorsales válidos");
  }

  // Validar que los dorsales existen
  db.query(
    "SELECT id FROM participantes WHERE id IN (?, ?, ?)",
    [primero, segundo, tercero],
    (err, results) => {
      if (err) return res.send("Error al validar dorsales");

      if (results.length !== 3) return res.send("Uno o más dorsales no existen");

      // Preparar array para INSERT
      const ganadores = [
        [primero, 1],
        [segundo, 2],
        [tercero, 3]
      ];

      // Borrar ganadores anteriores
      db.query("DELETE FROM ganadores", (err) => {
        if (err) return res.send("Error al limpiar ganadores");

        // Insertar nuevos ganadores
        db.query(
          "INSERT INTO ganadores (participante_id, posicion) VALUES (?, ?), (?, ?), (?, ?)",
          [primero, 1, segundo, 2, tercero, 3],
          (err) => {
            if (err) return res.send("Error al registrar ganadores");
            res.redirect('/admin');
          }
        );
      });
    }
  );
});

module.exports = router;