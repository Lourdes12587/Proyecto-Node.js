const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
const { body, validationResult } = require("express-validator");
//const authController = require('../../controllers/authController');
//const jwt = require("jsonwebtoken");

//organizadores
router.get('/loginadmin', (req, res) => {
    res.render('loginadmin');
});

router.post('/authadmin', async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  if (user && password) {
    db.query(
      "SELECT * FROM organizadores WHERE user = ?", 
      [user],
      async (error, results) => {
        if (
          results.length === 0 ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          return res.render("loginadmin", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrectos",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "loginadmin"
          });
        } else {

          req.session.loggedin = true;
          req.session.dni = results[0].dni;
        
        // Generar token con rol admin
        //const payload = {
        //  id: results[0].id,
        //  user: results[0].user,
  
        //};

        //const token = jwt.sign(payload, process.env.JWT_SECRET, {
        //  expiresIn: "1d"
        //});

        //res.cookie("token", token, {
        //  httpOnly: true,
        //  maxAge: 86400000 // 1 día
        //});

      res.render('loginadmin', {
                     alert: true,
                     alertTitle: 'Conexion exitosa',
                     alertMessage: 'Has iniciado sesión correctamente',
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 1500,
                     ruta: '',
                     login: false,
                 });
             }
         }
     );
  } else {
    res.render("loginadmin", {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "Ingrese el usuario y/o contraseña",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      ruta: "loginadmin"
    });
  }
});

// Login participante
router.post("/auth/participante", authController.loginParticipante);

// Login admin
router.post("/auth/admin", authController.loginAdmin);


module.exports = router;














