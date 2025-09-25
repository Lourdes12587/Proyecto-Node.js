exports.loginParticipante = (req, res) => {
    const { dni, password } = req.body;

    if (!dni || !password) {
        return res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Debe ingresar DNI y contraseña",
            alertIcon: "error",
            ruta: "login"
        });
    }

    db.query("SELECT * FROM participantes WHERE dni = ?", [dni], async (err, results) => {
        if (err) throw err;

        if (
            results.length === 0 ||
            !(await bcrypt.compare(password, results[0].password))
        ) {
            return res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Credenciales inválidas",
                alertIcon: "error",
                ruta: "login"
            });
        }

        // Guardar sesión
        req.session.loggedin = true;
        req.session.dni = results[0].dni;
        req.session.rol = "participante";

        res.render("login", {
            alert: true,
            alertTitle: "Éxito",
            alertMessage: "Login correcto",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "perfil"
        });
    });
};

exports.loginAdmin = (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.render("loginadmin", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Debe ingresar Usuario y contraseña",
            alertIcon: "error",
            ruta: "loginadmin"
        });
    }

    db.query("SELECT * FROM organizadores WHERE user = ?", [user], async (err, results) => {
        if (err) throw err;

        if (
            results.length === 0 ||
            !(await bcrypt.compare(password, results[0].password))
        ) {
            return res.render("loginadmin", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Credenciales inválidas",
                alertIcon: "error",
                ruta: "loginadmin"
            });
        }

        // Guardar sesión
        req.session.loggedin = true;
        req.session.user = results[0].user;
        req.session.rol = "admin";  // 👈 lo ponemos fijo

        res.render("loginadmin", {
            alert: true,
            alertTitle: "Éxito",
            alertMessage: "Login de administrador correcto",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "admin"
        });
    });
};