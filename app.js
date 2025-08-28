// Live debug console removed

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';
console.log('Vue library script loaded.');

try {
    console.log('Attempting to create and mount Vue app...');
    
    const app = createApp({
        data() {
            return {
                isAuthenticated: true,
                loggedInUser: { nombre: 'Usuario de Prueba', role: 'admin' },
                currentModule: 'dashboard',
                isProfileMenuOpen: false,
                isModalOpen: false,
                isHistoryModalOpen: false,
                isPreviewModalOpen: false,
                previewSrc: '',
                logoUrl: 'https://placehold.co/100x100/1E293B/38BDF8?text=SGC',
                // apiBase is configured dynamically in mounted()
                // In dev: http://localhost:3003 (backend)
                // In prod: relative '/api' (proxied by Netlify)
                apiBase: '',
                currentSystem: 'iso9001',
                systems: [
                    { id: 'iso9001', name: 'ISO 9001', colorClass: 'bg-cyan-600' },
                    { id: 'globalgap', name: 'Global GAP', colorClass: 'bg-green-600' }
                ],
                modules: [
                    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt', singular: 'dashboard', systems: ['iso9001', 'globalgap'] },
                    { id: 'objetivos', name: 'Objetivos', icon: 'fas fa-bullseye', singular: 'objetivo', systems: ['iso9001'] },
                    { id: 'indicadores', name: 'Indicadores (KPIs)', icon: 'fas fa-chart-line', singular: 'indicador', systems: ['iso9001'] },
                    { id: 'documentos', name: 'Documentos', icon: 'fas fa-file-alt', singular: 'documento', systems: ['iso9001', 'globalgap'] },
                    { id: 'procesos', name: 'Procesos', icon: 'fas fa-project-diagram', singular: 'proceso', systems: ['iso9001'] },
                    { id: 'auditorias', name: 'Auditorías', icon: 'fas fa-clipboard-check', singular: 'auditoría', systems: ['iso9001'] },
                    { id: 'noconformidades', name: 'No Conformidades', icon: 'fas fa-exclamation-triangle', singular: 'no conformidad', systems: ['iso9001'] },
                    { id: 'avisos', name: 'Avisos', icon: 'fas fa-bell', singular: 'aviso', systems: ['iso9001', 'globalgap'] },
                    { id: 'personal', name: 'Personal', icon: 'fas fa-users', singular: 'miembro', systems: ['iso9001', 'globalgap'] },
                    { id: 'usuarios', name: 'Administración', icon: 'fas fa-user-shield', singular: 'usuario', systems: ['iso9001', 'globalgap'] },
                    { id: 'catalogos', name: 'Catálogos', icon: 'fas fa-book', singular: 'elemento', systems: ['iso9001', 'globalgap'] },
                    { id: 'reportes', name: 'Reportes', icon: 'fas fa-chart-pie', singular: 'reporte', systems: ['iso9001', 'globalgap'] }
                ],
                usuarios: [],
                personal: [
                    { id: 1, nombre: 'Ana García López', puesto_id: 1, area_id: 1, foto_url: 'uploads/ana_garcia.jpg' },
                    { id: 2, nombre: 'Luis Hernández Mata', puesto_id: 2, area_id: 2, foto_url: 'uploads/luis_hernandez.jpg' },
                    { id: 3, nombre: 'Sofía Martínez Reyes', puesto_id: 3, area_id: 1, foto_url: 'uploads/sofia_martinez.jpg' }
                ],
                objetivos: [
                    { id: 1, nombre: 'Reducir quejas de clientes', descripcion: 'Disminuir el número de quejas de clientes en un 15% para el Q4 2024.', progreso: 65, responsable_id: 1, activo: true },
                    { id: 2, nombre: 'Optimizar tiempo de producción', descripcion: 'Reducir el tiempo de ciclo de producción en un 10% para fin de año.', progreso: 40, responsable_id: 2, activo: true },
                    { id: 3, nombre: 'Capacitación de Personal', descripcion: 'Lograr que el 95% del personal complete el curso de seguridad.', progreso: 100, responsable_id: 3, activo: false }
                ],
                indicadores: [
                    { id: 1, nombre: '% Satisfacción del Cliente', valor_actual: '92%', meta: '95%', tendencia: 'positiva' },
                    { id: 2, nombre: 'Tiempo de Entrega Promedio', valor_actual: '3 días', meta: '2 días', tendencia: 'negativa' }
                ],
                documentos: [
                    { id: 1, codigo: 'PAVI-RH-001', nombre: 'Política de Contratación', version: '2.1', fecha_revision: '2024-05-20', estado: 'Vigente', file_url: 'uploads/politica_contratacion_v2.1.pdf', 
                        historial: [
                            { version: '1.0', fecha: '2022-01-15', cambios: 'Versión inicial' },
                            { version: '2.0', fecha: '2023-05-20', cambios: 'Revisión anual' },
                            { version: '2.1', fecha: '2024-05-20', cambios: 'Ajuste de cláusula de no discriminación' }
                        ]
                    },
                    { id: 2, codigo: 'PAVI-OP-005', nombre: 'Manual de Operaciones de Bodega', version: '1.5', fecha_revision: '2024-06-10', estado: 'En Revisión', file_url: 'uploads/manual_operaciones_bodega_v1.5.pdf', 
                        historial: [
                            { version: '1.0', fecha: '2021-03-01', cambios: 'Creación del manual' },
                            { version: '1.5', fecha: '2024-06-10', cambios: 'Actualización de proceso de recepción de mercancía' }
                        ]
                    }
                ],
                procesos: [
                    { id: 1, nombre: 'Gestión de Compras', responsable_id: 1, area_id: 2, entradas: 'Requisición de material', salidas: 'Orden de compra', activo: true },
                    { id: 2, nombre: 'Atención al Cliente', responsable_id: 2, area_id: 1, entradas: 'Solicitud de cliente', salidas: 'Solución registrada', activo: true },
                    { id: 3, nombre: 'Proceso de Contratación', responsable_id: 1, area_id: 3, entradas: 'CV de candidatos', salidas: 'Contrato firmado', activo: false }
                ],
                auditorias: [
                    { id: 1, tipo: 'Interna', area_auditada_id: 2, auditor_lider_id: 3, fecha_inicio: '2024-08-01', fecha_fin: '2024-08-03', estado: 1 },
                    { id: 2, tipo: 'Externa', area_auditada_id: 1, auditor_lider_id: 1, fecha_inicio: '2024-09-15', fecha_fin: '2024-09-16', estado: 2 }
                ],
                noconformidades: [
                    { id: 1, descripcion: 'Falta de firma en registro de capacitación', origen_id: 1, estado: 'Abierta', responsable_id: 2, fecha_deteccion: '2024-08-02' },
                    { id: 2, descripcion: 'Equipo de medición fuera de calibración', origen_id: 2, estado: 'Cerrada', responsable_id: 3, fecha_deteccion: '2024-07-15' }
                ],
                avisos: [
                    { id: 1, nombre: 'Próxima Auditoría Interna', modulo: 'auditorias', dias_previos: 15, activo: true, fecha_evento: '2024-08-01' },
                    { id: 2, nombre: 'Revisión de Contrato Anual', modulo: 'documentos', dias_previos: 30, activo: false, fecha_evento: '2024-12-01' }
                ],
                catalogos: {
                    origen_noconformidad: [
                        { id: 1, nombre: 'Auditoría Interna' },
                        { id: 2, nombre: 'Auditoría Externa' },
                        { id: 3, nombre: 'Revisión por Dirección' },
                        { id: 4, nombre: 'Queja de Cliente' }
                    ],
                    puestos: [
                        { id: 1, nombre: 'Gerente de Calidad' },
                        { id: 2, nombre: 'Jefe de Producción' },
                        { id: 3, nombre: 'Auditor Interno' }
                    ],
                    areas: [
                        { id: 1, nombre: 'Calidad' },
                        { id: 2, nombre: 'Producción' },
                        { id: 3, nombre: 'Recursos Humanos' }
                    ],
                    tendencia_indicador: [
                        { id: 1, nombre: 'Positiva' },
                        { id: 2, nombre: 'Negativa' },
                        { id: 3, nombre: 'Estable' }
                    ],
                    estado_auditoria: [
                        { id: 1, nombre: 'Planificada' },
                        { id: 2, nombre: 'En Proceso' },
                        { id: 3, nombre: 'Completada' },
                        { id: 4, nombre: 'Cancelada' }
                    ]
                },
                currentCatalog: 'origen_noconformidad',
                modalMode: 'add',
                modalTitle: '',
                currentItem: {},
                historyData: {},
                personalSearchQuery: '',
                procesosSearchQuery: '',
                procesosStatusFilter: 'Todos',
                procesosAreaFilter: 0,
                documentosFilter: 'Todos',
                documentosStatusOptions: ['Todos', 'Vigente', 'En Revisión', 'Obsoleto'],
                // Options for Documentos 'estado' field in modal
                documentosEstados: ['Vigente', 'En Revisión', 'Obsoleto'],
                avisosSearchQuery: '',
                noConformidadesSearchQuery: '',
                auditoriasSearchQuery: '',
                auditoriasStatusChartInstance: null,
                noConformidadesOrigenChartInstance: null,
                itemSchemas: {
                    usuarios: { nombre: '', username: '', password: '', role: 'user' },
                    objetivos: { nombre: '', descripcion: '', responsable_id: null, progreso: 0, activo: true },
                    indicadores: { nombre: '', objetivo_asociado_id: null, meta: '', valor_actual: '', tendencia_id: null, activo: true },
                    documentos: { codigo: '', nombre: '', version: '1.0', fecha_revision: new Date().toISOString().split('T')[0], estado: 'En Revisión', file_url: '' },
                    procesos: { nombre: '', responsable_id: null, area_id: null, entradas: '', salidas: '', activo: true },
                    auditorias: { tipo: 'Interna', area_auditada_id: null, fecha_inicio: new Date().toISOString().split('T')[0], fecha_fin: new Date().toISOString().split('T')[0], auditor_lider_id: null, estado: 1 },
                    noconformidades: { descripcion: '', origen_id: null, fecha_deteccion: new Date().toISOString().split('T')[0], estado: 'Abierta', responsable_id: null },
                    avisos: { nombre: '', modulo: '', dias_previos: 15, activo: true, fecha_evento: new Date().toISOString().split('T')[0] },
                    personal: { nombre: '', puesto_id: null, area_id: null, foto_url: '' },
                    origen_noconformidad: { nombre: '' },
                    puestos: { nombre: '' },
                    areas: { nombre: '' },
                    tendencia_indicador: { nombre: '' },
                    estado_auditoria: { nombre: '' }
                },
                // Bulk reset modal state
                isResetModalOpen: false,
                resetSelectionModules: [],
                resetSelectionCatalogs: [],
                // Objetivos view mode: 'cards' | 'list'
                objetivosViewMode: 'cards',
                // Indicadores view mode: 'cards' | 'list'
                indicadoresViewMode: 'cards',
                // Personal view mode: 'cards' | 'list'
                personalViewMode: 'cards',
                // Documentos view mode: 'cards' | 'list'
                documentosViewMode: 'cards',
                // Procesos view mode: 'cards' | 'list'
                procesosViewMode: 'cards',
                // Auditorías view mode: 'cards' | 'list'
                auditoriasViewMode: 'cards',
                // Auditorías Estado filter (0 = Todos)
                auditoriasEstadoFilter: 0,
                // No Conformidades view mode: 'cards' | 'list'
                noconformidadesViewMode: 'cards',
                // No Conformidades Estado filter (0 = Todos)
                noconformidadesEstadoFilter: 0
            };
        },
        computed: {
            avisosConDiasRestantes() {
                const VENCIMIENTO_PROXIMO_DIAS = 5;
                return this.avisos.map(aviso => {
                    if (!aviso.activo) {
                        return { ...aviso, dias_restantes: null, estado_alerta: 'Inactivo' };
                    }
                    const diasRestantes = this.calculateRemainingWorkdays(aviso.fecha_evento);
                    let estadoAlerta = 'Vigente';
                    if (diasRestantes === null) {
                        estadoAlerta = 'Sin fecha';
                    } else if (diasRestantes <= 0) {
                        estadoAlerta = 'Vencido';
                    } else if (diasRestantes <= VENCIMIENTO_PROXIMO_DIAS) {
                        estadoAlerta = 'Próximo a vencer';
                    }
                    return { ...aviso, dias_restantes: diasRestantes, estado_alerta: estadoAlerta };
                });
            },
            filteredAvisos() {
                const sourceData = this.avisosConDiasRestantes;
                if (!this.avisosSearchQuery) {
                    return sourceData;
                }
                const query = this.avisosSearchQuery.toLowerCase();
                return sourceData.filter(item => {
                    const estado = item.activo ? 'activo' : 'inactivo';
                    const estadoAlerta = item.estado_alerta ? item.estado_alerta.toLowerCase() : '';
                    return item.nombre.toLowerCase().includes(query) ||
                           item.modulo.toLowerCase().includes(query) ||
                           estado.includes(query) ||
                           estadoAlerta.includes(query);
                });
            },
            filteredNoConformidades() {
                let list = this.noconformidades;
                // Filtro por Estado (0 = Todos)
                if (this.noconformidadesEstadoFilter) {
                    list = list.filter(nc => nc.estado === this.noconformidadesEstadoFilter);
                }
                if (!this.noConformidadesSearchQuery) {
                    return list;
                }
                const query = this.noConformidadesSearchQuery.toLowerCase();
                return list.filter(item => {
                    const origenName = this.getOrigenName(item.origen_id).toLowerCase();
                    const responsableName = this.getResponsableName(item.responsable_id).toLowerCase();
                    const estadoName = this.getEstadoAuditoriaName(item.estado).toLowerCase();
                    return item.descripcion.toLowerCase().includes(query) ||
                           origenName.includes(query) ||
                           estadoName.includes(query) ||
                           responsableName.includes(query);
                });
            },
            filteredAuditorias() {
                let list = this.auditorias;
                // Filtro por Estado (0 = Todos)
                if (this.auditoriasEstadoFilter) {
                    list = list.filter(a => a.estado === this.auditoriasEstadoFilter);
                }
                if (!this.auditoriasSearchQuery) {
                    return list;
                }
                const query = this.auditoriasSearchQuery.toLowerCase();
                return list.filter(item => {
                    const areaName = this.getAreaName(item.area_auditada_id).toLowerCase();
                    const auditorName = this.getAuditorLiderName(item.auditor_lider_id).toLowerCase();
                    const estadoName = this.getEstadoAuditoriaName(item.estado).toLowerCase();
                    return item.tipo.toLowerCase().includes(query) ||
                           areaName.includes(query) ||
                           auditorName.includes(query) ||
                           estadoName.includes(query);
                });
            },
            filteredPersonal() {
                if (!this.personalSearchQuery) {
                    return this.personal;
                }
                const query = this.personalSearchQuery.toLowerCase();
                return this.personal.filter(item => {
                    const puestoName = this.getPuestoName(item.puesto_id).toLowerCase();
                    const areaName = this.getAreaName(item.area_id).toLowerCase();
                    return item.nombre.toLowerCase().includes(query) ||
                        puestoName.includes(query) ||
                        areaName.includes(query);
                });
            },
            filteredProcesos() {
                let filtered = this.procesos;
                if (this.procesosStatusFilter === 'Activos') {
                    filtered = filtered.filter(item => item.activo);
                } else if (this.procesosStatusFilter === 'Inactivos') {
                    filtered = filtered.filter(item => !item.activo);
                }
                // Filtro por Área (0 = Todas)
                if (this.procesosAreaFilter) {
                    filtered = filtered.filter(item => item.area_id === this.procesosAreaFilter);
                }
                if (this.procesosSearchQuery) {
                    const query = this.procesosSearchQuery.toLowerCase();
                    filtered = filtered.filter(item => {
                        const responsableName = this.getResponsableName(item.responsable_id).toLowerCase();
                        return item.nombre.toLowerCase().includes(query) ||
                            responsableName.includes(query);
                    });
                }
                return filtered;
            },
            filteredDocumentos() {
                if (this.documentosFilter === 'Todos') {
                    return this.documentos;
                }
                return this.documentos.filter(doc => doc.estado === this.documentosFilter);
            },
            filteredModules() {
                return this.modules.filter(m => m.systems.includes(this.currentSystem));
            },
            currentSystemColor() {
                const system = this.systems.find(s => s.id === this.currentSystem);
                return system ? system.colorClass : 'bg-gray-600';
            },
            currentSchema() {
                const moduleKey = this.currentModule === 'catalogos' ? this.currentCatalog : this.currentModule;
                return this.itemSchemas[moduleKey] || {};
            },
            modalSchemaKeys() {
                return Object.keys(this.currentSchema);
            }
        },
        watch: {
            currentModule(newModule) {
                if (newModule === 'dashboard') {
                    this.$nextTick(() => {
                        this.renderAuditoriasStatusChart();
                        this.renderNoConformidadesOrigenChart();
                    });
                }
            }
        },
        methods: {
            persistModule(moduleId) {
                const allowed = ['objetivos','indicadores','documentos','procesos','auditorias','noconformidades','avisos','personal'];
                if (!allowed.includes(moduleId)) return;
                try {
                    localStorage.setItem(moduleId, JSON.stringify(this[moduleId]));
                } catch (e) {
                    console.error(`Error saving ${moduleId} to localStorage:`, e);
                }
            },
            loadFromStorage(moduleId) {
                try {
                    const raw = localStorage.getItem(moduleId);
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        this[moduleId] = parsed;
                    }
                } catch (e) {
                    console.error(`Error loading ${moduleId} from localStorage:`, e);
                }
            },
            persistCatalog(catalogId) {
                if (!this.catalogos || !this.catalogos[catalogId]) return;
                try {
                    localStorage.setItem(`catalogos:${catalogId}`, JSON.stringify(this.catalogos[catalogId]));
                } catch (e) {
                    console.error(`Error saving catalogo ${catalogId} to localStorage:`, e);
                }
            },
            loadCatalogFromStorage(catalogId) {
                try {
                    const raw = localStorage.getItem(`catalogos:${catalogId}`);
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        this.catalogos[catalogId] = parsed;
                    }
                } catch (e) {
                    console.error(`Error loading catalogo ${catalogId} from localStorage:`, e);
                }
            },
            resetCurrentData() {
                const moduleId = this.currentModule;
                if (moduleId === 'dashboard') return;
                const name = moduleId === 'catalogos' ? `catálogo "${this.currentCatalog.replace(/_/g,' ')}"` : `módulo "${moduleId}"`;
                if (!confirm(`¿Desea restablecer los datos del ${name}? Esto eliminará los datos locales.`)) return;
                if (moduleId === 'catalogos') {
                    // Clear current catalog
                    if (this.catalogos && this.catalogos[this.currentCatalog]) {
                        this.catalogos[this.currentCatalog] = [];
                    }
                    try {
                        localStorage.removeItem(`catalogos:${this.currentCatalog}`);
                    } catch (e) {
                        console.error('Error removing catalog from localStorage:', e);
                    }
                } else {
                    const allowed = ['objetivos','indicadores','documentos','procesos','auditorias','noconformidades','avisos','personal'];
                    if (!allowed.includes(moduleId)) return;
                    // Clear module array
                    this[moduleId] = [];
                    try {
                        localStorage.removeItem(moduleId);
                    } catch (e) {
                        console.error('Error removing module from localStorage:', e);
                    }
                }
            },
            openResetModal() {
                this.isResetModalOpen = true;
                this.resetSelectionModules = [];
                this.resetSelectionCatalogs = [];
            },
            closeResetModal() {
                this.isResetModalOpen = false;
            },
            confirmResetSelection() {
                const allowed = ['objetivos','indicadores','documentos','procesos','auditorias','noconformidades','avisos','personal'];
                if ((!this.resetSelectionModules || this.resetSelectionModules.length === 0) && (!this.resetSelectionCatalogs || this.resetSelectionCatalogs.length === 0)) {
                    alert('Seleccione al menos un módulo o catálogo para restablecer.');
                    return;
                }
                const total = (this.resetSelectionModules?.length || 0) + (this.resetSelectionCatalogs?.length || 0);
                if (!confirm(`¿Desea restablecer ${total} elemento(s)? Esto eliminará los datos locales seleccionados.`)) return;
                // Reset modules
                (this.resetSelectionModules || []).forEach(mod => {
                    if (allowed.includes(mod)) {
                        this[mod] = [];
                        try { localStorage.removeItem(mod); } catch (e) { console.error(`Error removing ${mod} from localStorage:`, e); }
                    }
                });
                // Reset catalogs
                (this.resetSelectionCatalogs || []).forEach(cat => {
                    if (this.catalogos && this.catalogos[cat]) {
                        this.catalogos[cat] = [];
                        try { localStorage.removeItem(`catalogos:${cat}`); } catch (e) { console.error(`Error removing catalog ${cat} from localStorage:`, e); }
                    }
                });
                this.closeResetModal();
            },
            async loadModuleData(moduleId) {
                try {
                    if (moduleId === 'usuarios') {
                        const resp = await fetch(`${this.apiBase}/api/usuarios`);
                        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                        const data = await resp.json();
                        this.usuarios = Array.isArray(data) ? data : [];
                    }
                } catch (err) {
                    console.error(`Error cargando datos para módulo "${moduleId}":`, err);
                }
            },
            formatDate(dateString) {
                if (!dateString) return 'N/A';
                const date = new Date(dateString.replace(/-/g, '/'));
                return date.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            },
            changeSystem(systemId) {
                this.currentSystem = systemId;
                this.currentModule = 'dashboard';
            },
            getStatusClass(status) {
                switch (status) {
                    case 'Vigente': return 'bg-green-100 text-green-800';
                    case 'En Revisión': return 'bg-yellow-100 text-yellow-800';
                    case 'Obsoleto': return 'bg-red-100 text-red-800';
                    default: return 'bg-slate-100 text-slate-800';
                }
            },
            openModal(mode, item = null) {
                this.modalMode = mode;
                const moduleConfig = this.modules.find(m => m.id === this.currentModule) || (this.currentModule === 'catalogos' && { singular: 'Elemento del Catálogo' });
                const singular = moduleConfig.singular;
                this.modalTitle = mode === 'add' ? `Agregar ${singular}` : `Editar ${singular}`;
                if (mode === 'add') {
                    const moduleKey = this.currentModule === 'catalogos' ? this.currentCatalog : this.currentModule;
                    const schema = this.itemSchemas[moduleKey];
                    this.currentItem = schema ? { ...schema } : {};
                } else {
                    this.currentItem = JSON.parse(JSON.stringify(item));
                    if (this.currentModule === 'documentos' && !this.currentItem.hasOwnProperty('descripcion_cambios')) {
                        this.currentItem.descripcion_cambios = '';
                    }
                }
                this.isModalOpen = true;
            },
            closeModal() {
                this.isModalOpen = false;
                this.currentItem = {};
            },
            async saveItem() {
                let dataArray;
                if (this.currentModule === 'catalogos') {
                    dataArray = this.catalogos[this.currentCatalog];
                } else {
                    dataArray = this[this.currentModule];
                }

                if (this.modalMode === 'add') {
                    // Special handling: usuarios are created via backend
                    if (this.currentModule === 'usuarios') {
                        const payload = { nombre: this.currentItem.nombre, username: this.currentItem.username, password: this.currentItem.password, role: this.currentItem.role || 'user' };
                        if (!payload.nombre || !payload.username || !payload.password) {
                            alert('Por favor, complete nombre, usuario y contraseña.');
                            return;
                        }
                        try {
                            const resp = await fetch(`${this.apiBase}/api/usuarios`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            if (!resp.ok) {
                                const err = await resp.json().catch(() => ({}));
                                throw new Error(err.error || `HTTP ${resp.status}`);
                            }
                            await this.loadModuleData('usuarios');
                            this.closeModal();
                            return;
                        } catch (e) {
                            console.error('Error creando usuario:', e);
                            alert(`No se pudo crear el usuario: ${e.message}`);
                            return;
                        }
                    }
                    const newItem = { ...this.currentItem, id: Date.now() };
                    if (this.currentModule === 'documentos') {
                        newItem.historial = [{
                            version: newItem.version || '1.0',
                            fecha_revision: new Date().toISOString().split('T')[0],
                            editor: this.loggedInUser.nombre,
                            cambios: 'Creación inicial del documento.'
                        }];
                        newItem.fecha_revision = new Date().toISOString().split('T')[0];
                    }
                    dataArray.push(newItem);
                } else { // Edit mode
                    // Special handling: usuarios are updated via backend
                    if (this.currentModule === 'usuarios') {
                        const payload = { id: this.currentItem.id, nombre: this.currentItem.nombre, username: this.currentItem.username, role: this.currentItem.role || 'user' };
                        if (this.currentItem.password) {
                            payload.password = this.currentItem.password;
                        }
                        if (!payload.id || !payload.nombre || !payload.username) {
                            alert('ID, nombre y usuario son requeridos.');
                            return;
                        }
                        try {
                            const resp = await fetch(`${this.apiBase}/api/usuarios/${payload.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            if (!resp.ok) {
                                const err = await resp.json().catch(() => ({}));
                                throw new Error(err.error || `HTTP ${resp.status}`);
                            }
                            await this.loadModuleData('usuarios');
                            this.closeModal();
                            return;
                        } catch (e) {
                            console.error('Error actualizando usuario:', e);
                            alert(`No se pudo actualizar el usuario: ${e.message}`);
                            return;
                        }
                    }
                    const index = dataArray.findIndex(item => item.id === this.currentItem.id);
                    if (index !== -1) {
                        const originalItem = dataArray[index];
                        const updatedItem = { ...this.currentItem };
                        if (this.currentModule === 'documentos' && originalItem.version !== updatedItem.version) {
                            const newHistoryEntry = {
                                version: updatedItem.version,
                                fecha_revision: new Date().toISOString().split('T')[0],
                                editor: this.loggedInUser.nombre,
                                cambios: updatedItem.descripcion_cambios || `Documento actualizado a la versión ${updatedItem.version}.`
                            };
                            const newHistory = originalItem.historial ? [...originalItem.historial] : [];
                            newHistory.unshift(newHistoryEntry);
                            updatedItem.historial = newHistory;
                            updatedItem.fecha_revision = newHistoryEntry.fecha_revision;
                        }
                        dataArray.splice(index, 1, updatedItem);
                    }
                }
                // Persist current module or catálogo after add/edit
                if (this.currentModule === 'catalogos') {
                    this.persistCatalog(this.currentCatalog);
                } else {
                    this.persistModule(this.currentModule);
                }
                this.closeModal();
                this.$nextTick(() => {
                    if(this.currentModule === 'dashboard') {
                        this.renderAuditoriasStatusChart();
                        this.renderNoConformidadesOrigenChart();
                    }
                });
            },
            async deleteItem(itemToDelete) {
                const itemName = itemToDelete.nombre || itemToDelete.descripcion || `ID: ${itemToDelete.id}`;
                if (!confirm(`¿Está seguro de que desea eliminar "${itemName}"?`)) {
                    return;
                }
                // Special handling: usuarios are deleted via backend
                if (this.currentModule === 'usuarios') {
                    try {
                        const resp = await fetch(`${this.apiBase}/api/usuarios/${itemToDelete.id}`, { method: 'DELETE' });
                        if (!resp.ok && resp.status !== 204) {
                            const err = await resp.json().catch(() => ({}));
                            throw new Error(err.error || `HTTP ${resp.status}`);
                        }
                        await this.loadModuleData('usuarios');
                        return;
                    } catch (e) {
                        console.error('Error eliminando usuario:', e);
                        alert(`No se pudo eliminar el usuario: ${e.message}`);
                        return;
                    }
                }
                let dataArray;
                if (this.currentModule === 'catalogos') {
                    dataArray = this.catalogos[this.currentCatalog];
                } else {
                    dataArray = this[this.currentModule];
                }

                const index = dataArray.findIndex(item => item.id === itemToDelete.id);
                if (index !== -1) {
                    dataArray.splice(index, 1);
                }
                // Persist current module or catálogo after delete
                if (this.currentModule === 'catalogos') {
                    this.persistCatalog(this.currentCatalog);
                } else {
                    this.persistModule(this.currentModule);
                }
                this.$nextTick(() => {
                    if(this.currentModule === 'dashboard') {
                        this.renderAuditoriasStatusChart();
                        this.renderNoConformidadesOrigenChart();
                    }
                });
            },
            getFileName(url) {
                if (!url) return 'No hay archivo';
                return url.split('/').pop();
            },
            openHistoryModal(documento) {
                this.historyData = documento;
                this.isHistoryModalOpen = true;
            },
            closeHistoryModal() {
                this.isHistoryModalOpen = false;
            },
            async handleFileUpload(event) {
                try {
                    const file = event?.target?.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    const base = (this.apiBase || '').replace(/\/$/, '');
                    const resp = await fetch(`${base}/api/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        throw new Error(err.error || `Error de carga: HTTP ${resp.status}`);
                    }
                    const data = await resp.json().catch(() => ({}));
                    const uploadedPath = data?.path || data?.filePath || '';
                    if (!uploadedPath) throw new Error('Respuesta inválida del servidor.');
                    // Normalize to relative path without leading slash for storage
                    const relative = uploadedPath.startsWith('/') ? uploadedPath.slice(1) : uploadedPath;
                    this.currentItem.file_url = relative;
                } catch (e) {
                    console.error('handleFileUpload error:', e);
                    alert(`No se pudo subir el archivo: ${e.message}`);
                } finally {
                    // Reset input value so selecting the same file again re-triggers change
                    if (event && event.target) event.target.value = '';
                }
            },
            async handleFotoUpload(event) {
                try {
                    const file = event?.target?.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    const base = (this.apiBase || '').replace(/\/$/, '');
                    const resp = await fetch(`${base}/api/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        throw new Error(err.error || `Error de carga: HTTP ${resp.status}`);
                    }
                    const data = await resp.json().catch(() => ({}));
                    const uploadedPath = data?.path || data?.filePath || '';
                    if (!uploadedPath) throw new Error('Respuesta inválida del servidor.');
                    const relative = uploadedPath.startsWith('/') ? uploadedPath.slice(1) : uploadedPath;
                    this.currentItem.foto_url = relative;
                } catch (e) {
                    console.error('handleFotoUpload error:', e);
                    alert(`No se pudo subir la imagen: ${e.message}`);
                } finally {
                    if (event && event.target) event.target.value = '';
                }
            },
            openPreview(item) {
                try {
                    const url = this.resolveFileUrl(item?.file_url || '');
                    if (!url) return;
                    this.previewSrc = url;
                    this.isPreviewModalOpen = true;
                } catch (e) {
                    console.error('openPreview error:', e);
                }
            },
            closePreview() {
                this.isPreviewModalOpen = false;
                this.previewSrc = '';
            },
            resolveFileUrl(url) {
                if (!url) return '';
                // If already absolute (http/https), return as is
                if (/^https?:\/\//i.test(url)) return url;
                // If it's an uploads path, return it as site-relative so Netlify can proxy /uploads/*
                if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
                    return url.startsWith('/') ? url : `/${url}`;
                }
                // Otherwise, prefix with apiBase (for API-like relative paths if any)
                const base = (this.apiBase || '').replace(/\/$/, '');
                const path = url.startsWith('/') ? url : `/${url}`;
                return `${base}${path}`;
            }
        },
        mounted() {
            console.log('Vue app mounted.');
            // Authentication check: require loggedInUser in sessionStorage
            try {
                const rawUser = sessionStorage.getItem('loggedInUser');
                if (rawUser) {
                    this.loggedInUser = JSON.parse(rawUser);
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                    window.location.href = 'login.html';
                    return;
                }
            } catch (e) {
                console.error('Error leyendo sesión de usuario:', e);
                this.isAuthenticated = false;
                window.location.href = 'login.html';
                return;
            }
            // Configure API base dynamically similar to login.js
            try {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const stored = localStorage.getItem('API_BASE');
                // window.API_BASE can be injected before app.js if needed
                const runtime = typeof window !== 'undefined' && window.API_BASE ? window.API_BASE : null;
                this.apiBase = runtime || stored || (isLocalhost ? 'http://localhost:3003' : '/api');
            } catch (e) {
                console.warn('No se pudo configurar apiBase dinámicamente, usando defaults. Detalle:', e);
                this.apiBase = 'http://localhost:3003';
            }
            // Load persisted data for editable modules
            ['objetivos','indicadores','documentos','procesos','auditorias','noconformidades','avisos','personal']
                .forEach(m => this.loadFromStorage(m));
            // Load persisted catalogs
            Object.keys(this.catalogos || {}).forEach(c => this.loadCatalogFromStorage(c));
            this.$nextTick(() => {
                if (this.currentModule === 'dashboard') {
                    this.renderAuditoriasStatusChart();
                    this.renderNoConformidadesOrigenChart();
                }
            });
        }
    });

    app.config.errorHandler = (err, instance, info) => {
        console.error(`Error in component ${instance.$.type.name}: ${err.message}`);
        console.error(err);
    };

    app.mount('#app');
    console.log('Vue app mounted successfully.');

} catch (e) {
    console.error('Fatal error during Vue app initialization:');
    console.error(e);
}