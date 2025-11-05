const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token; // el token se guarda en cookies
  if (!token) {
    return res.redirect("/loginadmin"); // redirige al login si no hay token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos los datos del usuario en req.user
    next();
  } catch (err) {
    return res.redirect("/loginadmin"); // token inválido
  }
}

module.exports = verifyToken;
