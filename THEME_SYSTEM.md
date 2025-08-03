# Sistema de Temas - StreamFlow Music

## ✨ Características

El sistema de temas de StreamFlow Music está implementado siguiendo Clean Architecture y ofrece las siguientes funcionalidades:

### 🎨 Tipos de Tema
- **Claro**: Tema claro con fondo blanco y texto oscuro
- **Oscuro**: Tema oscuro con fondo negro y texto claro  
- **Sistema**: Se adapta automáticamente a la preferencia del sistema operativo

### 🔄 Funcionalidades
- **Detección automática**: Por defecto usa la preferencia del sistema
- **Persistencia**: Guarda la preferencia del usuario en localStorage
- **Cambios dinámicos**: Responde automáticamente a cambios en la preferencia del sistema
- **Transiciones suaves**: Animaciones CSS para cambios de tema
- **Accesibilidad**: Etiquetas ARIA y navegación por teclado

## 🏗️ Arquitectura

### Domain Layer (Dominio)
- **ThemeEntity**: Entidad que representa un tema
- **ThemeRepository**: Repositorio abstracto para manejo de temas
- **Use Cases**: 
  - `GetCurrentThemeUseCase`
  - `SetThemeUseCase`
  - `ToggleThemeUseCase`
  - `GetSystemThemeUseCase`
  - `ResetToSystemThemeUseCase`

### Infrastructure Layer (Infraestructura)
- **LocalStorageThemeRepository**: Implementación que persiste temas en localStorage
- **THEME_PROVIDERS**: Configuración de inyección de dependencias

### Presentation Layer (Presentación)
- **ThemeService**: Servicio que orquesta los casos de uso
- **ThemeToggleComponent**: Componente UI para cambiar temas

## 🚀 Uso

### En Componentes
```typescript
// Inyectar el servicio
constructor(private themeService: ThemeService) {}

// Obtener tema actual
this.themeService.getCurrentTheme().subscribe(theme => {
  console.log('Tema actual:', theme);
});

// Verificar si es modo oscuro
this.themeService.isDarkMode().subscribe(isDark => {
  console.log('Modo oscuro:', isDark);
});

// Cambiar temas
this.themeService.setLightTheme().subscribe();
this.themeService.setDarkTheme().subscribe();
this.themeService.setSystemTheme().subscribe();
this.themeService.toggleTheme().subscribe();
```

### En Templates
```html
<!-- Componente toggle de tema -->
<app-theme-toggle></app-theme-toggle>

<!-- Usar variables CSS de tema -->
<div class="bg-base text-base">
  Contenido que se adapta al tema
</div>
```

### Variables CSS Disponibles
```css
/* Fondos */
--bg-base: Color de fondo principal
--bg-elevated-base: Color de fondo elevado
--bg-elevated-highlight: Color de fondo elevado con hover
--bg-tinted-base: Color de fondo tintado
--bg-subdued: Color de fondo subdued

/* Textos */
--text-base: Color de texto principal
--text-subdued: Color de texto secundario
--text-bright-accent: Color de acento

/* Bordes */
--border-base: Color de borde principal
--border-elevated: Color de borde elevado

/* Sombras */
--shadow-base: Sombra base
--shadow-elevated: Sombra elevada
```

## 🎯 Comportamiento por Defecto

1. **Primera carga**: Detecta automáticamente la preferencia del sistema
2. **Usuario cambia tema**: Guarda la preferencia seleccionada
3. **Cambio del sistema**: Si está en modo "Sistema", se actualiza automáticamente
4. **Reinicio de app**: Carga la preferencia guardada o usa la del sistema

## 🔧 Configuración

Los temas están configurados en `styles.css` con variables CSS que se adaptan automáticamente. Para personalizar:

1. Modificar las variables CSS en `:root` y `body.dark`
2. Agregar nuevas variables siguiendo la convención
3. Usar las clases utilitarias generadas automáticamente

## 📱 Compatibilidad

- ✅ Chrome/Edge (moderno)
- ✅ Firefox (moderno)  
- ✅ Safari (moderno)
- ✅ Dispositivos móviles
- ✅ Lectores de pantalla

## 🚨 Notas Importantes

- El tema se aplica automáticamente al `<body>` y `<html>`
- Las transiciones CSS están optimizadas para rendimiento
- El sistema respeta las preferencias de accesibilidad del usuario
- El localStorage se limpia automáticamente al resetear al tema del sistema
