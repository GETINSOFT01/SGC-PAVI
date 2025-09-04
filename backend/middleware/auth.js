const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Convertir jwt.verify en una promesa
const verify = promisify(jwt.verify);

/**
 * Middleware para verificar el token JWT en las peticiones
 * Añade el usuario decodificado a req.user si el token es válido
 */
const auth = async (req, res, next) => {
  try {
    // 1. Obtener el token del header 'Authorization'
    const authHeader = req.headers.authorization;
    
    // Verificar si el header existe y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // Extraer el token eliminando 'Bearer ' del inicio
    const token = authHeader.split(' ')[1];

    // 2. Verificar y decodificar el token
    const decoded = await verify(token, process.env.JWT_SECRET);
    
    // 3. Añadir la información del usuario al objeto request
    req.user = decoded;
    
    // 4. Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    // Manejar diferentes tipos de errores de JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token de autenticación inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'La sesión ha expirado, por favor inicia sesión nuevamente' 
      });
    }
    
    // Para otros errores inesperados
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor durante la autenticación' 
    });
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {...string} roles - Roles permitidos para acceder a la ruta
 * @returns {Function} Middleware que verifica si el usuario tiene el rol necesario
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'No autenticado' 
      });
    }
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        error: 'No tienes permiso para acceder a este recurso' 
      });
    }
    
    // Si todo está bien, continuar
    next();
  };
};

module.exports = { 
  auth, 
  authorize 
};
