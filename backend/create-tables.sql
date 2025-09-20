-- Create missing tables for SGC PAVI system

-- Documentos table
CREATE TABLE IF NOT EXISTS documentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT,
    estado TEXT DEFAULT 'Borrador',
    version TEXT DEFAULT '1.0',
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_revision DATE,
    responsable_id INTEGER,
    file_url TEXT,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Auditorias table
CREATE TABLE IF NOT EXISTS auditorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT DEFAULT 'Interna',
    fecha_inicio DATE,
    fecha_fin DATE,
    estado INTEGER DEFAULT 1,
    area_auditada_id INTEGER,
    auditor_lider_id INTEGER,
    observaciones TEXT,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- No conformidades table
CREATE TABLE IF NOT EXISTS noconformidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    origen_id INTEGER,
    estado INTEGER DEFAULT 1,
    fecha_deteccion DATE DEFAULT CURRENT_DATE,
    responsable_id INTEGER,
    accion_correctiva TEXT,
    fecha_cierre DATE,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Personal table
CREATE TABLE IF NOT EXISTS personal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    puesto_id INTEGER,
    area_id INTEGER,
    foto_url TEXT,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indicadores table
CREATE TABLE IF NOT EXISTS indicadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    unidad_medida TEXT,
    meta REAL,
    valor_actual REAL,
    responsable_id INTEGER,
    objetivo_asociado_id INTEGER,
    tendencia_id INTEGER,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Procesos table
CREATE TABLE IF NOT EXISTS procesos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    responsable_id INTEGER,
    area_id INTEGER,
    entradas TEXT,
    salidas TEXT,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Avisos table
CREATE TABLE IF NOT EXISTS avisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_evento DATE,
    tipo TEXT DEFAULT 'General',
    responsable_id INTEGER,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Catalogos table (for storing catalog data)
CREATE TABLE IF NOT EXISTS catalogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL, -- 'areas', 'puestos', 'origenes_noconformidad', etc.
    nombre TEXT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample catalog data
INSERT OR IGNORE INTO catalogos (tipo, nombre, descripcion) VALUES
('areas', 'Administración', 'Área administrativa'),
('areas', 'Producción', 'Área de producción'),
('areas', 'Calidad', 'Área de control de calidad'),
('areas', 'Ventas', 'Área comercial y ventas'),

('puestos', 'Gerente General', 'Dirección general'),
('puestos', 'Jefe de Calidad', 'Responsable del sistema de calidad'),
('puestos', 'Supervisor de Producción', 'Supervisión de procesos productivos'),
('puestos', 'Analista de Calidad', 'Análisis y control de calidad'),

('origenes_noconformidad', 'Auditoría Interna', 'Detectada en auditoría interna'),
('origenes_noconformidad', 'Auditoría Externa', 'Detectada en auditoría externa'),
('origenes_noconformidad', 'Queja de Cliente', 'Reportada por cliente'),
('origenes_noconformidad', 'Proceso Interno', 'Detectada en proceso interno'),

('estados_auditoria', 'Planificada', 'Auditoría programada'),
('estados_auditoria', 'En Proceso', 'Auditoría en ejecución'),
('estados_auditoria', 'Completada', 'Auditoría finalizada'),
('estados_auditoria', 'Cancelada', 'Auditoría cancelada'),

('estados_noconformidad', 'Abierta', 'No conformidad identificada'),
('estados_noconformidad', 'En Tratamiento', 'Acción correctiva en proceso'),
('estados_noconformidad', 'Cerrada', 'No conformidad resuelta'),

('tendencia_indicador', 'Ascendente', 'Tendencia positiva'),
('tendencia_indicador', 'Descendente', 'Tendencia negativa'),
('tendencia_indicador', 'Estable', 'Sin cambios significativos');

-- Insert sample data for testing
INSERT OR IGNORE INTO personal (nombre, puesto_id, area_id, foto_url) VALUES
('Ana García López', 2, 3, 'uploads/ana_garcia.jpg'),
('Luis Hernández Mata', 3, 2, 'uploads/luis_hernandez.jpg'),
('Sofía Martínez Reyes', 4, 3, 'uploads/sofia_martinez.jpg');

INSERT OR IGNORE INTO documentos (nombre, descripcion, tipo, estado, version, responsable_id) VALUES
('Manual de Calidad', 'Manual principal del sistema de gestión de calidad', 'Manual', 'Vigente', '2.1', 1),
('Procedimiento de Auditorías', 'Procedimiento para realizar auditorías internas', 'Procedimiento', 'Vigente', '1.5', 2),
('Política de Calidad', 'Política general de calidad de la organización', 'Política', 'Vigente', '1.0', 1);

INSERT OR IGNORE INTO auditorias (nombre, tipo, fecha_inicio, fecha_fin, estado, area_auditada_id, auditor_lider_id) VALUES
('Auditoría Interna Q1 2024', 'Interna', '2024-03-01', '2024-03-15', 3, 2, 1),
('Auditoría de Certificación', 'Externa', '2024-06-10', '2024-06-12', 3, 1, 2),
('Auditoría de Seguimiento', 'Interna', '2024-09-01', '2024-09-05', 2, 3, 1);

INSERT OR IGNORE INTO noconformidades (descripcion, origen_id, estado, fecha_deteccion, responsable_id) VALUES
('Falta de registros de calibración en equipos', 1, 2, '2024-03-05', 2),
('Documentos obsoletos en área de producción', 1, 3, '2024-06-15', 1),
('Queja por demora en entrega', 3, 1, '2024-08-20', 3);
