#!/usr/bin/env node
require('dotenv').config();
const swaggerSpec = require('../swagger');
const fs = require('fs');
const path = require('path');

console.log('🔨 Generando contratos de la API...\n');

// Crear carpeta docs si no existe
const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log('✅ Carpeta docs/ creada');
}

// Generar JSON
const jsonPath = path.join(docsDir, 'openapi.json');
fs.writeFileSync(
  jsonPath,
  JSON.stringify(swaggerSpec, null, 2)
);
console.log('✅ Contrato JSON generado: docs/openapi.json');

// Generar YAML
try {
  const yaml = require('js-yaml');
  const yamlPath = path.join(docsDir, 'openapi.yaml');
  fs.writeFileSync(
    yamlPath,
    yaml.dump(swaggerSpec, { indent: 2, lineWidth: -1 })
  );
  console.log('✅ Contrato YAML generado: docs/openapi.yaml');
} catch (error) {
  console.log('⚠️  Error al generar YAML:', error.message);
}

// Mostrar información
const stats = fs.statSync(jsonPath);
console.log('\n📊 Estadísticas:');
console.log(`   Tamaño JSON: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`   Endpoints: ${Object.keys(swaggerSpec.paths || {}).length}`);

console.log('\n📄 Contratos generados exitosamente!');
console.log('\n📌 Puedes importarlos en:');
console.log('   • Postman');
console.log('   • Insomnia');
console.log('   • Swagger Editor (https://editor.swagger.io/)');
console.log('   • Herramientas de testing automatizado');
console.log('\n💡 Visualiza el contrato online:');
console.log('   https://editor.swagger.io/');

