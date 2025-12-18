const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Stream para escribir logs en archivo
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Formato personalizado que NO expone información sensible
morgan.token('sanitized-body', (req) => {
  if (!req.body) return '-';
  
  // Clonar el body para no modificar el original
  const sanitizedBody = { ...req.body };
  
  // Lista de campos sensibles a ocultar
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'creditCard',
    'cvv',
    'ssn'
  ];
  
  // Reemplazar campos sensibles con [REDACTED]
  sensitiveFields.forEach(field => {
    if (sanitizedBody[field]) {
      sanitizedBody[field] = '[REDACTED]';
    }
  });
  
  return JSON.stringify(sanitizedBody);
});

// Formato personalizado para desarrollo
const devFormat = ':method :url :status :response-time ms - :res[content-length]';

// Formato personalizado para producción (más detallado pero seguro)
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Configuración para desarrollo
const developmentLogger = morgan(devFormat, {
  skip: (req, res) => {
    // No loggear health checks
    return req.url === '/health' || req.url === '/';
  }
});

// Configuración para producción
const productionLogger = morgan(prodFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Solo loggear errores y requests importantes en producción
    return res.statusCode < 400;
  }
});

// Middleware para loggear errores de manera segura
const errorLogger = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    error: {
      message: err.message,
      // NO incluir stack trace en producción
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  };
  
  // Escribir en archivo de errores
  const errorLogPath = path.join(logsDir, 'errors.log');
  fs.appendFileSync(
    errorLogPath,
    JSON.stringify(errorLog) + '\n'
  );
  
  // En desarrollo, también mostrar en consola
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', errorLog);
  }
  
  next(err);
};

// Middleware para respuestas de error seguras
const safeErrorResponse = (err, req, res, next) => {
  // Determinar código de estado
  const statusCode = err.statusCode || 500;
  
  // En producción, NO exponer detalles del error
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({
      error: statusCode === 500 ? 'Error interno del servidor' : err.message,
      timestamp: new Date().toISOString(),
      path: req.url
    });
  }
  
  // En desarrollo, mostrar más detalles
  res.status(statusCode).json({
    error: err.message,
    timestamp: new Date().toISOString(),
    path: req.url,
    ...(err.details && { details: err.details }),
    ...(err.stack && { stack: err.stack.split('\n') })
  });
};

module.exports = {
  developmentLogger,
  productionLogger,
  errorLogger,
  safeErrorResponse
};