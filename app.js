const express = require('express');
const app = express();
require("dotenv").config({ path: "./env/.env" }); 
if (process.env.NODE_ENV === "production") {
    require ("dotenv").config({ path: "./env/.env"});
}
const http = require ("http");
const server = http.createServer(app);
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

app.use(cookieSession({
    name: 'session',
    keys: ['clave_secreta'],  
    maxAge: 24 * 60 * 60 * 1000 
}));

server.listen(3000, () => { 
    console.log("Servidor corriendo en http://localhost:3000");
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.rol = req.session.rol || null;
  next();
});

//middlewares
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('public/uploads'));

app.use("/resources", express.static(__dirname + "/public")); 

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));

//rutas
app.use("/", require("./src/routers/index"));
app.use("/", require("./src/routers/auth"));
app.use("/", require("./src/routers/participante"));
app.use("/", require("./src/routers/admin"));
app.use("/", require("./src/routers/ganadores"));


