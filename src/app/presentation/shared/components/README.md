# Skeleton Loading Components

Sistema de componentes de carga skeleton siguiendo arquitectura limpia para StreamFlow Music App.

## 🎯 Arquitectura

```
shared/
├── components/
│   ├── skeleton/
│   │   ├── skeleton.component.ts
│   │   └── skeleton.component.css
│   ├── skeleton-group/
│   │   ├── skeleton-group.component.ts
│   │   └── skeleton-group.component.css
│   └── index.ts
└── services/
    └── skeleton.service.ts
```

## 🚀 Uso Básico

### 1. Skeleton Individual

```typescript
import { SkeletonComponent } from '../shared/components';

// En el template
<app-skeleton 
  type="text" 
  size="medium" 
  width="70%" 
  height="20px">
</app-skeleton>
```

### 2. Skeleton Groups (Recomendado)

```typescript
import { SkeletonGroupComponent, SkeletonService } from '../shared/components';

@Component({
  imports: [SkeletonGroupComponent],
  // ...
})
export class MyComponent {
  private skeletonService = inject(SkeletonService);
  
  // Configuraciones predefinidas
  albumsConfig = this.skeletonService.getPreset('albums');
  artistsConfig = this.skeletonService.getPreset('artists');
  
  // Configuración personalizada
  customConfig = this.skeletonService.createCustomConfig('albums', {
    count: 4,
    size: 'small'
  });
}
```

```html
<!-- En el template -->
<app-skeleton-group 
  *ngIf="isLoading" 
  [config]="albumsConfig">
</app-skeleton-group>
```

## 📦 Tipos de Skeleton

### Skeleton Individual

| Tipo | Descripción | Uso |
|------|-------------|-----|
| `text` | Líneas de texto | Títulos, párrafos |
| `image` | Rectángulos para imágenes | Covers, fotos |
| `avatar` | Círculos para avatares | Fotos de perfil |
| `button` | Botones | Acciones |
| `chip` | Chips/tags | Géneros, etiquetas |
| `card` | Tarjetas completas | Contenido estructurado |

### Skeleton Groups

| Tipo | Descripción | Layout | Elementos |
|------|-------------|--------|-----------|
| `album` | Tarjetas de álbum | Grid | Cover + título + artista + botón |
| `artist` | Tarjetas de artista | Grid | Avatar + nombre + seguidores |
| `song` | Lista de canciones | List | Miniatura + título + artista + duración |
| `genre` | Chips de géneros | Chips | Chips circulares |
| `playlist` | Tarjetas de playlist | Grid | Cover + título + descripción |

## 🎨 Configuración

### Tamaños

- `small`: Elementos compactos
- `medium`: Tamaño estándar (default)
- `large`: Elementos prominentes

### Temas

- `auto`: Se adapta al tema actual (default)
- `light`: Tema claro forzado
- `dark`: Tema oscuro forzado

### Layout

- `grid`: Cuadrícula responsiva
- `list`: Lista vertical
- `chips`: Elementos en línea

## 🔧 Servicio SkeletonService

### Métodos Principales

```typescript
// Configuraciones predefinidas
getPreset(type: 'albums' | 'artists' | 'songs' | 'genres' | 'playlists')

// Configuración personalizada
createCustomConfig(baseType, overrides)

// Configuración responsiva
getResponsiveConfig(type, screenSize: 'mobile' | 'tablet' | 'desktop')

// Estados de carga
getLoadingStateConfig(type, state: 'initial' | 'refresh' | 'pagination')

// Página discover específica
getDiscoverPageConfigs()
```

## 📱 Responsive Design

El sistema se adapta automáticamente:

- **Desktop**: 3-4 elementos por fila
- **Tablet**: 2-3 elementos por fila
- **Mobile**: 1-2 elementos por fila

## 🌙 Soporte de Temas

Detección automática de tema oscuro/claro usando:

```css
:host-context(.dark-theme) {
  --skeleton-base-color: #333;
  --skeleton-highlight-color: #444;
}
```

## 💡 Ejemplos de Implementación

### Página Discover

```typescript
export class DiscoverComponent {
  private skeletonService = inject(SkeletonService);
  
  // Configuraciones para cada sección
  albumsConfig = this.skeletonService.getPreset('albums');
  artistsConfig = this.skeletonService.getPreset('artists');
  genresConfig = this.skeletonService.getPreset('genres');
}
```

```html
<!-- Albums -->
<app-skeleton-group 
  *ngIf="isLoadingAlbums" 
  [config]="albumsConfig">
</app-skeleton-group>

<!-- Artists -->
<app-skeleton-group 
  *ngIf="isLoadingArtists" 
  [config]="artistsConfig">
</app-skeleton-group>

<!-- Genres -->
<app-skeleton-group 
  *ngIf="isLoadingGenres" 
  [config]="genresConfig">
</app-skeleton-group>
```

### Configuración Responsiva

```typescript
// Adaptación automática según el tamaño de pantalla
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth < 1024;

const screenSize = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
const config = this.skeletonService.getResponsiveConfig('albums', screenSize);
```

### Estados de Carga

```typescript
// Carga inicial - mostrar todos los elementos
initialConfig = this.skeletonService.getLoadingStateConfig('albums', 'initial');

// Refresh - mostrar menos elementos
refreshConfig = this.skeletonService.getLoadingStateConfig('albums', 'refresh');

// Paginación - mínimos elementos
paginationConfig = this.skeletonService.getLoadingStateConfig('albums', 'pagination');
```

## 🎯 Beneficios

✅ **Arquitectura Limpia**: Separación clara de responsabilidades
✅ **Reutilizable**: Un sistema para toda la aplicación
✅ **Responsive**: Adaptación automática a diferentes pantallas
✅ **Themeable**: Soporte nativo para temas claros/oscuros
✅ **Performante**: Animaciones CSS optimizadas
✅ **Type-Safe**: TypeScript con interfaces bien definidas
✅ **Mantenible**: Configuraciones centralizadas

## 🔄 Migración desde Skeleton Manual

### Antes (Manual)
```html
<div class="skeleton-albums-grid" *ngIf="isLoading">
  <mat-card *ngFor="let item of [1,2,3,4,5,6]">
    <div class="skeleton-shimmer skeleton-cover"></div>
    <!-- ... más código skeleton manual -->
  </mat-card>
</div>
```

### Después (Sistema)
```html
<app-skeleton-group 
  *ngIf="isLoading" 
  [config]="albumsConfig">
</app-skeleton-group>
```

¡Mucho más limpio y mantenible! 🎉
