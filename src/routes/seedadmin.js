const db = require("../../config/db");
const bcrypt = require("bcryptjs");

async function crearAdmin() {
  const hash = await bcrypt.hash("admin123", 8);
  db.query(
    "INSERT INTO organizadores (user, password) VALUES (?, ?)",
    ["admin", hash],
    (err, result) => {
      if(err) console.log(err);
      else console.log("Administrador creado correctamente");
      process.exit();
    }
  );
}

crearAdmin();