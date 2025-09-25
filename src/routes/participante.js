const express = require('express');
const router = express.Router();
//const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
//const { body, validationResult } = require("express-validator");
//const authController = require('../../controllers/authcontroller');
//const jwt = require("jsonwebtoken");
//const verifyAdmin = (require ("../middlewares/verifyAdmin"));
//const verifyToken = (require ("../middlewares/verifyToken"));

function isLoggedIn(req, res, next) {
  if (req.session.loggedin) return next();
  res.redirect('/login');
}

 //miperfil
router.get("/perfil", isLoggedIn, (req, res) => {
  const id = req.user.id;
  if (!id) return res.redirect("/login");

  db.query("SELECT * FROM participantes WHERE id = ?", [id], (error, results) => {
    if (error) throw error;
    res.render("perfil", { user: results[0] });
  });
});

//editar/participantes
router.get("/edit/:id", isLoggedIn, (req, res) => {

    const id = req.params.id;

    db.query("SELECT * FROM participantes WHERE id = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render("edit", { participante: results[0] });
        }
    });
});

//actualizar
//router.post("/auth/participante", authController.loginParticipante);

module.exports = router;