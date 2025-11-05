const db = require("../config/db");

// Actualizar participante
exports.update = (req, res) => {
  const { id, nombre, apellido, dni, telefono, calle, numero, poblacion, codigo_postal } = req.body;

  db.query(
    "UPDATE participantes SET nombre=?, apellido=?, dni=?, telefono=?, calle=?, numero=?, poblacion=?, codigo_postal=? WHERE id=?",
    [nombre, apellido, dni, telefono, calle, numero, poblacion, codigo_postal, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar:", err);
        return res.redirect("/perfil");
      }
      console.log("Datos actualizados correctamente");
      res.redirect("/perfil");
    }
  );
};