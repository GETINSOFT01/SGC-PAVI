# SGC-PAVI

Aplicación web con frontend estático y backend en Express + SQLite.

## Requisitos
- Node.js 18+ y npm
- Opcional: `http-server` (lo usamos vía `npx`)

## Instalación
```bash
# En la raíz del proyecto
npm install

# Backend
cd backend
npm install
```

## Construir estilos (Tailwind)
```bash
# En la raíz
npm run build:css
```
Genera `src/styles/tailwind.css` a partir de `src/styles/input.css`.

## Ejecutar
- Backend (puerto 3003):
```bash
cd backend
npm start
```
- Frontend (puerto 8080):
```bash
# En la raíz del proyecto
npx http-server -p 8080 -c-1 .
```
Luego abre: `http://127.0.0.1:8080`

El frontend apunta al backend en `login.js` con `apiBase = "http://localhost:3003"`.

## Credenciales por defecto
- usuario: `admin`
- contraseña: `admin123`

Al iniciar el backend por primera vez se crea/usa `sgc.db` en la raíz y se siembra el usuario admin.

## Estructura relevante
- `backend/server.js`: servidor Express, endpoints `/api/*`, estáticos en `/uploads`.
- `sgc.db`: base de datos SQLite en la raíz (ignorada por git).
- `src/styles/input.css`: entrada de Tailwind.
- `src/styles/tailwind.css`: salida generada (ignorada por git).

## Endpoints principales
- `POST /api/login` — login con `{ username, password }`.
- `GET /api/usuarios` — lista (sin passwords).
- `POST /api/usuarios` — crear usuario.
- `PUT /api/usuarios/:id` — actualizar.
- `DELETE /api/usuarios/:id` — borrar.
- `GET /api/:module` — lectura genérica con allowlist (`objetivos`, `indicadores`, `documentos`, `procesos`, `auditorias`, `noconformidades`, `avisos`, `personal`, `usuarios`, `catalogos`).

## Notas
- Archivos ignorados: `node_modules/`, `src/styles/tailwind.css`, `sgc.db`, `backend/uploads/`, `.env`.
- Si cambias el puerto del backend, actualiza `login.js` (`apiBase`).
- Para desarrollo, puedes dejar corriendo:
  - `npm start` en `backend/`
  - `npx http-server -p 8080 -c-1 .` en la raíz
