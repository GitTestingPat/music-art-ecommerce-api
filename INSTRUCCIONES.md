# 📋 Instrucciones de Implementación - Actualización Completa

## 🎯 Resumen de lo que hay que agregar:

1. **4 nuevos modelos** (Cart, Review, Coupon, Wishlist)
2. **5 nuevas rutas** (cart, reviews, coupons, dashboard, wishlist)
3. **110+ productos** en el seed
4. **5 cupones** de descuento
5. Actualización del servidor y Swagger

---

## 📁 PASO 1: Crear los nuevos modelos

### 1.1 Crear `models/Cart.js`
Copia el contenido del artifact "models/Cart.js" y guárdalo en `models/Cart.js`

### 1.2 Crear `models/Review.js`
Copia el contenido del artifact "models/Review.js" y guárdalo en `models/Review.js`

### 1.3 Crear `models/Coupon.js`
Copia el contenido del artifact "models/Coupon.js" y guárdalo en `models/Coupon.js`

### 1.4 Crear `models/Wishlist.js`
Copia el contenido del artifact "models/Wishlist.js" y guárdalo en `models/Wishlist.js`

### 1.5 Actualizar `models/index.js`
**REEMPLAZA** completamente el contenido de `models/index.js` con el artifact "models/index.js - Relaciones Actualizadas"

---

## 📁 PASO 2: Crear las nuevas rutas

### 2.1 Crear `routes/cart.js`
Copia el contenido del artifact "routes/cart.js" y guárdalo en `routes/cart.js`

### 2.2 Crear `routes/reviews.js`
Copia el contenido del artifact "routes/reviews.js" y guárdalo en `routes/reviews.js`

### 2.3 Crear `routes/coupons.js`
Copia el contenido del artifact "routes/coupons.js" y guárdalo en `routes/coupons.js`

### 2.4 Crear `routes/dashboard.js`
Copia el contenido del artifact "routes/dashboard.js" y guárdalo en `routes/dashboard.js`

### 2.5 Crear `routes/wishlist.js`
Copia el contenido del artifact "routes/wishlist.js" y guárdalo en `routes/wishlist.js`

---

## 📁 PASO 3: Actualizar archivos principales

### 3.1 Actualizar `server.js`
**REEMPLAZA** completamente el contenido de `server.js` con el artifact "server.js - Servidor Actualizado"

### 3.2 Actualizar `swagger.js`
**REEMPLAZA** completamente el contenido de `swagger.js` con el artifact "swagger.js - Swagger Actualizado"

### 3.3 Actualizar `scripts/seed.js`
**REEMPLAZA** completamente el contenido de `scripts/seed.js` con el artifact "scripts/seed.js - Seed Masivo"

---

## 🚀 PASO 4: Ejecutar la actualización

### 4.1 Detener el servidor si está corriendo
```bash
# Presiona Ctrl+C en la terminal donde está corriendo
```

### 4.2 Ejecutar el seed actualizado
```bash
npm run seed
```

**Esto va a:**
- Eliminar todas las tablas existentes
- Crear nuevas tablas con los nuevos modelos
- Poblar con 110+ productos
- Crear 5 cupones
- Crear 3 usuarios

### 4.3 Iniciar el servidor
```bash
npm run dev
```

---

## ✅ PASO 5: Verificar que todo funciona

### 5.1 Abrir Swagger
Ve a: `http://localhost:3000/api-docs`

Deberías ver las nuevas secciones:
- ✅ Carrito
- ✅ Reviews
- ✅ Cupones
- ✅ Dashboard
- ✅ Wishlist

### 5.2 Probar el login
1. En Swagger, ve a `POST /api/auth/login`
2. Usa las credenciales:
```json
{
  "email": "admin@musicart.com",
  "password": "admin123"
}
```
3. Copia el token que recibes

### 5.3 Autorizar en Swagger
1. Haz clic en el botón "Authorize" (candado verde)
2. Escribe: `Bearer TU_TOKEN_AQUI`
3. Haz clic en "Authorize"

### 5.4 Probar nuevas funcionalidades

**Probar Carrito:**
1. `GET /api/cart` - Ver carrito vacío
2. `POST /api/cart/items` - Agregar producto:
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Probar Reviews:**
1. `GET /api/reviews/product/1` - Ver reviews del producto 1
2. `POST /api/reviews` - Crear review:
```json
{
  "productId": 1,
  "rating": 5,
  "title": "Excelente",
  "comment": "Muy buena calidad"
}
```

**Probar Cupones:**
1. `POST /api/coupons/validate` - Validar cupón:
```json
{
  "code": "BIENVENIDA",
  "amount": 100
}
```

**Probar Dashboard (como admin):**
1. `GET /api/dashboard/stats` - Ver estadísticas
2. `GET /api/dashboard/sales?period=month` - Reporte de ventas

**Probar Wishlist:**
1. `GET /api/wishlist` - Ver lista vacía
2. `POST /api/wishlist` - Agregar producto:
```json
{
  "productId": 5,
  "notifyOnDiscount": true
}
```

---

## 🔍 PASO 6: Explorar el catálogo

### Ver productos por categoría:
```bash
# Instrumentos
GET /api/products?category=instrumento&limit=20

# Libros
GET /api/products?category=libro&limit=20

# Arte
GET /api/products?category=arte&limit=20
```

### Buscar productos:
```bash
# Buscar guitarras
GET /api/products?search=guitarra

# Buscar por marca
GET /api/products?search=yamaha

# Buscar libros de filosofía
GET /api/products?search=filosofia&category=libro
```

---

## 📊 Resumen de lo implementado

### ✅ Nuevos Modelos (4)
1. **Cart** - Carrito de compras
2. **Review** - Sistema de reviews
3. **Coupon** - Cupones de descuento
4. **Wishlist** - Lista de deseos

### ✅ Nuevas Rutas (5)
1. **cart.js** - 5 endpoints
2. **reviews.js** - 5 endpoints
3. **coupons.js** - 5 endpoints
4. **dashboard.js** - 4 endpoints
5. **wishlist.js** - 5 endpoints

### ✅ Productos (110+)
- **Instrumentos**: 60+ (cuerdas, viento, teclas, percusión)
- **Libros**: 50+ (música, arte, técnicos, filosofía, ciencia, novelas)
- **Arte**: 30+ (pinturas, pinceles, lienzos, accesorios)

### ✅ Cupones (5)
- BIENVENIDA (10%)
- VERANO2024 (15%)
- ENVIOGRATIS ($10)
- BLACKFRIDAY (30%)
- LIBROS20 (20%)

---

## 🎉 ¡Listo!

Tu API ahora tiene:
- 🛒 Carrito de compras funcional
- ⭐ Sistema de reviews y calificaciones
- 🎫 Cupones de descuento
- 📊 Dashboard de administrador
- ❤️ Lista de deseos
- 📦 110+ productos categorizados
- 🔍 Búsqueda avanzada
- 📄 Paginación completa

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"
**Solución:** Verifica que creaste todos los archivos en las carpetas correctas

### Error: "Column doesn't exist"
**Solución:** Ejecuta `npm run seed` de nuevo para recrear las tablas

### Error: "Token inválido"
**Solución:** Haz login de nuevo y copia el nuevo token

### El servidor no inicia
**Solución:** 
1. Verifica que MySQL esté corriendo
2. Verifica tu archivo `.env`
3. Revisa los logs de error

---

## 📞 Siguiente Nivel

¿Qué más podríamos agregar?
- Integración con Stripe/PayPal
- Notificaciones por email
- Exportar reportes a PDF/Excel
- Sistema de puntos de fidelidad
- Recomendaciones personalizadas
- Chat de soporte

¡Ahora tienes un e-commerce completo y profesional! 🎸🎨📚