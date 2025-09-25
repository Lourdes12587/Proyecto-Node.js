const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/authadmin');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin") return res.redirect('/authadmin');
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect('/authadmin');
  }
}

module.exports = verifyAdmin;