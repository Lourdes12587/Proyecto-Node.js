const express = require('express');
const router = express.Router();
const db = require("../../config/db");
//const controller = require('../../controllers/updateparticipante');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/participantes'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'user_' + Date.now() + ext); // nombre único
  }
});

const upload = multer({ storage: storage });

function isLoggedIn(req, res, next) {
  if (req.session.loggedin  && req.session.user) return next();
  res.redirect('/login');
}

 //miperfil
router.get("/perfil", isLoggedIn, (req, res) => {

  const user = req.session.user;

  db.query("SELECT * FROM participantes WHERE id = ?", [user.id], (error, results) => {
    if (error) throw error;
    res.render("perfil", { user: results[0] });
  });
});

//editar/participantes
router.get("/edit/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM participantes WHERE id = ?", [id], (error, results) => {
    if (error) throw error;
    res.render("edit", { user: results[0] });
  });
});

router.post("/edit/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, dni, telefono, calle, numero, poblacion, codigo_postal } = req.body;

  const updateData = { nombre, apellido, dni, telefono, calle, numero, poblacion, codigo_postal };

  db.query("UPDATE participantes SET ? WHERE id = ?", [updateData, id], (error, results) => {
    if (error) throw error;
    res.redirect("/perfil");
  });
});

//router.post('/updateParticipante', isLoggedIn, updateController.update);

module.exports = router;