const db = require("../config/db");

//ACTUALIZAR
exports.update = (req, res) => {

    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const telefono = req.body.telefono;
    const poblacion = req.body.poblacion;
    const codigo_postal = req.body.codigo_postal;

    db.query(
        
        "UPDATE participantes SET nombre=?, apellidos=?, telefono=?, calle=?, numero=?, poblacion=?, codigo_postal=? WHERE id=?", [{
            
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            calle: calle,
            numero: numero,
            telefono: telefono,
            poblacion: poblacion,
            codigo_postal: codigo_postal,
        }
        , id,
    ],
        (error, results) => {
            if (error) {
                console.log(error);
                res.redirect("/admin");
            } else {
                res.redirect("/admin");
            }
        }
    );
};

