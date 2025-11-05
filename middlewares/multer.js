const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/participantes'); // carpeta donde se guardan las fotos
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'participante-' + Date.now() + ext);
  }
});

const upload = multer({ storage });