const bcrypt = require("bcryptjs");
const db = require("../../config/db");

async function crearOrganizadores() {
  // Lista de organizadores
  const organizadores = [
    { user: "admin", password: "1234" },
    { user: "maria", password: "5678" },
    { user: "juan", password: "abcd" } 
  ];

  // Hasheamos contraseñas
  const values = [];
  for (let org of organizadores) {
    const passwordHash = await bcrypt.hash(org.password, 8);
    values.push([org.user, passwordHash, org.nombre, org.email]);
  }

  db.query(
    "INSERT INTO organizadores (user, password, nombre, email) VALUES ?",
    [values],
    (err, result) => {
      if (err) {
        console.error("Error al insertar organizadores:", err);
      } else {
        console.log("Organizadores insertados con éxito:", result.affectedRows);
      }
      process.exit();
    }
  );
}

crearOrganizadores();

module.exports = router;