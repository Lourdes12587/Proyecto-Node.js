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
        "INSERT INTO participantes SET ?",
        {
        nombre,
        apellido,
        dni,
        calle,
        numero,
        telefono,
        poblacion,
        codigo_postal,
        password: passwordHash,
        rol: "participante" // 👈 por defecto todos los inscritos son participantes
        },
        (error, results) => {
            if (error) {
                console.log(error);
                res.redirect("/perfil");
            } else {
                console.log(error);
                res.redirect("/perfil");
            }
        }
    );
};