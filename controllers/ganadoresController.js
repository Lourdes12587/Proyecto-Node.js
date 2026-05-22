const pool = require("../config/db");

// Registrar ganador
exports.registrarGanador = async (req, res) => {
  const corredorId = req.params.id;
  const posicion = req.query.posicion;

  try {
    // Primero comprobamos si ya existe alguien en esa posición
    const [existe] = await pool.query(
      "SELECT * FROM ganadores WHERE posicion = ?",
      [posicion]
    );

    if (existe.length > 0) {
      // Si ya hay un corredor en esa posición, lo actualizamos
      await pool.query(
        "UPDATE ganadores SET corredor_id = ? WHERE posicion = ?",
        [corredorId, posicion]
      );
    } else {
      // Si no existe, lo insertamos
      await pool.query(
        "INSERT INTO ganadores (corredor_id, posicion) VALUES (?, ?)",
        [corredorId, posicion]
      );
    }

    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.send("Error al registrar el ganador");
  }
};