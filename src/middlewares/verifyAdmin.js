const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/loginadmin');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'admin') return res.redirect('/loginadmin');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.redirect('/loginadmin');
  }
}

module.exports = verifyAdmin;