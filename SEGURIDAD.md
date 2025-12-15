# 🔒 Documentación de Seguridad

## Resumen Ejecutivo

Este proyecto implementa múltiples capas de seguridad para proteger contra las vulnerabilidades más comunes en APIs RESTful. Todas las medidas están activas por defecto y configuradas según las mejores prácticas de la industria.

---

## 🛡️ Medidas de Seguridad Implementadas

### 1. Rate Limiting (Limitación de Peticiones)

**Propósito:** Prevenir ataques de fuerza bruta, DDoS y abuso de la API.

**Implementación:**
- **General:** 100 requests por 15 minutos por IP
- **Autenticación:** 5 intentos por 15 minutos por IP
- **Creación de contenido:** 50 operaciones por hora
- **Subida de archivos:** 10 uploads por hora

**Archivo:** `middleware/rateLimiter.js`

**Headers de respuesta:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640995200
```

**Respuesta cuando se excede:**
```json
{
  "error": "Demasiadas peticiones desde esta IP",
  "retryAfter": "15 minutos"
}
```

---

### 2. Validación de Inputs

**Propósito:** Prevenir XSS, inyección SQL, y datos maliciosos.

**Implementación:**
- Validación con `express-validator`
- Sanitización automática de HTML
- Normalización de emails
- Validación de tipos de datos
- Límites de longitud en campos de texto
- Escape de caracteres especiales

**Archivo:** `middleware/validators.js`

**Validadores disponibles:**
- `validateRegister` - Registro de usuarios
- `validateLogin` - Inicio de sesión
- `validateProduct` - Productos
- `validateReview` - Reviews
- `validateCoupon` - Cupones
- `validateId` - IDs en parámetros
- `validatePagination` - Paginación
- `validateSearch` - Búsqueda

**Ejemplo de validación:**
```javascript
// Password debe tener:
- Mínimo 6 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
```

---

### 3. Headers de Seguridad (Helmet)

**Propósito:** Proteger contra vulnerabilidades conocidas mediante headers HTTP.

**Archivo:** `config/security.js`

**Headers configurados:**

#### Content Security Policy (CSP)
Previene XSS definiendo fuentes permitidas de contenido.

#### HTTP Strict Transport Security (HSTS)
Fuerza conexiones HTTPS por 1 año.

#### X-Frame-Options
Previene clickjacking bloqueando iframes.

#### X-Content-Type-Options
Previene MIME type sniffing.

#### Referrer-Policy
No envía información del referrer a otros sitios.

#### X-XSS-Protection
Protección adicional contra XSS en navegadores antiguos.

---

### 4. CORS Configurado

**Propósito:** Controlar qué dominios pueden acceder a la API.

**Archivo:** `config/security.js`

**Configuración:**

**Desarrollo:**
```javascript
origin: '*' // Permite todos los orígenes
```

**Producción:**
```javascript
origin: [
  'http://localhost:3000',
  'https://tu-dominio.com'
]
```

**Métodos permitidos:**
- GET, POST, PUT, PATCH, DELETE, OPTIONS

**Headers permitidos:**
- Content-Type
- Authorization
- X-Requested-With
- Accept

**Credenciales:** Habilitadas (cookies, auth headers)

---

### 5. Logging Seguro

**Propósito:** Registrar actividad sin exponer información sensible.

**Archivo:** `config/logger.js`

**Características:**

#### Sanitización automática
Campos sensibles reemplazados con `[REDACTED]`:
- password
- token
- secret
- apiKey
- creditCard
- cvv
- ssn

#### Logs separados
- `logs/access.log` - Peticiones HTTP
- `logs/errors.log` - Errores del servidor

#### Respuestas de error seguras

**Desarrollo:**
```json
{
  "error": "mensaje detallado",
  "stack": ["línea 1", "línea 2"],
  "details": {...}
}
```

**Producción:**
```json
{
  "error": "Error interno del servidor",
  "timestamp": "2024-12-11T...",
  "path": "/api/products"
}
```

---

## 🔐 Autenticación JWT

### Flujo de seguridad:

1. **Registro:** Password hasheado con bcrypt (10 rounds)
2. **Login:** Comparación segura de passwords
3. **Token:** JWT válido por 7 días
4. **Verificación:** Middleware valida token en cada request

### Estructura del token:
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Headers requeridos:
```
Authorization: Bearer <token>
```

---

## 📁 Subida de Archivos

### Validaciones:

1. **Extensión:** Solo .jpg, .jpeg, .png, .gif, .webp
2. **MIME type:** Validado por multer
3. **Tamaño:** Máximo 5MB
4. **Rate limit:** 10 uploads por hora
5. **Autenticación:** Solo usuarios autenticados
6. **Autorización:** Solo admins pueden subir

### Archivo: `middleware/upload.js`

---

## 🚨 Manejo de Errores

### Principios:

1. **Nunca exponer stack traces en producción**
2. **Mensajes genéricos para errores 500**
3. **Logging detallado para debugging**
4. **Códigos HTTP apropiados**

### Códigos comunes:

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (sin token o inválido)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🎯 Mejores Prácticas Implementadas

### ✅ Passwords
- Hasheados con bcrypt
- Nunca almacenados en texto plano
- Nunca retornados en respuestas JSON

### ✅ Tokens JWT
- Firmados con secret fuerte
- Tiempo de expiración definido
- Incluyen solo datos no sensibles

### ✅ Base de Datos
- Sequelize previene inyección SQL
- Prepared statements automáticos
- Validaciones a nivel de modelo

### ✅ Headers HTTP
- Todos los headers de seguridad configurados
- CORS restrictivo en producción
- Content-Type validado

### ✅ Inputs
- Validados antes de procesarse
- Sanitizados para prevenir XSS
- Límites de longitud aplicados

### ✅ Rate Limiting
- Protección contra fuerza bruta
- Límites diferentes por endpoint
- Headers informativos

---

## 🔧 Configuración de Producción

### Variables de entorno críticas:

```env
NODE_ENV=production
JWT_SECRET=<cambiar_por_secret_fuerte>
DB_PASSWORD=<password_seguro>
```

### Checklist de producción:

- [ ] Cambiar `JWT_SECRET` por uno fuerte y único
- [ ] Configurar `NODE_ENV=production`
- [ ] Actualizar lista blanca de CORS
- [ ] Habilitar HTTPS
- [ ] Revisar logs periódicamente
- [ ] Configurar backup de base de datos
- [ ] Monitorear rate limits
- [ ] Implementar alertas de seguridad

---

## 🧪 Testing de Seguridad

### Pruebas recomendadas:

#### 1. Rate Limiting
```bash
# Hacer 6 requests de login rápido
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# El 6to debe fallar con 429
```

#### 2. Validación de inputs
```bash
# Intentar XSS
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"rating":5,"comment":"<script>alert(1)</script>"}'
# Debe sanitizar el script
```

#### 3. CORS
```bash
# Request desde origen no permitido
curl -X GET http://localhost:3000/api/products \
  -H "Origin: https://malicious-site.com"
# Debe fallar en producción
```

#### 4. JWT inválido
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer token_invalido"
# Debe retornar 401
```

---

## 📊 Monitoreo

### Logs a revisar:

1. **access.log** - Patrones de tráfico inusuales
2. **errors.log** - Errores frecuentes o ataques
3. Rate limit hits - IPs que llegan al límite constantemente

### Alertas sugeridas:

- Múltiples 401 desde misma IP (posible ataque)
- Múltiples 429 (abuso de API)
- Errores 500 frecuentes (problemas del servidor)
- Intentos de SQL injection en logs

---

## 🆘 Incidentes de Seguridad

### Qué hacer si detectas un ataque:

1. **Identificar** - Revisar logs para entender el ataque
2. **Bloquear** - Agregar IP a blacklist si es necesario
3. **Parchear** - Corregir vulnerabilidad explotada
4. **Documentar** - Registrar incidente y respuesta
5. **Prevenir** - Actualizar medidas de seguridad

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT.io](https://jwt.io/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)

---

## ✅ Checklist de Seguridad

- [x] Rate limiting implementado
- [x] Validación de inputs
- [x] Headers de seguridad (Helmet)
- [x] CORS configurado
- [x] Logging seguro
- [x] Passwords hasheados
- [x] JWT implementado
- [x] Validación de archivos
- [x] Manejo seguro de errores
- [ ] HTTPS en producción
- [ ] Auditorías de seguridad regulares
- [ ] Monitoring activo
- [ ] Plan de respuesta a incidentes

---

**Última actualización:** Diciembre 2025  
**Nivel de seguridad:** ⭐⭐⭐⭐ (4/5) - Producción ready con HTTPS