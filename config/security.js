const helmet = require('helmet');
const cors = require('cors');

// Configuración de Helmet para headers de seguridad
const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Necesario para Swagger UI
      scriptSrc: ["'self'", "'unsafe-inline'"], // Necesario para Swagger UI
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  
  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false, // Deshabilitado para Swagger
  
  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  
  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: 'same-origin' },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Expect-CT
  expectCt: {
    maxAge: 86400,
    enforce: true
  },
  
  // Frameguard (protección contra clickjacking)
  frameguard: { action: 'deny' },
  
  // Hide Powered By
  hidePoweredBy: true,
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  
  // Referrer Policy
  referrerPolicy: { policy: 'no-referrer' },
  
  // X-XSS-Protection
  xssFilter: true
});

// Configuración de CORS (Cross-Origin Resource Sharing)
const corsConfig = cors({
  // Lista de orígenes permitidos
  origin: function (origin, callback) {
    // Lista blanca de dominios permitidos
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4200',
      'http://127.0.0.1:3000',
      // Agregar tus dominios de producción aquí
      // 'https://tu-dominio.com',
      // 'https://www.tu-dominio.com'
    ];
    
    // Permitir requests sin origin (como Postman, cURL)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Headers permitidos
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  
  // Headers expuestos al cliente
  exposedHeaders: [
    'X-Total-Count',
    'X-Page',
    'X-Per-Page',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset'
  ],
  
  // Permitir credenciales (cookies, authorization headers)
  credentials: true,
  
  // Tiempo de caché de preflight (OPTIONS)
  maxAge: 86400, // 24 horas
  
  // Continuar con la siguiente función si falla CORS
  optionsSuccessStatus: 200
});

// Configuración de CORS más permisiva para desarrollo
const corsConfigDev = cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
});

// Middleware adicional para prevenir ataques comunes
const additionalSecurity = (req, res, next) => {
  // Remover headers que revelan información del servidor
  res.removeHeader('X-Powered-By');
  
  // Agregar header personalizado para identificar la API
  res.setHeader('X-API-Version', '3.0.0');
  
  // Prevenir que los navegadores adivinen el MIME type
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  next();
};

// Middleware para validar Content-Type en POST/PUT/PATCH
const validateContentType = (req, res, next) => {
  // Solo validar en métodos que envían body
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    // Permitir JSON y multipart/form-data (para uploads)
    if (contentType && 
        !contentType.includes('application/json') && 
        !contentType.includes('multipart/form-data')) {
      return res.status(415).json({
        error: 'Content-Type no soportado',
        message: 'Use application/json o multipart/form-data'
      });
    }
  }
  
  next();
};

module.exports = {
  helmetConfig,
  corsConfig,
  corsConfigDev,
  additionalSecurity,
  validateContentType
};