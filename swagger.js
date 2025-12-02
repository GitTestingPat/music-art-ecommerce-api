const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce Instrumentos Musicales, Libros y Arte',
      version: '2.0.0',
      description: `
        API RESTful completa para tienda online con:
        - 🔐 Autenticación JWT
        - 🗄️ Base de datos MySQL
        - 📄 Paginación
        - 🔍 Búsqueda de texto
        - 📸 Manejo de imágenes
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
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;