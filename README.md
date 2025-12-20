# 🎸 API E-commerce - Instrumentos Musicales, Libros y Arte

API RESTful completa desarrollada específicamente para **entrenamiento en Testing y QA**. Este proyecto está diseñado para ser probado, analizado, explorado y experimentado por profesionales de testing, estudiantes y desarrolladores que deseen practicar técnicas de pruebas de software.

## 🤖 Desarrollo Asistido por IA

Este proyecto fue desarrollado utilizando Claude (Anthropic) como herramienta de asistencia en la programación. La arquitectura, lógica de negocio y estructura fueron diseñadas mediante prompts iterativos, demostrando cómo la IA generativa puede acelerar el desarrollo de APIs complejas mientras se mantienen estándares profesionales de código y documentación.

## 🚀 Características Completas

### ✅ Funcionalidades Core
- **Autenticación JWT**: Sistema seguro de login y registro
- **Base de datos MySQL**: Persistencia de datos con Sequelize ORM
- **Paginación**: Navegación eficiente de grandes conjuntos de datos
- **Búsqueda de texto**: Búsqueda avanzada por nombre, descripción y marca
- **Manejo de imágenes**: Subida y almacenamiento de imágenes de productos

### 🛒 Sistema de Carrito de Compras
- Agregar/quitar productos
- Actualizar cantidades
- Validación de stock en tiempo real
- Cálculo automático de totales
- Persistencia entre sesiones

### ⭐ Sistema de Reviews y Calificaciones
- Calificaciones de 1 a 5 estrellas
- Comentarios detallados
- Reviews verificadas (solo compradores)
- Estadísticas por producto
- Marcar reviews como útiles

### 🎫 Sistema de Cupones de Descuento
- Cupones de porcentaje y monto fijo
- Restricciones por categoría
- Límites de uso total y por usuario
- Compra mínima requerida
- Fechas de validez

### 📊 Dashboard de Administrador
- Estadísticas generales del negocio
- Reportes de ventas por período
- Inventario y stock bajo
- Análisis de clientes
- Productos más vendidos
- Ventas por categoría

### ❤️ Lista de Deseos (Wishlist)
- Guardar productos favoritos
- Notificaciones de stock
- Notificaciones de descuentos

## 📦 Catálogo de Productos

### 🎸 Instrumentos Musicales (60+ productos)
- **Cuerdas**: Guitarras acústicas, eléctricas, bajos, violines, violonchelos, ukeleles, banjos, mandolinas
- **Viento**: Saxofones, trompetas, trombones, flautas, clarinetes, oboes, armónicas, acordeones, gaitas
- **Teclas**: Pianos digitales, teclados, sintetizadores, órganos, controladores MIDI
- **Percusión**: Baterías acústicas, electrónicas, cajones, congas, bongos, timbales, djembes, xilófonos, marimbas, platillos

### 📚 Libros (50+ títulos)
- **Música**: Teoría musical, métodos instrumentales, historia de la música, biografías, producción audio
- **Arte**: Historia del arte, técnicas de pintura, dibujo, escultura, arte contemporáneo
- **Técnicos**: Programación, algoritmos, redes, machine learning, ciberseguridad
- **Filosofía**: Clásica, moderna, existencialismo, historia de la filosofía
- **Ciencia**: Física, biología, astronomía, química, neurociencia
- **Novelas**: Clásicas, fantasía, ciencia ficción, thriller, románticas, latinoamericanas

### 🎨 Materiales de Arte (30+ productos)
- **Pinturas**: Óleos, acrílicos, acuarelas, pasteles
- **Herramientas**: Pinceles, espátulas, paletas, caballetes
- **Soportes**: Lienzos, papeles especializados
- **Accesorios**: Lápices, carboncillos, rotuladores, gomas, barnices, médiums

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
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
Crea un archivo `.env` en la raíz:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=music_art_store
DB_USER=root
DB_PASSWORD=tu_password_mysql
JWT_SECRET=mi_super_secreto_jwt_2024_cambiar_en_produccion
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 5. Crear archivos de modelos
Asegúrate de tener todos estos archivos en la carpeta `models/`:
- `User.js`
- `Product.js`
- `Order.js`
- `Cart.js`
- `Review.js`
- `Coupon.js`
- `Wishlist.js`
- `index.js`

### 6. Poblar la base de datos
```bash
npm run seed
```

Esto creará:
- 3 usuarios (1 admin, 2 usuarios normales)
- 110+ productos en todas las categorías
- 5 cupones de descuento

### 7. Iniciar el servidor
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Documentación API

Accede a la documentación interactiva Swagger en:
```
http://localhost:3000/api-docs
```

## 📄 Contrato de la API (OpenAPI)

La especificación completa de la API está disponible en formato OpenAPI 3.0:

- **JSON:** [`docs/openapi.json`](docs/openapi.json)
- **YAML:** [`docs/openapi.yaml`](docs/openapi.yaml)
- **Documentación:** [`docs/README.md`](docs/README.md)

### 📥 Importar en herramientas de testing:

**Postman:**
1. Import → Upload Files → Selecciona `docs/openapi.json`

**Insomnia:**
1. Create → Import from File → Selecciona `docs/openapi.json`

**Swagger Editor:**
1. Abre https://editor.swagger.io/
2. File → Import File → Selecciona `docs/openapi.json`

### 🔄 Regenerar contrato:
```bash
npm run generate-contract
```

## 🔑 Credenciales de Prueba

**Administrador:**
- Email: `admin@musicart.com`
- Password: `admin123`

**Usuario Normal:**
- Email: `usuario@example.com`
- Password: `user123`

## 🎫 Cupones Disponibles

- `BIENVENIDA` - 10% de descuento (máx $20)
- `VERANO2024` - 15% de descuento (máx $50)
- `ENVIOGRATIS` - $10 de descuento
- `BLACKFRIDAY` - 30% en instrumentos y arte (máx $100)
- `LIBROS20` - 20% en libros (máx $30)

## 🎯 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual

### Productos
- `GET /api/products` - Listar productos (paginación + búsqueda)
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)
- `POST /api/products/:id/upload-image` - Subir imagen (admin)

### Carrito
- `GET /api/cart` - Ver carrito
- `POST /api/cart/items` - Agregar al carrito
- `PUT /api/cart/items/:id` - Actualizar cantidad
- `DELETE /api/cart/items/:id` - Eliminar del carrito
- `DELETE /api/cart/clear` - Vaciar carrito

### Órdenes
- `GET /api/orders` - Listar órdenes
- `GET /api/orders/:id` - Ver orden
- `POST /api/orders` - Crear orden
- `PATCH /api/orders/:id/status` - Actualizar estado (admin)
- `DELETE /api/orders/:id` - Cancelar orden

### Reviews
- `GET /api/reviews/product/:id` - Reviews de un producto
- `POST /api/reviews` - Crear review
- `PUT /api/reviews/:id` - Actualizar review
- `DELETE /api/reviews/:id` - Eliminar review
- `POST /api/reviews/:id/helpful` - Marcar como útil

### Cupones
- `GET /api/coupons` - Listar cupones (admin)
- `POST /api/coupons/validate` - Validar cupón
- `POST /api/coupons` - Crear cupón (admin)
- `PUT /api/coupons/:id` - Actualizar cupón (admin)
- `DELETE /api/coupons/:id` - Eliminar cupón (admin)

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/sales` - Reporte de ventas
- `GET /api/dashboard/inventory` - Reporte de inventario
- `GET /api/dashboard/customers` - Reporte de clientes

### Wishlist
- `GET /api/wishlist` - Ver wishlist
- `POST /api/wishlist` - Agregar a wishlist
- `DELETE /api/wishlist/:id` - Eliminar de wishlist
- `PATCH /api/wishlist/:id/notifications` - Actualizar notificaciones
- `DELETE /api/wishlist/clear/all` - Vaciar wishlist

## 🔐 Uso de JWT

1. Registrarse o iniciar sesión para obtener un token
2. Incluir el token en las peticiones protegidas:
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
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📄 Paginación

Todos los endpoints de listado soportan paginación:
```bash
GET /api/products?page=1&limit=20
```

Respuesta:
```json
{
  "products": [...],
  "pagination": {
    "total": 110,
    "page": 1,
    "limit": 20,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔍 Búsqueda de Texto

Búsqueda avanzada en productos:
```bash
# Buscar "guitarra"
GET /api/products?search=guitarra

# Buscar en categoría específica
GET /api/products?search=yamaha&category=instrumento

# Buscar con rango de precio
GET /api/products?search=pintura&minPrice=20&maxPrice=100

# Combinar todo
GET /api/products?search=piano&category=instrumento&minPrice=400&maxPrice=800&page=1&limit=10
```

## 📸 Subir Imágenes

Para subir una imagen de producto (solo admin):

**Usando Postman:**
1. POST a `/api/products/:id/upload-image`
2. Authorization: Bearer token
3. Body: form-data
4. Key: `image` (tipo: File)
5. Value: selecciona tu archivo

**Usando cURL:**
```bash
curl -X POST http://localhost:3000/api/products/1/upload-image \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "image=@/ruta/a/imagen.jpg"
```

**Formatos soportados:** JPG, JPEG, PNG, GIF, WEBP  
**Tamaño máximo:** 5MB

## 🛒 Flujo Completo de Compra

1. **Navegar productos**
```bash
GET /api/products?category=instrumento&page=1&limit=10
```

2. **Agregar al carrito**
```bash
POST /api/cart/items
{
  "productId": 1,
  "quantity": 2
}
```

3. **Ver carrito**
```bash
GET /api/cart
```

4. **Aplicar cupón (validar)**
```bash
POST /api/coupons/validate
{
  "code": "BIENVENIDA",
  "amount": 100,
  "categories": ["instrumento"]
}
```

5. **Crear orden**
```bash
POST /api/orders
{
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 5, "quantity": 1}
  ]
}
```

6. **Dejar review**
```bash
POST /api/reviews
{
  "productId": 1,
  "rating": 5,
  "title": "Excelente guitarra",
  "comment": "Sonido increíble y muy buena construcción"
}
```

## 🗂️ Estructura del Proyecto

```
music-art-ecommerce-api/
├── config/
│   └── database.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Review.js
│   ├── Coupon.js
│   ├── Wishlist.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── cart.js
│   ├── reviews.js
│   ├── coupons.js
│   ├── dashboard.js
│   └── wishlist.js
├── scripts/
│   └── seed.js
├── uploads/
├── .env
├── server.js
├── swagger.js
├── package.json
└── README.md
```

## 🛠️ Comandos Disponibles

```bash
npm start        # Iniciar en producción
npm run dev      # Iniciar con nodemon (desarrollo)
npm run seed     # Poblar base de datos
```

## 📊 Estadísticas del Catálogo

- **Total de productos**: 110+
- **Categorías principales**: 3 (Instrumentos, Libros, Arte)
- **Subcategorías**: 50+
- **Marcas**: 40+

## 🔒 Seguridad

- ✅ Passwords encriptados con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de datos con Sequelize
- ✅ Control de acceso por roles
- ✅ Protección contra inyección SQL
- ✅ Sanitización de inputs

## 📝 Licencia

MIT License - Este proyecto está disponible como código abierto bajo la licencia MIT, permitiendo su uso, modificación y distribución libre.

## 📧 Contacto

**Nota:** El correo de soporte listado en este proyecto (soporte@musicartstore.com) es ficticio y se utiliza únicamente con fines demostrativos. Para consultas reales sobre este proyecto, por favor utiliza el sistema de issues de GitHub.

---

**Stack Tecnológico:** Node.js | Express | MySQL | Sequelize ORM | JWT | Swagger/OpenAPI | Multer

**Propósito:** API de entrenamiento para Testing y QA

**Año:** 2025