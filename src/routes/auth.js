const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../../config/db");
const { body, validationResult } = require("express-validator");
//const authController = require('../../controllers/authController');
//const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
  if (req.session.rol === "admin") return next();
  res.redirect('/loginadmin');
}

//inscripcion
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
        { 
        nombre, 
        apellido, 
        dni, 
        telefono, 
        calle, 
        numero, 
        poblacion, 
        codigo_postal, 
        password: passwordHash 
        },
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

//login
router.get('/login', (req, res) => {
    res.render('login');
});

//login-autenticacion
router.post('/auth', async (req, res) => {    

    const dni = req.body.dni;
    const password = req.body.password;
  
     if (dni && password) {
     db.query(
         "SELECT * FROM participantes WHERE dni = ?", 
         [dni], 
         async (error, results) => {
             if (
                 results.length == 0 ||
                 !(await bcrypt.compare(password, results[0].password))
             ) {
                 res.render('login', {
                     alert: true,
                     alertTitle: 'Error',
                     alertMessage: 'Usuario y/o contraseña incorrectos',
                     alertIcon: 'error',
                     showConfirmButton: true,
                     timer: false,
                     ruta: 'login',
                 });
             } else {

              //req.session.user = { id: participante.id, nombre: participante.nombre };
              //req.session.rol = "participante";
              req.session.participanteId = results[0].id;
              req.session.loggedin = true;

              //res.redirect('/participante'); 
              //req.session.loggedin = true;
              //req.session.dni = results[0].dni;
 
                //const payload = {
                //  id: results[0].id,
                //  dni: results[0].dni,
                //  nombre: results[0].nombre,
                //  rol: results[0].rol || "participante",
                //}

                //const token = jwt.sign(payload, process.env.JWT_SECRET, { 
                //expiresIn: "1d",
                //});

                //res.cookie("token", token, {
                //  maxAge: 86400000,
                //  httpOnly: true,
                //  secure: false,
                //});
        
                 res.render('login', {
                     alert: true,
                     alertTitle: 'Conexion exitosa',
                     alertMessage: 'Has iniciado sesión correctamente',
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 2500,
                     ruta: 'perfil',
                     login: true,
                 });
             }
         }
     );
 } else {
     res.render('login', {
         alert: true,
         alertTitle: 'Advertencia',
         alertMessage: 'Ingrese el usuario y/o contraseña',
         alertIcon: 'error',
         showConfirmButton: true,
         timer: false,
         ruta: '', 
     });
    }
 });

 //organizadores
router.get('/loginadmin', (req, res) => {
    res.render('loginadmin');
});

router.post('/authadmin', async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

   if (user && password)  {
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

          req.session.user = { id: user.id, nombre: user.nombre };
          req.session.rol = "admin";
        //req.session.adminId = results[0].id;
        //req.session.loggedin = true;
        //req.session.user = results[0].user;
        //req.session.rol = results[0].rol

        //req.session.nombre = results[0].nombre;
        //req.session.rol = "admin";

        //req.session.loggedin = true;
        //req.session.dni = results[0].dni;
        
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
                     ruta: 'admin',
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


//cerrar sesion
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

//router.get("/logout", (req, res) => {
//    res.clearCookie("token");
//    res.redirect('/');
//});

// Login participante
//router.post("/auth/participante", authController.loginParticipante);

// Login admin
//router.post("/auth/admin", authController.loginAdmin);

router.get('/register', isAdmin, (req, res) => {
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
          password: passwordHash,
          rol:"admin" 
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





























































































































































































































































