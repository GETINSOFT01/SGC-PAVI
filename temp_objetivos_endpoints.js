// CRUD para Objetivos

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
