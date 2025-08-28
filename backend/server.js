const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files (PDFs, images) statically
app.use('/uploads', express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const timestamp = Date.now();
        const finalName = `${timestamp}_${safeName}`;
        cb(null, finalName);
    }
});
const upload = multer({ storage });

// Connect to SQLite database (use project root sgc.db)
const dbPath = path.resolve(__dirname, '../sgc.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sgc.db database.');
});

// File upload endpoint
// Returns JSON: { path: '/uploads/<filename>', filename: '<filename>' }
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const publicPath = `/uploads/${req.file.filename}`;
        res.status(201).json({ path: publicPath, filename: req.file.filename });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Ensure usuarios table exists and seed a default admin on first run
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`);
    db.get(`SELECT COUNT(*) as count FROM usuarios`, [], (err, row) => {
        if (err) {
            console.error('Error counting usuarios:', err.message);
            return;
        }
        if (row && row.count === 0) {
            const seedUser = { nombre: 'Administrador', username: 'admin', password: 'admin123', role: 'admin' };
            db.run(
                `INSERT INTO usuarios (nombre, username, password, role) VALUES (?, ?, ?, ?)`,
                [seedUser.nombre, seedUser.username, seedUser.password, seedUser.role],
                function(seedErr) {
                    if (seedErr) {
                        console.error('Error seeding default admin user:', seedErr.message);
                    } else {
                        console.log('Default admin user seeded: username="admin", password="admin123"');
                    }
                }
            );
        }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (user) {
            console.log(`User ${user.username} logged in successfully.`);
            // Don't send the password back to the client
            const { password, ...userWithoutPassword } = user;
            res.json({ success: true, user: userWithoutPassword });
        } else {
            console.log(`Login failed for username: ${username}`);
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
});

// PUT update usuario
app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, username, role, password } = req.body || {};
    if (!id || !nombre || !username) {
        return res.status(400).json({ error: 'id, nombre y username son requeridos' });
    }
    const userRole = role && ['admin','user'].includes(role) ? role : 'user';
    // Check unique username excluding current id
    db.get(`SELECT id FROM usuarios WHERE username = ? AND id <> ?`, [username, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(409).json({ error: 'El nombre de usuario ya existe' });
        const fields = ['nombre = ?', 'username = ?', 'role = ?'];
        const params = [nombre, username, userRole];
        if (password) {
            fields.push('password = ?');
            params.push(password);
        }
        params.push(id);
        const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
        db.run(sql, params, function(updateErr) {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json({ id, nombre, username, role: userRole });
        });
    });
});

// DELETE usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'id requerido' });
    db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    });
});

// Usuarios endpoints
// GET sanitized list (omit password)
app.get('/api/usuarios', (req, res) => {
    const sql = `SELECT id, nombre, username, role FROM usuarios`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST create new usuario
app.post('/api/usuarios', (req, res) => {
    const { nombre, username, password, role } = req.body || {};
    if (!nombre || !username || !password) {
        return res.status(400).json({ error: 'nombre, username y password son requeridos' });
    }
    const userRole = role && ['admin','user'].includes(role) ? role : 'user';
    // Ensure unique username
    db.get(`SELECT id FROM usuarios WHERE username = ?`, [username], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(409).json({ error: 'El nombre de usuario ya existe' });
        db.run(
            `INSERT INTO usuarios (nombre, username, password, role) VALUES (?, ?, ?, ?)`,
            [nombre, username, password, userRole],
            function(insertErr) {
                if (insertErr) return res.status(500).json({ error: insertErr.message });
                const created = { id: this.lastID, nombre, username, role: userRole };
                res.status(201).json(created);
            }
        );
    });
});

// Generic endpoint to get data from any table
app.get('/api/:module', (req, res) => {
    const moduleName = req.params.module;
    // A simple allowlist to prevent arbitrary table access
    const allowedModules = ['objetivos', 'indicadores', 'documentos', 'procesos', 'auditorias', 'noconformidades', 'avisos', 'personal', 'usuarios', 'catalogos'];
    
    if (!allowedModules.includes(moduleName)) {
        return res.status(404).json({ error: 'Module not found' });
    }

    db.all(`SELECT * FROM ${moduleName}`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
