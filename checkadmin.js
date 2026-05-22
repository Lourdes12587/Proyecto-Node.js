/**
 * Script para verificar contraseñas de administradores
 * usando bcrypt y MySQL
 * 
 * 1️⃣ Instala dependencias:
 *      npm install mysql2 bcryptjs
 * 
 * 2️⃣ Ejecuta:
 *      node checkAdminPassword.js
 */

const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const readline = require("readline");

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",       // Cambia si es necesario
    user: "root",            // Usuario de MySQL
    password: "",            // Contraseña de MySQL
    database: "carrera"      // Base de datos
});

// Interfaz para leer la contraseña desde consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== Verificación de administrador ===");

// Preguntar usuario
rl.question("Ingrese el nombre de usuario: ", (user) => {
    rl.question("Ingrese la contraseña: ", async (password) => {
        try {
            // Consulta a la base de datos
            db.query(
                "SELECT * FROM organizadores WHERE user = ?",
                [user],
                async (err, results) => {
                    if (err) {
                        console.error("Error al consultar la base de datos:", err);
                        rl.close();
                        db.end();
                        return;
                    }

                    if (results.length === 0) {
                        console.log("❌ Usuario no encontrado");
                        rl.close();
                        db.end();
                        return;
                    }

                    // Obtener hash de la contraseña desde DB
                    const passwordHash = results[0].password;

                    // Comparar contraseña ingresada con hash
                    const valid = await bcrypt.compare(password, passwordHash);

                    if (valid) {
                        console.log("✅ Contraseña correcta. Usuario autenticado.");
                        console.log("Información del usuario:", {
                            id: results[0].id,
                            nombre: results[0].nombre,
                            user: results[0].user
                        });
                    } else {
                        console.log("❌ Contraseña incorrecta");
                    }

                    // Cerrar conexiones
                    rl.close();
                    db.end();
                }
            );
        } catch (error) {
            console.error("Error inesperado:", error);
            rl.close();
            db.end();
        }
    });
});