const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
const { body, validationResult } = require("express-validator");
//const authController = require('../../controllers/authController');
//const jwt = require("jsonwebtoken");


router.get('/register', (req, res) => {
  res.render('register', { register: true});
});

//inscripcion-validation  
router.post("/register",
  [
    body("user")
      .exists()
      .isLength({ min: 3 })
      .withMessage("El usuario debe tener al menos 3 caracteres"),

    body("nombre")
      .exists()
      .isLength({ min: 3 })
      .withMessage("El nombre debe tener al menos 3 caracteres"),

    body("password")
      .exists()
      .isLength({ min: 4 })
      .withMessage("La contraseña debe tener al menos 4 caracteres"),
  ],
  async (req, res) => {
//  const errors = validationResult(req);
//  if(!errors.isEmpty()){
//      res.status(400).json ({errors: errors.array()});
//      console.log(errors);
//}

    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      res.render("register", {
        validaciones: errors.array(),
        valores: req.body,
      });

    } else {

      const { user, nombre, password } = req.body; 
      const passwordHash = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO organizadores SET ?",
        { user:user, 
          nombre:nombre, 
          password: passwordHash 
        },
        (error, results) => { 
          if (error) {
            console.log(error);

          } else {

            res.render("register", { 
              inscripcion: true,
              alert: true,
              alertTitle: 'Registro Exitoso',
              alertMessage: 'Tu cuenta fue creada',
              alertIcon: 'success',
              showConfirmButton: false,
              timer: 2500,
              ruta: "admin" 
            });
          }
        }
      );
    }
  }
);


module.exports = router;












