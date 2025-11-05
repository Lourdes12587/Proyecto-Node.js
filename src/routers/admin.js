const express = require('express');
const router = express.Router();
const db = require("../../config/db");
const crud = (require ("../../controllers/updateAdmin"));
//const controller = (require ("../controllers/saveAdmin"));

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


module.exports = router;