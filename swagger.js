const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce Instrumentos Musicales, Libros y Arte',
      version: '3.0.0',
      description: `
        API RESTful completa para tienda online con:
        - 🔐 Autenticación JWT
        - 🗄️ Base de datos MySQL
        - 📄 Paginación
        - 🔍 Búsqueda de texto
        - 📸 Manejo de imágenes
        - 🛒 Carrito de compras
        - ⭐ Sistema de reviews y calificaciones
        - 🎫 Cupones de descuento
        - 📊 Dashboard de administrador con estadísticas
        - ❤️ Lista de deseos (Wishlist)
      `,
      contact: {
        name: 'Soporte API',
        email: 'soporte@musicartstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido al iniciar sesión'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'category', 'price', 'stock'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del producto'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Guitarra Acústica Yamaha FG800'
            },
            category: {
              type: 'string',
              enum: ['instrumento', 'libro', 'arte'],
              description: 'Categoría del producto'
            },
            subcategory: {
              type: 'string',
              description: 'Subcategoría específica',
              example: 'cuerda'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Precio en USD',
              example: 299.99
            },
            stock: {
              type: 'integer',
              description: 'Cantidad disponible en inventario',
              example: 15
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del producto'
            },
            brand: {
              type: 'string',
              description: 'Marca del producto',
              example: 'Yamaha'
            },
            image: {
              type: 'string',
              description: 'URL de la imagen del producto'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la orden'
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario que realizó la orden'
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Monto total de la orden'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Estado de la orden'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        User: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre completo'
            },
            address: {
              type: 'string',
              description: 'Dirección de envío'
            },
            phone: {
              type: 'string',
              description: 'Teléfono de contacto'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario'
            }
          }
        },
        Review: {
          type: 'object',
          required: ['productId', 'rating'],
          properties: {
            id: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            },
            productId: {
              type: 'integer'
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Calificación de 1 a 5 estrellas'
            },
            title: {
              type: 'string',
              description: 'Título de la review'
            },
            comment: {
              type: 'string',
              description: 'Comentario detallado'
            },
            verified: {
              type: 'boolean',
              description: 'Indica si el usuario compró el producto'
            },
            helpful: {
              type: 'integer',
              description: 'Cantidad de personas que encontraron útil la review'
            }
          }
        },
        Coupon: {
          type: 'object',
          required: ['code', 'discountType', 'discountValue'],
          properties: {
            id: {
              type: 'integer'
            },
            code: {
              type: 'string',
              description: 'Código del cupón (mayúsculas)',
              example: 'VERANO2024'
            },
            description: {
              type: 'string',
              description: 'Descripción del cupón'
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'fixed'],
              description: 'Tipo de descuento'
            },
            discountValue: {
              type: 'number',
              description: 'Valor del descuento (% o monto fijo)'
            },
            minPurchase: {
              type: 'number',
              description: 'Monto mínimo de compra'
            },
            validFrom: {
              type: 'string',
              format: 'date-time'
            },
            validUntil: {
              type: 'string',
              format: 'date-time'
            },
            isActive: {
              type: 'boolean'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para registro, login y gestión de sesión'
      },
      {
        name: 'Productos',
        description: 'CRUD de productos con búsqueda y filtros'
      },
      {
        name: 'Órdenes',
        description: 'Gestión de órdenes de compra'
      },
      {
        name: 'Carrito',
        description: 'Gestión del carrito de compras'
      },
      {
        name: 'Reviews',
        description: 'Sistema de calificaciones y comentarios'
      },
      {
        name: 'Cupones',
        description: 'Gestión de cupones de descuento'
      },
      {
        name: 'Dashboard',
        description: 'Estadísticas y reportes para administradores'
      },
      {
        name: 'Wishlist',
        description: 'Lista de deseos de productos'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;