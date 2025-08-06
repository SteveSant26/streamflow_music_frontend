# Playlist Feature - Clean Architecture Implementation

Esta implementación completa del sistema de playlists sigue los principios de Clean Architecture, proporcionando una base sólida, escalable y mantenible para la gestión de playlists en la aplicación StreamFlow Music.

## 📁 Estructura de Archivos

```
src/app/
├── domain/
│   ├── entities/
│   │   └── playlist.entity.ts          # Entidades de negocio
│   ├── dtos/
│   │   └── playlist.dto.ts             # DTOs para transferencia de datos
│   ├── mappers/
│   │   └── playlist.mapper.ts          # Mappers y validaciones
│   ├── repositories/
│   │   └── i-playlist.repository.ts    # Interfaz del repositorio
│   ├── services/
│   │   ├── playlist-state.service.ts   # Gestión de estado con signals
│   │   └── playlist-facade.service.ts  # Facade pattern para simplificar uso
│   └── usecases/
│       └── playlist/
│           └── playlist.usecases.ts    # Casos de uso de negocio
├── infrastructure/
│   ├── repositories/
│   │   └── playlist.repository.impl.ts # Implementación del repositorio
│   ├── services/
│   │   └── playlist-http.service.ts    # Servicio HTTP
│   ├── providers/
│   │   └── playlist.providers.ts       # Providers de DI
│   └── tokens/
│       └── playlist.tokens.ts          # Tokens de inyección
├── presentation/
│   ├── components/
│   │   └── playlist/
│   │       ├── playlist-card.component.ts
│   │       ├── playlist-list.component.ts
│   │       ├── playlist-form.component.ts
│   │       └── index.ts
│   └── pages/
│       └── playlist/
│           └── playlist-page.component.ts
└── config/
    └── end-points/
        └── api-config-playlists.ts     # Configuración de endpoints
```

## 🏗️ Arquitectura

### Domain Layer (Capa de Dominio)
- **Entities**: Modelos de datos puros que representan las entidades de negocio
- **DTOs**: Objetos de transferencia de datos para comunicación con APIs
- **Mappers**: Lógica de conversión entre DTOs y entidades, incluyendo validaciones
- **Repositories**: Interfaces que definen contratos para acceso a datos
- **Use Cases**: Lógica de negocio específica para cada operación
- **Services**: Servicios de dominio para gestión de estado y operaciones complejas

### Infrastructure Layer (Capa de Infraestructura)
- **Repositories**: Implementaciones concretas de los repositorios
- **Services**: Servicios HTTP y comunicación con APIs externas
- **Providers**: Configuración de inyección de dependencias
- **Tokens**: Tokens para inyección de dependencias

### Presentation Layer (Capa de Presentación)
- **Components**: Componentes reutilizables de UI
- **Pages**: Páginas completas que orquestan múltiples componentes
- **Routes**: Configuración de rutas (no implementado en este ejemplo)

## 🚀 Características Principales

### ✅ Gestión Completa de Playlists
- **CRUD completo**: Crear, leer, actualizar y eliminar playlists
- **Gestión de canciones**: Agregar y remover canciones de playlists
- **Paginación**: Soporte completo para paginación de resultados
- **Filtros y búsqueda**: Búsqueda avanzada con múltiples filtros
- **Validaciones**: Validación robusta de datos en múltiples capas

### ✅ Estado Reactivo con Signals
- **Angular Signals**: Uso de la nueva API de signals para gestión de estado
- **Estado computado**: Propiedades derivadas que se actualizan automáticamente
- **Eventos de dominio**: Sistema de eventos para comunicación entre componentes

### ✅ Patrones de Diseño
- **Repository Pattern**: Abstracción del acceso a datos
- **Facade Pattern**: Interfaz simplificada para operaciones complejas
- **Use Case Pattern**: Encapsulación de lógica de negocio
- **Mapper Pattern**: Conversión limpia entre capas
- **Observer Pattern**: Eventos de dominio reactivos

### ✅ Compatibilidad y Extensibilidad
- **Legacy Support**: Soporte para componentes existentes mediante LegacyPlaylist
- **Configuración flexible**: Sistema de configuración mediante tokens DI
- **Testing Ready**: Estructura preparada para pruebas unitarias
- **TypeScript**: Fuertemente tipado para mejor DX

## 📊 API Integration

La implementación está completamente alineada con la API OpenAPI proporcionada:

### Endpoints Implementados
- `GET /api/playlists/playlist/` - Obtener playlists con filtros
- `POST /api/playlists/playlist/` - Crear nueva playlist
- `GET /api/playlists/playlist/{id}/` - Obtener playlist específica
- `PUT /api/playlists/playlist/{id}/` - Actualizar playlist
- `DELETE /api/playlists/playlist/{id}/` - Eliminar playlist
- `GET /api/playlists/playlists/{id}/songs/` - Obtener canciones de playlist
- `POST /api/playlists/playlists/{id}/songs/` - Agregar canción a playlist
- `DELETE /api/playlists/playlists/{id}/songs/{songId}/` - Remover canción

### Filtros Soportados
- Búsqueda por nombre y descripción
- Filtro por visibilidad (público/privado)
- Filtro por usuario
- Filtro por número de canciones
- Filtro por fechas de creación/actualización
- Ordenamiento personalizable
- Paginación

## 🎯 Casos de Uso Implementados

### Operaciones Básicas
- `GetPlaylistsUseCase` - Obtener lista de playlists con filtros
- `GetUserPlaylistsUseCase` - Obtener playlists del usuario
- `GetPlaylistByIdUseCase` - Obtener playlist específica
- `CreatePlaylistUseCase` - Crear nueva playlist
- `UpdatePlaylistUseCase` - Actualizar playlist existente
- `DeletePlaylistUseCase` - Eliminar playlist

### Operaciones con Canciones
- `GetPlaylistSongsUseCase` - Obtener canciones de una playlist
- `AddSongToPlaylistUseCase` - Agregar canción a playlist
- `RemoveSongFromPlaylistUseCase` - Remover canción de playlist

### Operaciones Avanzadas
- `SearchPlaylistsUseCase` - Búsqueda avanzada de playlists
- `GetPublicPlaylistsUseCase` - Obtener playlists públicas
- `DuplicatePlaylistUseCase` - Duplicar playlist existente

## 🔧 Configuración y Uso

### 1. Registrar Providers
```typescript
// En tu app.config.ts o module
import { playlistProviders } from './infrastructure/providers/playlist.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...playlistProviders,
    // otros providers
  ]
};
```

### 2. Usar el Facade Service
```typescript
// En tu componente
export class MyComponent {
  private readonly playlistFacade = inject(PlaylistFacadeService);

  async loadPlaylists() {
    await this.playlistFacade.loadUserPlaylists();
  }

  async createPlaylist(data: CreatePlaylistDto) {
    const result = await this.playlistFacade.createPlaylist(data);
    if (result) {
      console.log('Playlist creada:', result);
    }
  }
}
```

### 3. Usar los Componentes
```html
<!-- Lista de playlists -->
<app-playlist-list
  [playlists]="playlists()"
  [showControls]="true"
  (playlistSelected)="onPlaylistSelected($event)"
  (createPlaylist)="onCreatePlaylist()"
/>

<!-- Formulario de playlist -->
<app-playlist-form
  [playlist]="selectedPlaylist()"
  [isVisible]="showForm()"
  (playlistSaved)="onPlaylistSaved($event)"
  (formCancelled)="onFormCancelled()"
/>
```

## 🧪 Testing

La arquitectura está diseñada para facilitar las pruebas:

```typescript
// Ejemplo de test
describe('PlaylistFacadeService', () => {
  let service: PlaylistFacadeService;
  let mockRepository: jasmine.SpyObj<IPlaylistRepository>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...mockPlaylistProviders,
        // configuración de test
      ]
    });
  });
});
```

## 🔄 Flujo de Datos

1. **Presentación** → **Facade** → **Use Case** → **Repository** → **HTTP Service** → **API**
2. **API** → **HTTP Service** → **Repository** → **Mapper** → **Use Case** → **Facade** → **State** → **Presentación**

## 📈 Beneficios de esta Implementación

### ✅ Mantenibilidad
- Separación clara de responsabilidades
- Código organizado y predecible
- Fácil localización y corrección de bugs

### ✅ Escalabilidad
- Arquitectura modular que permite agregar funcionalidades fácilmente
- Patrones de diseño que facilitan la extensión
- Estado reactivo que maneja complejidad creciente

### ✅ Testabilidad
- Interfaces bien definidas para mocking
- Lógica de negocio aislada
- Componentes de UI desacoplados

### ✅ Reutilización
- Componentes altamente reutilizables
- Servicios independientes del contexto
- Casos de uso composables

### ✅ Developer Experience
- IntelliSense completo con TypeScript
- APIs consistentes y predecibles
- Documentación integrada en el código

## 🚀 Próximos Pasos

1. **Integrar con el reproductor**: Conectar las playlists con el sistema de reproducción existente
2. **Agregar cache**: Implementar cache local para mejor performance
3. **Offline support**: Añadir soporte para funcionamiento offline
4. **Drag & Drop**: Implementar reordenamiento de canciones
5. **Compartir playlists**: Funcionalidad para compartir playlists
6. **Estadísticas**: Dashboard con métricas de uso de playlists

## 📚 Recursos Adicionales

- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Facade Pattern](https://refactoring.guru/design-patterns/facade)

---

Esta implementación proporciona una base sólida y extensible para el sistema de playlists, siguiendo las mejores prácticas de Clean Architecture y aprovechando las características modernas de Angular.
