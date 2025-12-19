# 🔒 Instalación de Medidas de Seguridad

## ⚡ Instalación Rápida

### Paso 1: Instalar dependencias
```bash
npm install express-rate-limit helmet express-validator morgan
```

### Paso 2: Crear archivos de seguridad

Crea estos 4 archivos nuevos:

1. **`middleware/rateLimiter.js`** - Copia del artifact
2. **`middleware/validators.js`** - Copia del artifact  
3. **`config/logger.js`** - Copia del artifact
4. **`config/security.js`** - Copia del artifact

### Paso 3: Actualizar archivos existentes

1. **`server.js`** - REEMPLAZAR con la versión del artifact
2. **`routes/auth.js`** - Agregar los imports y rate limiters según el artifact
3. **`.env`** - Agregar `NODE_ENV=development`

### Paso 4: Crear carpeta de logs
```bash
mkdir logs
```

### Paso 5: Actualizar .gitignore
Agrega al final de `.gitignore`:
```
# Logs
logs/
*.log

# Environment
.env
.env.local
.env.production
```

### Paso 6: Reiniciar servidor
```bash
npm run dev
```

---

## ✅ Verificación

Deberías ver esto en la consola:

```
🔒 Seguridad Activada:
  ✅ Rate Limiting (previene ataques de fuerza bruta)
  ✅ Helmet (headers de seguridad HTTP)
  ✅ CORS configurado (control de orígenes)
  ✅ Validación de inputs (previene XSS e inyecciones)
  ✅ Logging seguro (sin exponer datos sensibles)

⚠️  Rate Limits:
  - General: 100 requests / 15 min
  - Login: 5 intentos / 15 min
  - Creación: 50 / hora
  - Uploads: 10 / hora
```

---

## 🧪 Pruebas de Seguridad

### Test 1: Rate Limiting en Login
```bash
# Hacer 6 intentos de login (debe fallar el 6to)
for i in {1..6}; do
  echo "Intento $i"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 1
done
```

**Resultado esperado:**
- Primeros 5: Status 401 (Unauthorized)
- Sexto: Status 429 (Too Many Requests)

### Test 2: Validación de Password
```bash
# Intentar registrarse con password débil
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"123",
    "name":"Test User"
  }'
```

**Resultado esperado:**
```json
{
  "error": "Errores de validación",
  "details": [
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
```

### Test 3: XSS Prevention
```bash
# Intentar inyectar script en review
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "<script>alert(\"XSS\")</script>"
  }'
```

**Resultado esperado:**
El script debe ser escapado a: `&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;`

### Test 4: Headers de Seguridad
```bash
# Ver headers de seguridad
curl -I http://localhost:3000/
```

**Resultado esperado:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 1; mode=block
```

---

## 🚀 Aplicar a Rutas Específicas

### Rate Limiting en rutas específicas

```javascript
// routes/products.js
const { createLimiter, uploadLimiter } = require('../middleware/rateLimiter');

// Aplicar a creación de productos
router.post('/', authMiddleware, isAdmin, createLimiter, async (req, res) => {
  // ...
});

// Aplicar a upload de imágenes
router.post('/:id/upload-image', authMiddleware, isAdmin, uploadLimiter, upload.single('image'), async (req, res) => {
  // ...
});
```

### Validación en rutas

```javascript
// routes/products.js
const { validateProduct, validateId } = require('../middleware/validators');

// Aplicar validación
router.post('/', authMiddleware, isAdmin, validateProduct, async (req, res) => {
  // ...
});

router.get('/:id', validateId, async (req, res) => {
  // ...
});
```

---

## 🔧 Configuración Avanzada

### Personalizar Rate Limits

Edita `middleware/rateLimiter.js`:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Cambiar de 5 a 10 intentos
  // ...
});
```

### Personalizar Validaciones

Edita `middleware/validators.js`:

```javascript
body('password')
  .isLength({ min: 8 }) // Cambiar de 6 a 8 caracteres
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage('Debe incluir símbolo especial')
```

### Personalizar CORS

Edita `config/security.js`:

```javascript
const whitelist = [
  'http://localhost:3000',
  'https://tu-frontend.com', // Agregar tu dominio
];
```

---

## 📊 Monitoreo de Logs

### Ver logs en tiempo real

```bash
# Access logs
tail -f logs/access.log

# Error logs
tail -f logs/errors.log
```

### Analizar intentos de ataque

```bash
# Buscar múltiples 401
grep "401" logs/access.log | wc -l

# Buscar IPs con rate limit
grep "429" logs/access.log

# Ver errores recientes
tail -n 50 logs/errors.log
```

---

## 🔐 Configuración para Producción

### 1. Actualizar .env
```env
NODE_ENV=production
JWT_SECRET=<generar_nuevo_secreto_fuerte>
```

### 2. Generar JWT Secret seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Actualizar CORS whitelist
En `config/security.js`, agregar dominios de producción:
```javascript
const whitelist = [
  'https://tu-dominio.com',
  'https://www.tu-dominio.com',
  'https://app.tu-dominio.com'
];
```

### 4. Habilitar HTTPS
Usar nginx o similar con certificado SSL (Let's Encrypt gratis)

### 5. Variables de producción
```env
NODE_ENV=production
PORT=3000
DB_HOST=tu-servidor-mysql
DB_NAME=production_db
DB_USER=prod_user
DB_PASSWORD=<password-super-seguro>
JWT_SECRET=<tu-secret-de-64-caracteres>
```

---

## 🆘 Troubleshooting

### "Too Many Requests" en desarrollo

**Problema:** Te bloqueas a ti mismo probando.

**Solución temporal:**
```javascript
// middleware/rateLimiter.js
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Aumentar en desarrollo
  // ...
});
```

### Validación rechaza datos válidos

**Problema:** Las reglas son muy estrictas.

**Solución:** Revisa y ajusta en `middleware/validators.js`

### CORS bloquea tu frontend

**Problema:** Frontend no está en la whitelist.

**Solución:** Agregar a whitelist en `config/security.js`

### Logs no se crean

**Problema:** Carpeta logs no existe.

**Solución:**
```bash
mkdir logs
chmod 755 logs
```

---

## ✅ Checklist Post-Instalación

- [ ] Dependencias instaladas
- [ ] 4 archivos nuevos creados
- [ ] server.js actualizado
- [ ] routes/auth.js actualizado
- [ ] .env actualizado
- [ ] Carpeta logs creada
- [ ] .gitignore actualizado
- [ ] Servidor reiniciado
- [ ] Tests de seguridad pasados
- [ ] Logs funcionando
- [ ] Rate limiting verificado

---

## 📞 Siguiente Paso

Una vez instalado, revisa el archivo **SEGURIDAD.md** para entender en detalle cada medida implementada.

**¿Todo funcionando? ¡Tu API ahora es mucho más segura! 🔒**