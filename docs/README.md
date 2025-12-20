# 📄 Contrato de la API - OpenAPI Specification

Este directorio contiene la especificación OpenAPI 3.0 de la API E-commerce.

## 📦 Archivos disponibles

- **`openapi.json`** - Especificación en formato JSON (recomendado para importar)
- **`openapi.yaml`** - Especificación en formato YAML (más legible para humanos)

## 🔄 Actualizar el contrato

Cada vez que hagas cambios en los endpoints de la API, regenera el contrato:
```bash
npm run generate-contract
```

## 📥 Importar en herramientas de testing

### Postman
1. Abre Postman
2. Clic en **Import**
3. Selecciona **Upload Files**
4. Elige `docs/openapi.json`
5. ¡Todos los endpoints se importan automáticamente con ejemplos!

### Insomnia
1. Abre Insomnia
2. Clic en **Create** → **Import from File**
3. Selecciona `docs/openapi.json`
4. Confirma la importación

### Thunder Client (VS Code)
1. Abre Thunder Client en VS Code
2. Clic en **Import**
3. Selecciona **OpenAPI**
4. Elige `docs/openapi.json`

### Swagger Editor (Online)
1. Ve a https://editor.swagger.io/
2. **File** → **Import File**
3. Selecciona `docs/openapi.json` o `docs/openapi.yaml`
4. Visualiza y edita la especificación

## 🧪 Validar el contrato

Para asegurarte de que el contrato es válido según el estándar OpenAPI:
```bash
# Instalar swagger-cli globalmente
npm install -g @apidevtools/swagger-cli

# Validar
swagger-cli validate docs/openapi.json
```

## 📊 Visualización online

Puedes visualizar el contrato en estas herramientas:

- **Swagger Editor**: https://editor.swagger.io/
- **Redoc**: https://redocly.github.io/redoc/
- **Stoplight**: https://stoplight.io/

## 🤖 Generación de código cliente

Con el contrato OpenAPI puedes generar código cliente automáticamente:

### JavaScript/TypeScript
```bash
npx @openapitools/openapi-generator-cli generate \
  -i docs/openapi.json \
  -g typescript-axios \
  -o ./client
```

### Python
```bash
pip install openapi-generator-cli
openapi-generator-cli generate \
  -i docs/openapi.json \
  -g python \
  -o ./client
```

### Java
```bash
openapi-generator-cli generate \
  -i docs/openapi.json \
  -g java \
  -o ./client
```

## 🧪 Testing automatizado

### Newman (CLI de Postman)
```bash
# Instalar Newman
npm install -g newman

# Ejecutar tests
newman run docs/openapi.json
```

### Dredd (Contract Testing)
```bash
# Instalar Dredd
npm install -g dredd

# Ejecutar tests de contrato
dredd docs/openapi.yaml http://localhost:3000
```

## 📚 Especificación

Esta API sigue el estándar **OpenAPI 3.0.0**

- **Documentación oficial**: https://swagger.io/specification/
- **Guía de OpenAPI**: https://oai.github.io/Documentation/

## 🔗 Información de la API

- **Versión API**: 3.0.0
- **Especificación OpenAPI**: 3.0.0
- **Servidor base**: `http://localhost:3000`
- **Autenticación**: Bearer JWT Token

## 📝 Notas

- Los contratos se regeneran automáticamente desde el código fuente
- Se actualizan cada vez que se modifica `swagger.js` o las rutas
- Están versionados en Git para facilitar el tracking de cambios

## 🆘 Soporte

Si tienes problemas importando el contrato en alguna herramienta, abre un issue en GitHub.
