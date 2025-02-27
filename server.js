const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;  // Asegúrate de que sea un puerto libre

app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Reemplaza con tu usuario de MySQL
    password: 'Bybestff18.',  // Reemplaza con tu contraseña
    database: 'login'  // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

app.post('/login', (req, res) => {
    // Extraer datos del cuerpo de la solicitud
    const { email, password, key } = req.body;

    // Imprimir los datos recibidos para depuración
    console.log('Datos recibidos:', { email, password, key });

    const query = `SELECT * FROM users WHERE email = ? AND password = ? AND user_key = ?`;

    db.query(query, [email, password, key], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login exitoso', user: results[0] });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para obtener el perfil (GET)
app.get('/perfil/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `SELECT * FROM profiles WHERE user_id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length > 0) {
            res.status(200).json({ profile: results[0] });
        } else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
