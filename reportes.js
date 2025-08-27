document.addEventListener('DOMContentLoaded', () => {
    const app = Vue.createApp({
        data() {
            return {
                currentCategory: 'general',
                reportCategories: [
                    { id: 'general', name: 'General', icon: 'fas fa-chart-pie' },
                    { id: 'documentos', name: 'Documentos', icon: 'fas fa-file-alt' },
                    { id: 'auditorias', name: 'Auditorías', icon: 'fas fa-clipboard-check' },
                    { id: 'noconformidades', name: 'No Conformidades', icon: 'fas fa-exclamation-triangle' },
                    { id: 'objetivos', name: 'Objetivos', icon: 'fas fa-bullseye' },
                    { id: 'personal', name: 'Personal', icon: 'fas fa-users' },
                ],
                // Data properties
                documentos: [],
                auditorias: [],
                noconformidades: [],
                objetivos: [],
                personal: [],
                catalogos: { areas: [], puestos: [], origenes_noconformidad: [], auditores_lideres: [] },
                chartInstances: {},
            };
        },
        methods: {
            async fetchData(endpoint) {
                try {
                    const response = await fetch(`http://localhost:3002/api/${endpoint}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error(`Failed to fetch ${endpoint}:`, error);
                    return [];
                }
            },

            async loadAllData() {
                console.log('Loading all data for reports...');
                [this.documentos, this.auditorias, this.noconformidades, this.objetivos, this.personal, this.catalogos] = await Promise.all([
                    this.fetchData('documentos'),
                    this.fetchData('auditorias'),
                    this.fetchData('noconformidades'),
                    this.fetchData('objetivos'),
                    this.fetchData('personal'),
                    this.fetchData('catalogos'), // Assuming a single endpoint for all catalogs
                ]);
                console.log('Data loaded:', this.$data);
                this.renderCurrentCategoryCharts();
            },

            selectCategory(categoryId) {
                this.currentCategory = categoryId;
                this.$nextTick(() => {
                    this.renderCurrentCategoryCharts();
                });
            },

            renderCurrentCategoryCharts() {
                // Destroy previous charts in the category to prevent conflicts
                Object.values(this.chartInstances).forEach(chart => chart.destroy());
                this.chartInstances = {};

                switch (this.currentCategory) {
                    case 'general':
                        this.renderAuditoriasStatusChart('auditoriasStatusChart');
                        this.renderNoConformidadesOrigenChart('noConformidadesOrigenChart');
                        this.renderDocumentosStatusChart('documentosStatusChart');
                        break;
                    case 'documentos':
                        this.renderDocumentosStatusChart('docStatusChart');
                        // this.renderDocsVencimientoList();
                        break;
                    case 'auditorias':
                        this.renderAuditoriasTipoChart('auditoriasTipoChart');
                        this.renderAuditoriasAreaChart('auditoriasAreaChart');
                        break;
                    case 'noconformidades':
                        this.renderNoConformidadEstadoChart('noConformidadEstadoChart');
                        this.renderNoConformidadOrigenChart('noConformidadOrigenChart');
                        break;
                    case 'objetivos':
                        this.renderObjetivosProgresoChart('objetivosProgresoChart');
                        break;
                    case 'personal':
                        this.renderPersonalAreaChart('personalAreaChart');
                        this.renderPersonalPuestoChart('personalPuestoChart');
                        break;
                }
            },

            // --- Chart Rendering Methods ---
            createChart(canvasId, type, data, options) {
                const ctx = document.getElementById(canvasId);
                if (!ctx) return null;
                return new Chart(ctx.getContext('2d'), { type, data, options });
            },

            renderDocumentosStatusChart(canvasId) {
                const statusCounts = this.documentos.reduce((acc, doc) => {
                    acc[doc.estado] = (acc[doc.estado] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.docStatus = this.createChart(canvasId, 'pie', {
                    labels: Object.keys(statusCounts),
                    datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#10B981', '#F59E0B', '#EF4444'] }]
                }, { responsive: true, plugins: { legend: { position: 'top' } } });
            },

            renderAuditoriasStatusChart(canvasId) {
                const statusCounts = this.auditorias.reduce((acc, audit) => {
                    const estado = this.catalogos.estados_auditoria?.find(e => e.id === audit.estado)?.nombre || audit.estado;
                    acc[estado] = (acc[estado] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.auditStatus = this.createChart(canvasId, 'doughnut', {
                    labels: Object.keys(statusCounts),
                    datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6B7280', '#EF4444'] }]
                }, { responsive: true, plugins: { legend: { position: 'top' } } });
            },
            
            renderAuditoriasTipoChart(canvasId) {
                const tipoCounts = this.auditorias.reduce((acc, audit) => {
                    acc[audit.tipo] = (acc[audit.tipo] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.auditTipo = this.createChart(canvasId, 'pie', {
                    labels: Object.keys(tipoCounts),
                    datasets: [{ data: Object.values(tipoCounts), backgroundColor: ['#8B5CF6', '#10B981'] }]
                }, { responsive: true, plugins: { legend: { position: 'top' } } });
            },

            renderAuditoriasAreaChart(canvasId) {
                const areaCounts = this.auditorias.reduce((acc, audit) => {
                    const areaName = this.catalogos.areas?.find(a => a.id === audit.area_auditada_id)?.nombre || 'N/A';
                    acc[areaName] = (acc[areaName] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.auditArea = this.createChart(canvasId, 'bar', {
                    labels: Object.keys(areaCounts),
                    datasets: [{ label: 'Auditorías por Área', data: Object.values(areaCounts), backgroundColor: '#3B82F6' }]
                }, { responsive: true, scales: { y: { beginAtZero: true } } });
            },

            renderNoConformidadesOrigenChart(canvasId) {
                const origenCounts = this.noconformidades.reduce((acc, nc) => {
                    const origenName = this.catalogos.origenes_noconformidad?.find(o => o.id === nc.origen_id)?.nombre || 'Desconocido';
                    acc[origenName] = (acc[origenName] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.ncOrigen = this.createChart(canvasId, 'bar', {
                    labels: Object.keys(origenCounts),
                    datasets: [{ label: 'No Conformidades por Origen', data: Object.values(origenCounts), backgroundColor: '#EF4444' }]
                }, { responsive: true, indexAxis: 'y', scales: { x: { beginAtZero: true } } });
            },

            renderNoConformidadEstadoChart(canvasId) {
                const estadoCounts = this.noconformidades.reduce((acc, nc) => {
                    const estadoName = this.catalogos.estados_noconformidad?.find(e => e.id === nc.estado)?.nombre || nc.estado;
                    acc[estadoName] = (acc[estadoName] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.ncEstado = this.createChart(canvasId, 'pie', {
                    labels: Object.keys(estadoCounts),
                    datasets: [{ data: Object.values(estadoCounts), backgroundColor: ['#F59E0B', '#10B981', '#6B7280'] }]
                }, { responsive: true, plugins: { legend: { position: 'top' } } });
            },

            renderObjetivosProgresoChart(canvasId) {
                this.chartInstances.objProgreso = this.createChart(canvasId, 'bar', {
                    labels: this.objetivos.map(o => o.nombre),
                    datasets: [{
                        label: 'Progreso (%)',
                        data: this.objetivos.map(o => o.progreso),
                        backgroundColor: this.objetivos.map(o => o.progreso < 50 ? '#EF4444' : o.progreso < 90 ? '#F59E0B' : '#10B981'),
                    }]
                }, { responsive: true, indexAxis: 'y', scales: { x: { beginAtZero: true, max: 100 } } });
            },

            renderPersonalAreaChart(canvasId) {
                const areaCounts = this.personal.reduce((acc, p) => {
                    const areaName = this.catalogos.areas?.find(a => a.id === p.area_id)?.nombre || 'N/A';
                    acc[areaName] = (acc[areaName] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.personalArea = this.createChart(canvasId, 'doughnut', {
                    labels: Object.keys(areaCounts),
                    datasets: [{ data: Object.values(areaCounts), backgroundColor: ['#1D4ED8', '#047857', '#9333EA', '#B91C1C'] }]
                }, { responsive: true, plugins: { legend: { position: 'top' } } });
            },

            renderPersonalPuestoChart(canvasId) {
                const puestoCounts = this.personal.reduce((acc, p) => {
                    const puestoName = this.catalogos.puestos?.find(pu => pu.id === p.puesto_id)?.nombre || 'N/A';
                    acc[puestoName] = (acc[puestoName] || 0) + 1;
                    return acc;
                }, {});
                this.chartInstances.personalPuesto = this.createChart(canvasId, 'bar', {
                    labels: Object.keys(puestoCounts),
                    datasets: [{ label: 'Nº de Empleados por Puesto', data: Object.values(puestoCounts), backgroundColor: '#06B6D4' }]
                }, { responsive: true, scales: { y: { beginAtZero: true } } });
            }
        },
        mounted() {
            console.log('Reports Vue app mounted.');
            const user = window.shared.checkAuth();
            if (user) {
                window.shared.loadUserProfile(user);
                window.shared.loadNavMenu(this.reportCategories.map(c => ({...c, path: '#'})), 'Reportes'); // Simplified for reports
                this.loadAllData();
            } else {
                 window.location.href = 'login.html';
            }
        },
    });

    app.mount('#app');
});
