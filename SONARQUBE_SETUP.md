# SonarQube Configuration Guide for StreamFlow Music Frontend

## Prerequisites

1. Node.js y npm instalados ✅
2. SonarCloud account o SonarQube Server
3. SonarQube Scanner (ya instalado vía npm) ✅

## Quick Setup

### 1. Configurar Token de SonarCloud

1. Ve a [SonarCloud](https://sonarcloud.io)
2. Inicia sesión con tu cuenta de GitHub
3. Ve a My Account > Security > Generate Tokens
4. Genera un token con el nombre "StreamFlow Frontend"
5. Copia el token generado

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env y reemplaza YOUR_SONAR_TOKEN con tu token real
# .env
SONAR_TOKEN=tu_token_aqui
SONAR_HOST_URL=https://sonarcloud.io
```

### 3. Ejecutar Análisis

```bash
# Opción 1: Solo tests con cobertura
npm run test:sonar

# Opción 2: Tests + Análisis completo de SonarQube
npm run sonar:analysis

# Opción 3: Solo análisis de SonarQube (sin tests)
npm run sonar
```

## Available Scripts

| Script                   | Descripción                            |
| ------------------------ | -------------------------------------- |
| `npm run test:sonar`     | Ejecuta tests con reporte de cobertura |
| `npm run sonar`          | Ejecuta análisis de SonarQube          |
| `npm run sonar:analysis` | Ejecuta tests + análisis completo      |

## Current Test Coverage Status

- **Total Tests**: 37 specs ✅
- **Test Success Rate**: 100% (0 failures) ✅
- **Code Coverage**: ~40%
  - Statements: 39.93% (125/313)
  - Branches: 21.15% (22/104)
  - Functions: 30.25% (36/119)
  - Lines: 39.6% (120/303)

## SonarQube Quality Gate Requirements

### ✅ Currently Passing:

- Reliability Rating: A (no bugs)
- Security Rating: A (no vulnerabilities)
- Test Success Rate: 100%

### 🎯 To Improve:

1. **Code Coverage** - Target: >80%
   - Current: ~40%
   - Add tests for: `aside-menu`, `connection-test`
2. **Maintainability Rating** - Target: A
   - Fix code smells
   - Reduce technical debt

## Component Test Status

### ✅ Components WITH Tests (15/17 = 88%)

- PlayerVolumeIconComponent
- PlayerSoundControl
- PlayListItemCard
- MusicsTablePlay
- PlayerControlButtonBar
- MusicsTable
- App
- Slider
- PlayerVolumeControl
- Player
- SideMenuItem
- PlayerCurrentSong
- SideMenuCard
- CardPlayButton
- Greeting
- Card

### ❌ Missing Tests (2 components)

- `aside-menu` component
- `connection-test` component

### ✅ Services WITH Tests (2/2 = 100%)

- AuthService
- ApiService

## Troubleshooting

### Error: Token not provided

```bash
# Asegúrate de que el archivo .env existe y contiene tu token
echo "SONAR_TOKEN=tu_token_aqui" > .env
```

### Error: Project not found

- Verifica que el `projectKey` en `sonar.js` coincida con tu proyecto en SonarCloud
- Formato: `{organization}_{repository-name}`

### Coverage not detected

- Ejecuta `npm run test:sonar` antes del análisis
- Verifica que existe `coverage/frontend/lcov.info`

## Configuration Files

- `sonar-project.properties` - Configuración principal
- `sonar.js` - Script de análisis con sonarqube-scanner
- `karma.conf.js` - Configuración de tests con cobertura
- `.env` - Variables de entorno (no commiteado)
- `.env.example` - Plantilla de variables de entorno

## Next Steps for 100% Quality Gate

1. **Crear tests faltantes** para `aside-menu` y `connection-test`
2. **Incrementar cobertura** a >80%
3. **Ejecutar análisis regular** en CI/CD pipeline
4. **Monitorear quality gate** en cada PR
