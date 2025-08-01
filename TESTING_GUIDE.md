# Guía de Comandos para Pruebas Unitarias

## 🧪 Comandos Básicos de Testing

### Ejecutar todas las pruebas
```bash
npm run test
```

### Ejecutar pruebas con coverage (reporte de cobertura)
```bash
npm run test -- --code-coverage
```

### Ejecutar pruebas en modo watch (se re-ejecutan al hacer cambios)
```bash
npm run test -- --watch
```

### Ejecutar pruebas específicas
```bash
# Ejecutar pruebas de un archivo específico
npm run test -- --include="**/auth.service.spec.ts"

# Ejecutar pruebas que contengan un patrón
npm run test -- --grep="AuthService"
```

### Ejecutar pruebas sin abrir el navegador
```bash
npm run test -- --browsers=ChromeHeadless
```

### Ejecutar una sola vez (sin modo watch)
```bash
npm run test -- --single-run
```

## 📋 Mejores Prácticas

### 1. Estructura de archivos de prueba
- Los archivos de prueba deben tener la extensión `.spec.ts`
- Deben estar al lado del archivo que prueban
- Usar la misma estructura de carpetas

### 2. Nomenclatura de pruebas
```typescript
describe('ComponentName', () => {
  describe('method or feature', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

### 3. Preparación de pruebas (Setup)
```typescript
beforeEach(() => {
  // Se ejecuta antes de cada prueba
});

beforeAll(() => {
  // Se ejecuta una vez antes de todas las pruebas
});

afterEach(() => {
  // Se ejecuta después de cada prueba
});

afterAll(() => {
  // Se ejecuta una vez después de todas las pruebas
});
```

### 4. Tipos de pruebas a implementar

#### Componentes:
- ✅ Creación del componente
- ✅ Renderizado correcto
- ✅ Interacciones del usuario
- ✅ Inputs/Outputs
- ✅ Eventos

#### Servicios:
- ✅ Inyección de dependencias
- ✅ Métodos públicos
- ✅ Llamadas HTTP
- ✅ Manejo de errores
- ✅ Estados internos

#### Guards:
- ✅ Autorización
- ✅ Redirecciones
- ✅ Estados de autenticación

#### Pipes:
- ✅ Transformaciones de datos
- ✅ Casos edge
- ✅ Valores null/undefined

## 🎯 Configuración de Coverage

Para generar reportes de cobertura detallados, agrega esto a tu `angular.json`:

```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "codeCoverage": true,
    "codeCoverageExclude": [
      "src/**/*.spec.ts",
      "src/**/*.mock.ts",
      "src/environments/**"
    ]
  }
}
```

## 🔧 Configuración de Karma (karma.conf.js)

```javascript
module.exports = function (config) {
  config.set({
    // ... otras configuraciones
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    // Configurar thresholds de coverage
    coverageIstanbulReporter: {
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

## 📊 Métricas de Calidad

### Cobertura mínima recomendada:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Archivos prioritarios para testing:
1. 🔥 **Servicios** (especialmente los que manejan datos)
2. 🔥 **Componentes principales** (home, auth, player)
3. 🔥 **Guards** (autenticación, autorización)
4. 🔥 **Utilities y helpers**
5. ⚡ **Pipes personalizados**
6. ⚡ **Interceptors**

## 🚀 Automatización con CI/CD

### GitHub Actions ejemplo:
```yaml
- name: Run tests
  run: npm run test -- --browsers=ChromeHeadless --single-run

- name: Upload coverage
  uses: codecov/codecov-action@v1
  with:
    file: ./coverage/lcov.info
```

## 🐛 Debugging de Pruebas

### Para debuggear en el navegador:
1. Ejecuta `npm run test`
2. Haz clic en "Debug" en la ventana de Karma
3. Abre DevTools y coloca breakpoints

### Para logs detallados:
```typescript
it('should debug test', () => {
  console.log('Debug info:', component);
  expect(component).toBeTruthy();
});
```
