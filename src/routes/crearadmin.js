const bcrypt = require('bcryptjs');

async function generarHash() {
    const password = 'admin123'; // contraseña que quieras usar
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log('Contraseña original:', password);
    console.log('Contraseña hasheada:', hashedPassword);
}

generarHash();