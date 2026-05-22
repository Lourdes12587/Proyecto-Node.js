const express = require('express');
const router = express.Router();
const db = require("../../config/db");
const crypto = require('crypto');
const nodemailer = require('nodemailer');


router.get('/olvido-password', (req, res) => {
  res.render('olvido-password', { mensaje: null });
});

// Procesar solicitud de recuperación
router.post('/olvido-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render('olvido-password', { mensaje: 'Ingresa tu email' });
  }

  // Verificar si el usuario existe
  db.query('SELECT id, nombre FROM participantes WHERE email = ?', [email], (err, results) => {
    if (err) return res.render('olvido-password', { mensaje: 'Error en la base de datos' });

    if (results.length === 0) {
      return res.render('olvido-password', { mensaje: 'Email no encontrado' });
    }

    const user = results[0];

    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora de expiración

    // Guardar token en DB
    db.query(
      'INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expires],
      (err2) => {
        if (err2) return res.render('olvido-password', { mensaje: 'Error al generar token' });

        // Configurar nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail', // puedes usar tu servicio SMTP
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const resetLink = `http://localhost:3000/restablecer-password/${token}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Recuperación de contraseña',
          html: `<p>Hola ${user.nombre}, haz click en el siguiente enlace para restablecer tu contraseña:</p>
                 <a href="${resetLink}">${resetLink}</a>
                 <p>El enlace expirará en 1 hora.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.render('olvido-password', { mensaje: 'Error al enviar correo' });
          }

          res.render('olvido-password', { mensaje: 'Revisa tu correo para restablecer la contraseña' });
        });
      }
    );
  });
});

module.exports = router;
