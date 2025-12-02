# 🎸 API E-commerce - Instrumentos Musicales, Libros y Arte

API RESTful completa con autenticación JWT, base de datos MySQL, paginación, búsqueda de texto y manejo de imágenes.

## 🚀 Características

- ✅ **Autenticación JWT**: Sistema seguro de login y registro
- ✅ **Base de datos MySQL**: Persistencia de datos con Sequelize ORM
- ✅ **Paginación**: Navegación eficiente de grandes conjuntos de datos
- ✅ **Búsqueda de texto**: Búsqueda por nombre, descripción y marca
- ✅ **Manejo de imágenes**: Subida y almacenamiento de imágenes de productos
- ✅ **Documentación Swagger**: Interfaz interactiva para probar la API
- ✅ **Control de acceso**: Roles de usuario y admin

## 📋 Requisitos Previos

- Node.js v14 o superior
- MySQL 5.7 o superior
- NPM o Yarn

## 🔧 Instalación

### 1. Clonar o crear el proyecto

```bash
mkdir music-art-ecommerce-api
cd music-art-ecommerce-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar MySQL

Crea una base de datos en MySQL:

```sql
CREATE DATABASE music_art_store;
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=music_art_store
DB_USER=root
DB_PASSWORD=tu_password_aqui
JWT_SECRET=mi_super_secreto_jwt_2024_cambiar_en_produccion
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 5. Crear estructura de carpetas

```bash
mkdir -p config models middleware routes scripts uploads
```

### 6. Poblar la base de datos con datos de prueba

```bash
npm run seed
```

Este comando creará:
- 2 usuarios (1 admin, 1 usuario normal)
- 15 productos de ejemplo

### 7. Iniciar el servidor

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Documentación API

Accede a la documentación interactiva en:
```
http://localhost:3000/api-docs
```

## 🔑 Credenciales de Prueba

**Administrador:**
- Email: `admin@musicart.com`
- Password: `admin123`

**Usuario Normal:**
- Email: `usuario@example.com`
- Password: `user123`

## 🎯 Endpoints Principales

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Productos

- `GET /api/products` - Listar productos (con paginación y búsqueda)
- `GET /api/products/:id` - Obtener un producto
- `POST /api/products` - Crear producto (solo admin)
- `PUT /api/products/:id` - Actualizar producto (solo admin)
- `DELETE /api/products/:id` - Eliminar producto (solo admin)
- `POST /api/products/:id/upload-image` - Subir imagen (solo admin)

### Órdenes

- `GET /api/orders` - Listar órdenes (requiere autenticación)
- `GET /api/orders/:id` - Obtener una orden
- `POST /api/orders` - Crear orden (requiere autenticación)
- `PATCH /api/orders/:id/status` - Actualizar estado (solo admin)
- `DELETE /api/orders/:id` - Cancelar orden

## 🔐 Uso de JWT

1. **Registrarse o iniciar sesión** para obtener un token
2. **Incluir el token** en las peticiones protegidas:

```bash
Authorization: Bearer tu_token_aqui
```

### Ejemplo con cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@musicart.com","password":"admin123"}'

# Usar el token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📄 Paginación

Los endpoints de listado soportan paginación:

```bash
GET /api/products?page=1&limit=10
```

Respuesta:
```json
{
  "products": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔍 Búsqueda de Texto

Buscar productos por nombre, descripción o marca:

```bash
GET /api/products?search=yamaha
GET /api/products?search=guitarra&category=instrumento
GET /api/products?search=pintura&minPrice=20&maxPrice=100
```

## 📸 Subir Imágenes

Para subir una imagen de producto (solo admin):

```bash
curl -X POST http://localhost:3000/api/products/1/upload-image \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "image=@/ruta/a/tu/imagen.jpg"
```

**Formatos soportados:** JPG, JPEG, PNG, GIF, WEBP  
**Tamaño máximo:** 5MB

## 🗂️ Estructura del Proyecto

```
music-art-ecommerce-api/
├── config/
│   └── database.js          # Configuración de MySQL
├── middleware/
│   ├── auth.js              # Middleware de autenticación JWT
│   └── upload.js            # Middleware para subir imágenes
├── models/
│   ├── User.js              # Modelo de Usuario
│   ├── Product.js           # Modelo de Producto
│   ├── Order.js             # Modelo de Orden
│   └── index.js             # Relaciones entre modelos
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── products.js          # Rutas de productos
│   └── orders.js            # Rutas de órdenes
├── scripts/
│   └── seed.js              # Script para poblar BD
├── uploads/                 # Carpeta para imágenes
├── .env                     # Variables de entorno
├── server.js                # Servidor principal
├── swagger.js               # Configuración de Swagger
└── package.json
```

## 🛠️ Comandos Disponibles

```bash
npm start        # Iniciar servidor en producción
npm run dev      # Iniciar con nodemon (desarrollo)
npm run seed     # Poblar base de datos con datos de prueba
```

## 🧪 Ejemplos de Uso

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123",
    "name": "Nuevo Usuario",
    "address": "Calle 123",
    "phone": "+56912345678"
  }'
```

### 2. Buscar productos

```bash
# Buscar "guitarra"
curl "http://localhost:3000/api/products?search=guitarra"

# Instrumentos entre $200 y $500
curl "http://localhost:3000/api/products?category=instrumento&minPrice=200&maxPrice=500"

# Página 2, 5 productos por página
curl "http://localhost:3000/api/products?page=2&limit=5"
```

### 3. Crear una orden

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2},
      {"productId": 3, "quantity": 1}
    ]
  }'
```

## ⚠️ Consideraciones de Seguridad

- ✅ Cambia `JWT_SECRET` en producción
- ✅ Usa HTTPS en producción
- ✅ Configura límites de rate limiting
- ✅ Valida todos los inputs
- ✅ No expongas información sensible en errores

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Licencia

MIT

## 📧 Soporte

Para soporte, envía un email a soporte@musicartstore.com(just kidding!)

---

Desarrollado usando Node.js, Express, MySQL y Swagger