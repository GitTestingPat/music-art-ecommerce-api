const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce Instrumentos Musicales, Libros y Arte',
      version: '3.0.0',
      description: `
API RESTful completa para tienda online desarrollada como proyecto de entrenamiento en Testing y QA.

## Funcionalidades

**Autenticación y Seguridad:**
- Autenticación JWT con tokens de 7 días
- Rate limiting para prevenir ataques
- Validación de inputs
- Encriptación de passwords con bcrypt

**Gestión de Productos:**
- CRUD completo de productos
- Búsqueda y filtrado avanzado
- Paginación de resultados
- Categorías: Instrumentos, Libros, Arte
- Subida de imágenes

**Carrito y Órdenes:**
- Carrito de compras persistente
- Gestión de órdenes
- Validación de stock en tiempo real
- Historial de compras

**Sistema de Reviews:**
- Calificaciones de 1 a 5 estrellas
- Comentarios de usuarios
- Reviews verificadas (solo compradores)
- Sistema de votos útiles

**Cupones de Descuento:**
- Cupones por porcentaje o monto fijo
- Restricciones por categoría
- Límites de uso
- Fechas de validez

**Dashboard Administrativo:**
- Estadísticas de ventas
- Reportes de inventario
- Análisis de clientes
- Productos más vendidos

**Lista de Deseos:**
- Guardar productos favoritos
- Notificaciones de stock y descuentos

---

## 📄 Descargar Contrato OpenAPI

**Archivos disponibles:**

- JSON: [http://localhost:3000/openapi.json](http://localhost:3000/openapi.json)
- YAML: [http://localhost:3000/openapi.yaml](http://localhost:3000/openapi.yaml)

**Importar en Postman:**
\`\`\`
Import → Link → http://localhost:3000/openapi.json
\`\`\`

**Importar en Insomnia:**
\`\`\`
Import → URL → http://localhost:3000/openapi.json
\`\`\`

**Ver en Swagger Editor:**
[Abrir en editor online](https://editor.swagger.io/?url=http://localhost:3000/openapi.json)

---

## 🔐 Autenticación

Esta API usa JWT (JSON Web Tokens). Para acceder a endpoints protegidos:

1. Regístrate en \`POST /api/auth/register\`
2. Inicia sesión en \`POST /api/auth/login\`
3. Copia el token recibido
4. Haz clic en el botón **"Authorize"** arriba
5. Ingresa: \`Bearer TU_TOKEN\`

**Usuarios de prueba:**
- Admin: \`admin@musicart.com\` / \`admin123\`
- Usuario: \`usuario@example.com\` / \`user123\`

---

## 📊 Especificación

- **Versión API:** 3.0.0
- **Especificación:** OpenAPI 3.0.0
- **Servidor:** http://localhost:3000
- **Propósito:** API de entrenamiento para Testing y QA
- **Stack:** Node.js, Express, MySQL, Sequelize, JWT, Swagger
      `,
      contact: {
        name: 'GitHub Repository',
        url: 'https://github.com/tu-usuario/music-art-ecommerce-api'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
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
              example: 'guitarra-acustica'
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