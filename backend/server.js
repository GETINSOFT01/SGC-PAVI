const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, 'uploads/documents');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const sanitizedFilename = file.originalname.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
        cb(null, Date.now() + '_' + sanitizedFilename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        // Only allow PDFs
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'), false);
        }
    }
});

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (PDFs, images) with our custom handler
const staticFileHandler = require('./middleware/staticFiles');
app.use('/uploads', staticFileHandler);

// File upload endpoint
app.post('/api/upload', upload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        const fileUrl = `/uploads/documents/${req.file.filename}`;
        res.json({ 
            success: true, 
            message: 'Archivo subido exitosamente',
            filePath: fileUrl,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({ 
            error: 'Error al subir el archivo',
            details: error.message 
        });
    }
});

// Connect to SQLite database (use project root sgc.db)
const dbPath = path.resolve(__dirname, '../sgc.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sgc.db database.');
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

// Special endpoint for catalogos (structured differently)
app.get('/api/catalogos', (req, res) => {
    const sql = `SELECT tipo, id, nombre, descripcion FROM catalogos WHERE activo = 1 ORDER BY tipo, nombre`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Group by tipo to match expected structure
        const catalogos = {};
        rows.forEach(row => {
            if (!catalogos[row.tipo]) {
                catalogos[row.tipo] = [];
            }
            catalogos[row.tipo].push({
                id: row.id,
                nombre: row.nombre,
                descripcion: row.descripcion
            });
        });
        
        res.json(catalogos);
    });
});

// Generic endpoint to get data from any table
app.get('/api/:module', (req, res) => {
    const moduleName = req.params.module;
    // A simple allowlist to prevent arbitrary table access
    const allowedModules = ['objetivos', 'indicadores', 'documentos', 'procesos', 'auditorias', 'noconformidades', 'avisos', 'personal', 'usuarios'];
    
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

// ============================================
// CRUD Endpoints para Objetivos
// ============================================

// Obtener todos los objetivos
app.get('/api/objetivos', (req, res) => {
    const sql = `
        SELECT o.*, u.nombre as responsable_nombre 
        FROM objetivos o
        LEFT JOIN usuarios u ON o.responsable_id = u.id
        ORDER BY o.creado_en DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener objetivos:', err);
            return res.status(500).json({ error: 'Error al obtener los objetivos' });
        }
        res.json(rows);
    });
});

// Obtener un objetivo por ID
app.get('/api/objetivos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID de objetivo inválido' });

    const sql = `
        SELECT o.*, u.nombre as responsable_nombre 
        FROM objetivos o
        LEFT JOIN usuarios u ON o.responsable_id = u.id
        WHERE o.id = ?
    `;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error al obtener objetivo:', err);
            return res.status(500).json({ error: 'Error al obtener el objetivo' });
        }
        if (!row) return res.status(404).json({ error: 'Objetivo no encontrado' });
        res.json(row);
    });
});

// Crear un nuevo objetivo
app.post('/api/objetivos', (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado, responsable_id, creado_por } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !responsable_id || !creado_por) {
        return res.status(400).json({ error: 'Nombre, descripción, responsable_id y creado_por son campos requeridos' });
    }

    const sql = `
        INSERT INTO objetivos 
        (nombre, descripcion, fecha_inicio, fecha_fin, estado, responsable_id, creado_por)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        nombre,
        descripcion,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'Pendiente',
        responsable_id,
        creado_por
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error al crear objetivo:', err);
            return res.status(500).json({ error: 'Error al crear el objetivo' });
        }
        
        // Obtener el objetivo recién creado para devolverlo
        db.get('SELECT * FROM objetivos WHERE id = ?', [this.lastID], (err, newObj) => {
            if (err) {
                console.error('Error al obtener objetivo creado:', err);
                return res.status(201).json({ 
                    id: this.lastID,
                    message: 'Objetivo creado exitosamente',
                    warning: 'No se pudo recuperar la información completa del objetivo'
                });
            }
            res.status(201).json(newObj);
        });
    });
});

// Actualizar un objetivo
app.put('/api/objetivos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID de objetivo inválido' });
    
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado, responsable_id } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !responsable_id) {
        return res.status(400).json({ error: 'Nombre, descripción y responsable_id son campos requeridos' });
    }

    const sql = `
        UPDATE objetivos 
        SET nombre = ?, 
            descripcion = ?, 
            fecha_inicio = ?, 
            fecha_fin = ?, 
            estado = ?, 
            responsable_id = ?,
            actualizado_en = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    const params = [
        nombre,
        descripcion,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'Pendiente',
        responsable_id,
        id
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error al actualizar objetivo:', err);
            return res.status(500).json({ error: 'Error al actualizar el objetivo' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Objetivo no encontrado' });
        }
        
        // Obtener el objetivo actualizado para devolverlo
        db.get('SELECT * FROM objetivos WHERE id = ?', [id], (err, updatedObj) => {
            if (err) {
                console.error('Error al obtener objetivo actualizado:', err);
                return res.json({ 
                    id,
                    message: 'Objetivo actualizado exitosamente',
                    warning: 'No se pudo recuperar la información completa del objetivo actualizado'
                });
            }
            res.json(updatedObj);
        });
    });
});

// Eliminar un objetivo
app.delete('/api/objetivos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID de objetivo inválido' });

    // Verificar si el objetivo existe
    db.get('SELECT id FROM objetivos WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error al verificar objetivo:', err);
            return res.status(500).json({ error: 'Error al eliminar el objetivo' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Objetivo no encontrado' });
        }

        // Si existe, proceder con la eliminación
        db.run('DELETE FROM objetivos WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Error al eliminar objetivo:', err);
                return res.status(500).json({ error: 'Error al eliminar el objetivo' });
            }
            res.status(204).send();
        });
    });
});

// ============================================
// Iniciar el servidor
// ============================================
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
