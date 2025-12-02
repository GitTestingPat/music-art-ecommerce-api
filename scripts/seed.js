require('dotenv').config();
const sequelize = require('../config/database');
const { User, Product, Order, OrderItem } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');
    
    // Sincronizar base de datos (eliminar y recrear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada');
    
    // Crear usuarios
    const adminUser = await User.create({
      email: 'admin@musicart.com',
      password: 'admin123',
      name: 'Administrador',
      address: 'Av. Principal 123, Santiago',
      phone: '+56912345678',
      role: 'admin'
    });
    
    const normalUser = await User.create({
      email: 'usuario@example.com',
      password: 'user123',
      name: 'Juan Pérez',
      address: 'Calle Secundaria 456, Valparaíso',
      phone: '+56987654321',
      role: 'user'
    });
    
    console.log('✅ Usuarios creados');
    
    // Crear productos
    const products = await Product.bulkCreate([
      // Instrumentos Musicales
      {
        name: 'Guitarra Acústica Yamaha FG800',
        category: 'instrumento',
        subcategory: 'cuerda',
        price: 299.99,
        stock: 15,
        description: 'Guitarra acústica de calidad profesional con tapa de abeto sólido y excelente resonancia',
        brand: 'Yamaha',
        image: '/uploads/guitar-yamaha.jpg'
      },
      {
        name: 'Piano Digital Casio CDP-S100',
        category: 'instrumento',
        subcategory: 'teclas',
        price: 449.99,
        stock: 8,
        description: 'Piano digital compacto con 88 teclas pesadas y sonido realista',
        brand: 'Casio',
        image: '/uploads/piano-casio.jpg'
      },
      {
        name: 'Batería Acústica Pearl Export',
        category: 'instrumento',
        subcategory: 'percusión',
        price: 899.99,
        stock: 5,
        description: 'Set completo de batería de 5 piezas con platillos incluidos',
        brand: 'Pearl',
        image: '/uploads/drums-pearl.jpg'
      },
      {
        name: 'Saxofón Alto Yamaha YAS-280',
        category: 'instrumento',
        subcategory: 'viento',
        price: 1299.99,
        stock: 3,
        description: 'Saxofón alto ideal para estudiantes y profesionales, acabado lacado',
        brand: 'Yamaha',
        image: '/uploads/sax-yamaha.jpg'
      },
      {
        name: 'Bajo Eléctrico Fender Precision',
        category: 'instrumento',
        subcategory: 'cuerda',
        price: 799.99,
        stock: 7,
        description: 'Bajo eléctrico de 4 cuerdas con sonido potente y clásico',
        brand: 'Fender',
        image: '/uploads/bass-fender.jpg'
      },
      // Libros
      {
        name: 'Teoría Musical Completa',
        category: 'libro',
        subcategory: 'educación musical',
        price: 34.99,
        stock: 50,
        description: 'Guía completa de teoría musical desde básico hasta avanzado con ejercicios prácticos',
        brand: 'Editorial Música',
        image: '/uploads/book-theory.jpg'
      },
      {
        name: 'Historia del Arte Moderno',
        category: 'libro',
        subcategory: 'arte',
        price: 45.99,
        stock: 30,
        description: 'Análisis detallado del arte moderno del siglo XX con ilustraciones a color',
        brand: 'Editorial Arte',
        image: '/uploads/book-art-history.jpg'
      },
      {
        name: 'Técnicas de Pintura al Óleo',
        category: 'libro',
        subcategory: 'técnicas',
        price: 29.99,
        stock: 40,
        description: 'Manual práctico para dominar la pintura al óleo paso a paso',
        brand: 'Editorial Arte',
        image: '/uploads/book-oil-painting.jpg'
      },
      {
        name: 'Armonía Jazz para Guitarristas',
        category: 'libro',
        subcategory: 'educación musical',
        price: 39.99,
        stock: 25,
        description: 'Guía completa de armonía jazz aplicada a la guitarra',
        brand: 'Editorial Música',
        image: '/uploads/book-jazz.jpg'
      },
      // Arte y Materiales
      {
        name: 'Set de Pinceles Profesionales',
        category: 'arte',
        subcategory: 'pintura',
        price: 59.99,
        stock: 25,
        description: 'Kit de 15 pinceles de diferentes tamaños y formas para todas las técnicas',
        brand: 'Windsor & Newton',
        image: '/uploads/brushes.jpg'
      },
      {
        name: 'Caballete de Estudio Ajustable',
        category: 'arte',
        subcategory: 'equipo',
        price: 89.99,
        stock: 12,
        description: 'Caballete de madera ajustable en altura, resistente y estable',
        brand: 'ArtMaster',
        image: '/uploads/easel.jpg'
      },
      {
        name: 'Acuarelas Winsor & Newton',
        category: 'arte',
        subcategory: 'pintura',
        price: 75.99,
        stock: 20,
        description: 'Set de 24 colores de acuarelas profesionales de alta pigmentación',
        brand: 'Winsor & Newton',
        image: '/uploads/watercolors.jpg'
      },
      {
        name: 'Lienzo Pre-estirado 50x70cm',
        category: 'arte',
        subcategory: 'soportes',
        price: 24.99,
        stock: 35,
        description: 'Lienzo de algodón pre-estirado sobre bastidor de madera',
        brand: 'ArtMaster',
        image: '/uploads/canvas.jpg'
      },
      {
        name: 'Set de Lápices de Dibujo',
        category: 'arte',
        subcategory: 'dibujo',
        price: 19.99,
        stock: 45,
        description: 'Set de 12 lápices de grafito de diferentes durezas (6H a 6B)',
        brand: 'Faber-Castell',
        image: '/uploads/pencils.jpg'
      },
      {
        name: 'Óleos Rembrandt Set 10 Colores',
        category: 'arte',
        subcategory: 'pintura',
        price: 129.99,
        stock: 10,
        description: 'Set profesional de pinturas al óleo con alta concentración de pigmento',
        brand: 'Rembrandt',
        image: '/uploads/oil-paints.jpg'
      }
    ]);
    
    console.log(`✅ ${products.length} productos creados`);
    
    console.log('\n🎉 Seeding completado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ ADMIN:                                  │');
    console.log('│ Email: admin@musicart.com               │');
    console.log('│ Password: admin123                      │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ USUARIO:                                │');
    console.log('│ Email: usuario@example.com              │');
    console.log('│ Password: user123                       │');
    console.log('└─────────────────────────────────────────┘');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

seedDatabase();