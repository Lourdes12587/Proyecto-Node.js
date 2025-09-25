const express = require('express');
const app = express();
require("dotenv").config({ path: "./env/.env" }); 
const session = require('express-session');
//const cokieParser = require("cookie-parser");
//const jwt = require("jsonwebtoken");
//const cookieParser = require('cookie-parser');

app.use(
    session({
        secret: "secret", 
        resave: false, 
        saveUninitialized: true, 
    })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.rol = req.session.rol || null;
  next();
});

app.listen(3000, () => { 
    console.log("Servidor corriendo en http://localhost:3000");
});

app.use("/resources", express.static(__dirname + "/public")); 

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));

//middlewares
//app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//rutas
app.use("/", require("./src/routes/index"));
app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/participante"));
app.use("/", require("./src/routes/admin"));
