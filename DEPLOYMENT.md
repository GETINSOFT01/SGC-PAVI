# SGC PAVI - Guía de Despliegue

## Arquitectura de Despliegue

Este proyecto utiliza una arquitectura dividida:
- **Frontend**: Archivos estáticos desplegados en Netlify
- **Backend**: API Node.js/Express desplegada en Render
- **Base de datos**: SQLite incluida con el backend

## Despliegue en Render (Backend)

### Paso 1: Configurar el servicio en Render

1. Ve a [render.com](https://render.com) e inicia sesión
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio GitHub: `GETINSOFT01/SGC-PAVI`
4. Configura el servicio con los siguientes valores:

**Configuración básica:**
- **Name**: `sgc-pavi-backend`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Comandos de build y start:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Configuración avanzada:**
- **Plan**: `Free`
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes`

### Paso 2: Variables de entorno

Agregar las siguientes variables de entorno en Render:
- `NODE_ENV`: `production`
- `PORT`: (Render lo asigna automáticamente)

### Paso 3: Verificar el despliegue

Una vez desplegado, verifica que funciona:
- Health check: `https://sgc-grupo-pavi.onrender.com/api/health`
- Debería devolver: `{"status":"OK","message":"SGC PAVI Backend is running","timestamp":"..."}`

## Despliegue en Netlify (Frontend)

### Configuración automática

El archivo `netlify.toml` ya está configurado para:
1. Construir los estilos CSS con Tailwind
2. Servir archivos estáticos desde la raíz del proyecto
3. Redirigir llamadas `/api/*` al backend en Render

### Pasos para desplegar:

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Conecta tu repositorio GitHub: `GETINSOFT01/SGC-PAVI`
3. Netlify detectará automáticamente la configuración desde `netlify.toml`
4. El sitio se construirá y desplegará automáticamente

## Estructura de URLs

- **Frontend**: `https://tu-sitio.netlify.app`
- **Backend**: `https://sgc-grupo-pavi.onrender.com`
- **API Endpoints**: `https://tu-sitio.netlify.app/api/*` (proxy a Render)

## Troubleshooting

### Error 404 en el backend
- Verificar que el servicio esté ejecutándose en Render
- Comprobar los logs de despliegue
- Verificar el health check endpoint

### Problemas de CORS
- El backend ya tiene CORS habilitado
- Verificar que las URLs coincidan en la configuración

### Base de datos
- SQLite se incluye automáticamente con el despliegue
- Los datos se reinician en cada despliegue (usar PostgreSQL para persistencia)

## Monitoreo

- **Render Dashboard**: Para logs y métricas del backend
- **Netlify Dashboard**: Para logs y métricas del frontend
- **Health Check**: `/api/health` para verificar el estado del backend
