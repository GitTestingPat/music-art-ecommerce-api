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

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎸 Bienvenido a la API de E-commerce de Instrumentos Musicales, Libros y Arte',
    version: '2.0.0',
    features: [
      '✅ Autenticación JWT',
      '✅ Base de datos MySQL',
      '✅ Paginación',
      '✅ Búsqueda de texto',
      '✅ Manejo de imágenes',
      '✅ Documentación Swagger'
    ],
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: `http://localhost:${PORT}/api/auth`,
      products: `http://localhost:${PORT}/api/products`,
      orders: `http://localhost:${PORT}/api/orders`
    }
  });
});

// Sincronizar base de datos e iniciar servidor
const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    // alter: true actualiza las tablas sin borrar datos
    // force: true ELIMINA y recrea las tablas (usar solo en desarrollo)
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');
    
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
      console.log(`📦 Base de datos: ${process.env.DB_NAME}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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