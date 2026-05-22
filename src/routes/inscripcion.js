const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
const { body, validationResult } = require("express-validator");

//register-inscripcion
router.get('/inscripcion', (req, res) => {
  res.render('inscripcion', { inscripcion: true});
});

//inscripcion-validation
router.post("/inscripcion",
  [
    body("nombre")
      .exists()
      .isLength({ min: 3 })
      .withMessage("El nombre debe tener al menos 3 caracteres"),

    body("apellido")
      .exists()
      .isLength({ min: 3 })
      .withMessage("El apellido debe tener al menos 3 caracteres"),

    body("dni")
      .exists()
      .isLength({ min: 7 })
      .withMessage("El DNI debe tener al menos 7 caracteres"),

    body("telefono")
      .exists()
      .notEmpty()
      .withMessage("El teléfono debe tener 9 dígitos numéricos"),

    body("calle")
      .exists()
      .isLength({ min: 3 })
      .withMessage("La calle debe tener al menos 3 caracteres"),

    body("numero")
      .exists()
      .notEmpty()
      .withMessage("El numero debe ser un número"),

    body("poblacion")
      .exists()
      .isLength({ min: 3 })
      .withMessage("La poblacion debe tener al menos 3 caracteres"),

    body("codigo_postal")
      .exists()
      .notEmpty()
      .withMessage("El codigo postal debe ser un número"),

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
      res.render("inscripcion", {
        validaciones: errors.array(),
        valores: req.body,
      });

    } else {

      const nombre = req.body.nombre;
      const apellido = req.body.apellido;
      const dni = req.body.dni;
      const telefono = req.body.telefono;
      const calle = req.body.calle;
      const numero = req.body.numero;
      const poblacion = req.body.poblacion;
      const codigo_postal = req.body.codigo_postal;
      const password = req.body.password;
      const passwordHash = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO participantes SET ?",
        { nombre, apellido, dni, telefono, calle, numero, poblacion, codigo_postal, password: passwordHash },
        (error, results) => { 
          if (error) {
            console.log(error);

          } else {

            res.render("inscripcion", { 
              inscripcion: true,
              alert: true,
              alertTitle: 'Inscripcion exitosa',
              alertMessage: `Te has inscrito con éxito. Tu dorsal es el Nº ${results.insertId}`,
              alertIcon: 'success',
              showConfirmButton: false,
              timer: 2500,
              ruta: "" 
            });
          }
        }
      );
    }
  }
);

module.exports = router;