const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configuración de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1', // Valor por defecto
  signatureVersion: 'v4' // Usar la versión 4 de la firma
});

// Configuración de Multer para manejar la subida de archivos
const multer = require('multer');
const multerS3 = require('multer-s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'private', // Archivos privados por defecto
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const extension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${extension}`;
      cb(null, `uploads/${req.user ? req.user.id : 'anonymous'}/${fileName}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB
    files: 5 // Máximo 5 archivos por petición
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Tipo de archivo no permitido');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    
    cb(null, true);
  }
});

// Middleware para manejar errores de Multer
const handleUploadErrors = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo es demasiado grande (máx. 10MB)' });
  }
  if (err.code === 'LIMIT_FILE_TYPES') {
    return res.status(400).json({ error: 'Tipo de archivo no permitido' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Demasiados archivos (máx. 5 por petición)' });
  }
  next(err);
};

// Función para generar URL firmada para descarga
const getSignedUrl = (key, expiresIn = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: expiresIn // Tiempo de expiración en segundos (1 hora por defecto)
  });
};

// Función para eliminar archivo
const deleteFile = async (key) => {
  try {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET,
      Key: key
    }).promise();
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de S3:', error);
    return false;
  }
};

module.exports = {
  s3,
  upload,
  handleUploadErrors,
  getSignedUrl,
  deleteFile,
  uuidv4
};
