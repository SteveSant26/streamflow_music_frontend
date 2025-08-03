# Clean Architecture - Sistema de Idiomas

## 📋 Resumen de la Implementación

Hemos refactorizado el sistema de idiomas para seguir completamente los principios de **Clean Architecture**. Aquí está la estructura implementada:

## 🏗️ Arquitectura por Capas

### 🔵 **Capa de Dominio** (Reglas de Negocio)

```
src/app/domain/
├── repositories/
│   └── i-language.repository.ts          # Interface del repositorio
├── usecases/
│   ├── change-language.usecase.ts         # Caso de uso: Cambiar idioma
│   ├── get-current-language.usecase.ts    # Caso de uso: Obtener idioma actual
│   └── get-available-languages.usecase.ts # Caso de uso: Obtener idiomas disponibles
└── services/
    └── language.service.ts                # Servicio de dominio (Facade)
```

### 🟢 **Capa de Infraestructura** (Detalles de Implementación)

```
src/app/infrastructure/
├── repositories/
│   └── language.repository.ts             # Implementación del repositorio
└── providers/
    ├── language.providers.ts              # Configuración DI para idiomas
    └── translate.providers.ts             # Configuración ngx-translate
```

### 🟡 **Capa de Presentación** (UI Components)

```
src/app/components/
└── aside-menu/
    └── aside-menu.ts                      # Componente que usa LanguageService
```

## 🔄 Flujo de Datos

```
[UI Component]
    ↓ (usa)
[LanguageService]
    ↓ (delega a)
[Use Cases]
    ↓ (usa)
[ILanguageRepository Interface]
    ↓ (implementado por)
[LanguageRepository]
    ↓ (usa)
[TranslateService + localStorage]
```

## 📦 Casos de Uso Implementados

### 1. **ChangeLanguageUseCase**

- **Responsabilidad**: Cambiar el idioma activo
- **Validaciones**: Verifica que el idioma esté soportado
- **Efecto**: Actualiza el idioma en el sistema

### 2. **GetCurrentLanguageUseCase**

- **Responsabilidad**: Obtener el idioma actual
- **Retorna**: String con el código del idioma

### 3. **GetAvailableLanguagesUseCase**

- **Responsabilidad**: Obtener lista de idiomas disponibles
- **Retorna**: Array de códigos de idioma soportados

## 🏛️ Principios de Clean Architecture Aplicados

### ✅ **Dependency Inversion**

- Los casos de uso dependen de la **interface** `ILanguageRepository`
- La implementación concreta se inyecta via DI
- Los componentes UI dependen del `LanguageService`, no de detalles

### ✅ **Single Responsibility**

- Cada caso de uso tiene una responsabilidad específica
- El repositorio solo maneja persistencia
- El service actúa como facade

### ✅ **Separation of Concerns**

- **Dominio**: Reglas de negocio puras
- **Infraestructura**: Detalles técnicos (localStorage, ngx-translate)
- **Presentación**: Lógica de UI

### ✅ **Testability**

- Cada capa puede probarse de forma independiente
- Los casos de uso son fáciles de mockear
- El repositorio puede implementarse diferente para tests

## 🎯 Beneficios Obtenidos

1. **Mantenibilidad**: Código más organizado y fácil de entender
2. **Testabilidad**: Cada componente puede probarse aisladamente
3. **Flexibilidad**: Fácil cambiar implementación sin afectar negocio
4. **Escalabilidad**: Fácil agregar nuevos casos de uso
5. **Reutilización**: Los casos de uso pueden usarse en diferentes contextos

## 📱 Uso en Componentes

```typescript
// En cualquier componente
constructor(private languageService: LanguageService) {}

// Cambiar idioma
changeToSpanish() {
  this.languageService.changeLanguage('es');
}

// Obtener idioma actual
getCurrentLang() {
  return this.languageService.getCurrentLanguage();
}

// Obtener idiomas disponibles
getLanguages() {
  return this.languageService.getAvailableLanguages();
}
```

## 🚀 Características del Sistema

- ✅ **Bilingüe**: Inglés y Español
- ✅ **Persistencia**: localStorage
- ✅ **Reactivo**: Signals para UI reactiva
- ✅ **Detección de idioma**: Detecta idioma del navegador
- ✅ **Fallback**: English por defecto
- ✅ **Validación**: Solo idiomas soportados

---

Esta implementación es un **ejemplo perfecto** de cómo aplicar Clean Architecture en Angular, separando claramente las responsabilidades y manteniendo el código desacoplado y testeable.
