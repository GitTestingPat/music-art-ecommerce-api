require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');

// Importar configuración de seguridad
const { 
  helmetConfig, 
  corsConfig, 
  corsConfigDev, 
  additionalSecurity,
  validateContentType 
} = require('./config/security');

const { 
  developmentLogger, 
  productionLogger,
  errorLogger,
  safeErrorResponse
} = require('./config/logger');

const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// ==================== SEGURIDAD ====================

// 1. Helmet - Headers de seguridad
app.use(helmetConfig);

// 2. CORS - Control de acceso
app.use(isProduction ? corsConfig : corsConfigDev);

// 3. Rate Limiting - Prevención de ataques de fuerza bruta
app.use(generalLimiter);

// 4. Logger - Registro seguro de peticiones
app.use(isProduction ? productionLogger : developmentLogger);

// 5. Seguridad adicional
app.use(additionalSecurity);
app.use(validateContentType);

// ==================== MIDDLEWARE BÁSICO ====================

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== SWAGGER DOCUMENTATION ====================

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API E-commerce - Documentación"
}));

// ==================== ROUTES ====================

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const cartRouter = require('./routes/cart');
const reviewsRouter = require('./routes/reviews');
const couponsRouter = require('./routes/coupons');
const dashboardRouter = require('./routes/dashboard');
const wishlistRouter = require('./routes/wishlist');

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/wishlist', wishlistRouter);

// ==================== ROOT ENDPOINT ====================

app.get('/', (req, res) => {
  res.json({
    message: '🎸 API E-commerce - Instrumentos Musicales, Libros y Arte',
    version: '3.0.0',
    environment: isProduction ? 'production' : 'development',
    contract: {
      openapi_json: `http://localhost:${PORT}/openapi.json`,
      openapi_yaml: `http://localhost:${PORT}/openapi.yaml`,
      swagger_ui: `http://localhost:${PORT}/api-docs`,
      swagger_json: `http://localhost:${PORT}/api-docs.json`
    },
    security: {
      rateLimit: 'activo',
      helmet: 'activo',
      cors: isProduction ? 'restringido' : 'permisivo',
      validation: 'activo',
      logging: 'activo'
    },
    features: [
      '✅ Autenticación JWT',
      '✅ Base de datos MySQL',
      '✅ Paginación',
      '✅ Búsqueda de texto',
      '✅ Manejo de imágenes',
      '✅ Carrito de compras',
      '✅ Sistema de reviews y calificaciones',
      '✅ Cupones de descuento',
      '✅ Dashboard de administrador',
      '✅ Lista de deseos (Wishlist)',
      '🔒 Rate Limiting',
      '🔒 Validación de inputs',
      '🔒 Headers de seguridad (Helmet)',
      '🔒 CORS configurado',
      '🔒 Logging seguro'
    ],
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: `http://localhost:${PORT}/api/auth`,
      products: `http://localhost:${PORT}/api/products`,
      orders: `http://localhost:${PORT}/api/orders`,
      cart: `http://localhost:${PORT}/api/cart`,
      reviews: `http://localhost:${PORT}/api/reviews`,
      coupons: `http://localhost:${PORT}/api/coupons`,
      dashboard: `http://localhost:${PORT}/api/dashboard`,
      wishlist: `http://localhost:${PORT}/api/wishlist`
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==================== OPENAPI CONTRACT ENDPOINTS ====================

// Endpoint para descargar el contrato en JSON
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'inline; filename="openapi.json"');
  res.json(swaggerSpec);
});

// Endpoint para descargar el contrato en YAML
app.get('/openapi.yaml', (req, res) => {
  const yaml = require('js-yaml');
  res.setHeader('Content-Type', 'text/yaml');
  res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
  res.send(yaml.dump(swaggerSpec));
});

// Endpoint alternativo (estándar)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// ==================== ERROR HANDLING ====================

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.url} no existe`,
    timestamp: new Date().toISOString()
  });
});

// Logger de errores
app.use(errorLogger);

// Respuestas de error seguras
app.use(safeErrorResponse);

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');
    
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
      console.log(`📄 Contrato OpenAPI: http://localhost:${PORT}/openapi.json`);
      console.log(`📦 Base de datos: ${process.env.DB_NAME}`);
      console.log(`🔒 Modo: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔒 Seguridad Activada:');
      console.log('  ✅ Rate Limiting (previene ataques de fuerza bruta)');
      console.log('  ✅ Helmet (headers de seguridad HTTP)');
      console.log('  ✅ CORS configurado (control de orígenes)');
      console.log('  ✅ Validación de inputs (previene XSS e inyecciones)');
      console.log('  ✅ Logging seguro (sin exponer datos sensibles)');
      console.log('\n🎯 Funcionalidades:');
      console.log('  🛒 Carrito de compras');
      console.log('  ⭐ Sistema de reviews');
      console.log('  🎫 Cupones de descuento');
      console.log('  📊 Dashboard de admin');
      console.log('  ❤️  Lista de deseos');
      console.log('\n🔑 Para empezar:');
      console.log('1. Registra un usuario en /api/auth/register');
      console.log('2. Inicia sesión en /api/auth/login');
      console.log('3. Usa el token en el header: Authorization: Bearer <token>');
      console.log('\n⚠️  Rate Limits:');
      console.log('  - General: 100 requests / 15 min');
      console.log('  - Login: 5 intentos / 15 min');
      console.log('  - Creación: 50 / hora');
      console.log('  - Uploads: 10 / hora');
      console.log('\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;