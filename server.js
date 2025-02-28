const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir imágenes

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '',  
    database: 'login'  
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos');
});

// Configuración de `multer` para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Ruta de login
app.post('/login', (req, res) => {
    const { email, password, key } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ? AND user_key = ?`;

    db.query(query, [email, password, key], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        if (results.length > 0) {
            res.status(200).json({ message: 'Login exitoso', user: results[0] });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para obtener perfil
app.get('/perfil/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `SELECT userID, email, user_key, expires, profilePic, coverPic FROM users WHERE id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        if (results.length > 0) {
            res.status(200).json({ profile: results[0] });
        } else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    });
});

// Ruta para actualizar fotos de perfil y portada
app.put('/perfil/:userId', upload.fields([{ name: 'profilePic' }, { name: 'coverPic' }]), (req, res) => {
    const { userId } = req.params;
    const profilePic = req.files['profilePic'] ? req.files['profilePic'][0].filename : null;
    const coverPic = req.files['coverPic'] ? req.files['coverPic'][0].filename : null;

    let query = 'UPDATE users SET ';
    let values = [];
    
    if (profilePic) {
        query += 'profilePic = ?, ';
        values.push(profilePic);
    }
    if (coverPic) {
        query += 'coverPic = ?, ';
        values.push(coverPic);
    }

    query = query.slice(0, -2); // Quitar la última coma
    query += ' WHERE id = ?';
    values.push(userId);

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        res.status(200).json({ message: 'Perfil actualizado correctamente' });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
