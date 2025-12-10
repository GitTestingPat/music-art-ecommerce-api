require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎸 Bienvenido a la API de E-commerce de Instrumentos Musicales, Libros y Arte',
    version: '3.0.0',
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
      '✅ Documentación Swagger completa'
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

// Sincronizar base de datos e iniciar servidor
const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');
    
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
      console.log(`📦 Base de datos: ${process.env.DB_NAME}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🎯 Nuevas Funcionalidades:');
      console.log('  🛒 Carrito de compras');
      console.log('  ⭐ Sistema de reviews');
      console.log('  🎫 Cupones de descuento');
      console.log('  📊 Dashboard de admin');
      console.log('  ❤️  Lista de deseos');
      console.log('\n🔑 Para empezar:');
      console.log('1. Registra un usuario en /api/auth/register');
      console.log('2. Inicia sesión en /api/auth/login');
      console.log('3. Usa el token en el header: Authorization: Bearer <token>');
      console.log('\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;