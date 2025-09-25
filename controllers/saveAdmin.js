const db = require("../config/db");

//GUARDAR
exports.save = (req, res) => {
    
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const telefono = req.body.telefono;
    const poblacion = req.body.poblacion;
    const codigo_postal = req.body.codigo_postal;

    //console.log(nombre + " " + precio + " " + stock);

    db.query(
        "INSERT INTO Participantes SET ?",
        {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            calle: calle,
            numero: numero,
            telefono: telefono,
            poblacion: poblacion,
            codigo_postal: codigo_postal,


        },
        (error, results) => {
            if (error) {
                console.log(error);
                res.redirect("/admin");
            } else {
                console.log(error);
                res.redirect("/admin");
            }
        }
    );
};

