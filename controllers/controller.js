const db = require("../config/db");

//GUARDAR   
exports.save = (req, res) => {
    
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const telefono = req.body.telefono;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const poblacion = req.body.poblacion;
    const codpostal = req.body.codpostal;

    db.query(
        "INSERT INTO corredores SET ?",
        {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            telefono: telefono,
            calle: calle,
            numero: numero,
            poblacion: poblacion,
            codpostal: codpostal,
        },
        (error, results) => {
            if (error) {
                console.log(error);
                
            } else {
                res.redirect("/perfil");
            }
        }
    );
};


exports.update = (req, res) => {

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const telefono = req.body.telefono;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const poblacion = req.body.poblacion;
    const codpostal = req.body.codpostal;

    db.query(
        "UPDATE corredores SET ? WHERE id = ?", [{
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            telefono: telefono,
            calle: calle,
            numero: numero,
            poblacion: poblacion,
            codpostal: codpostal,
        }
        , ref,
    ],
        (error, results) => {
            if (error) {
                console.log(error);
        
            } else {
                res.redirect("/perfil");
            }
        }
    );
};
