import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';

createApp({
    data() {
        return {
            // API base configurable en runtime:
            // 1) window.API_BASE (inyectable via <script> en HTML o Snippet en Netlify)
            // 2) localStorage.API_BASE
            // 3) Por defecto: localhost en desarrollo, relativo en producción (Netlify proxy /api)
            apiBase: (typeof window !== 'undefined' && (window.API_BASE || localStorage.getItem('API_BASE'))) ||
                     ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3003' : ''),
            username: '',
            password: '',
            error: '',
            logoUrl: 'https://placehold.co/100x100/1E293B/38BDF8?text=SGC'
        }
    },
    methods: {
        async login() {
            this.error = '';
            try {
                const username = (this.username || '').trim();
                const password = (this.password || '').trim();
                if (!username || !password) {
                    throw new Error('Usuario y contraseña son requeridos');
                }
                const base = this.apiBase || '';
                const resp = await fetch(`${base}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err.message || `HTTP ${resp.status}`);
                }
                const data = await resp.json();
                if (data && data.success && data.user) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Respuesta inválida del servidor');
                }
            } catch (e) {
                this.error = e.message || 'Usuario o contraseña incorrectos.';
                this.password = '';
            }
        }
    }
}).mount('#login-app');
