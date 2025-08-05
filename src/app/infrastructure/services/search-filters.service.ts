import { Injectable, signal } from '@angular/core';
import { SongSearchParams } from '@app/domain/dtos/song.dto';

export interface SearchFilter {
  id: string;
  name: string;
  type: 'text' | 'select' | 'range' | 'boolean' | 'date';
  options?: Array<{ value: string | number | boolean; label: string }>;
  value?: any;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterGroup {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  filters: SearchFilter[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchFiltersService {
  private readonly filterGroups = signal<FilterGroup[]>([
    {
      id: 'general',
      name: 'Búsqueda General',
      icon: 'search',
      expanded: true,
      filters: [
        {
          id: 'search',
          name: 'Búsqueda General',
          type: 'text',
          placeholder: 'Buscar en título, artista, álbum...'
        },
        {
          id: 'title',
          name: 'Título',
          type: 'text',
          placeholder: 'Buscar por título específico'
        }
      ]
    },
    {
      id: 'content',
      name: 'Contenido',
      icon: 'library_music',
      expanded: false,
      filters: [
        {
          id: 'artist_name',
          name: 'Artista',
          type: 'text',
          placeholder: 'Nombre del artista'
        },
        {
          id: 'album_title',
          name: 'Álbum',
          type: 'text',
          placeholder: 'Título del álbum'
        },
        {
          id: 'genre_name',
          name: 'Género',
          type: 'text',
          placeholder: 'Género musical'
        }
      ]
    },
    {
      id: 'quality',
      name: 'Calidad y Fuente',
      icon: 'high_quality',
      expanded: false,
      filters: [
        {
          id: 'source_type',
          name: 'Fuente',
          type: 'select',
          options: [
            { value: '', label: 'Todas las fuentes' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'upload', label: 'Subida directa' },
            { value: 'spotify', label: 'Spotify' },
            { value: 'soundcloud', label: 'SoundCloud' }
          ]
        },
        {
          id: 'audio_quality',
          name: 'Calidad de Audio',
          type: 'select',
          options: [
            { value: '', label: 'Cualquier calidad' },
            { value: 'standard', label: 'Estándar (128kbps)' },
            { value: 'high', label: 'Alta (320kbps)' },
            { value: 'lossless', label: 'Sin pérdida (FLAC)' }
          ]
        }
      ]
    },
    {
      id: 'duration',
      name: 'Duración',
      icon: 'schedule',
      expanded: false,
      filters: [
        {
          id: 'duration_range',
          name: 'Rango de Duración',
          type: 'select',
          options: [
            { value: '', label: 'Cualquier duración' },
            { value: 'short', label: 'Corta (< 3 min)' },
            { value: 'medium', label: 'Media (3-6 min)' },
            { value: 'long', label: 'Larga (> 6 min)' }
          ]
        },
        {
          id: 'min_duration',
          name: 'Duración Mínima (segundos)',
          type: 'range',
          min: 0,
          max: 1800,
          placeholder: 'Duración mínima'
        },
        {
          id: 'max_duration',
          name: 'Duración Máxima (segundos)',
          type: 'range',
          min: 0,
          max: 1800,
          placeholder: 'Duración máxima'
        }
      ]
    },
    {
      id: 'popularity',
      name: 'Popularidad',
      icon: 'trending_up',
      expanded: false,
      filters: [
        {
          id: 'min_play_count',
          name: 'Reproducciones Mínimas',
          type: 'range',
          min: 0,
          max: 1000000,
          placeholder: 'Mínimo de reproducciones'
        },
        {
          id: 'popular',
          name: 'Solo Populares',
          type: 'boolean'
        },
        {
          id: 'trending',
          name: 'Solo Tendencias',
          type: 'boolean'
        },
        {
          id: 'recent',
          name: 'Solo Recientes',
          type: 'boolean'
        }
      ]
    },
    {
      id: 'features',
      name: 'Características',
      icon: 'featured_play_list',
      expanded: false,
      filters: [
        {
          id: 'has_lyrics',
          name: 'Con Letras',
          type: 'boolean'
        },
        {
          id: 'has_file_url',
          name: 'Con Audio Disponible',
          type: 'boolean'
        },
        {
          id: 'has_thumbnail',
          name: 'Con Imagen',
          type: 'boolean'
        }
      ]
    },
    {
      id: 'sorting',
      name: 'Ordenamiento',
      icon: 'sort',
      expanded: false,
      filters: [
        {
          id: 'ordering',
          name: 'Ordenar por',
          type: 'select',
          options: [
            { value: '', label: 'Relevancia' },
            { value: 'title', label: 'Título (A-Z)' },
            { value: '-title', label: 'Título (Z-A)' },
            { value: 'artist__name', label: 'Artista (A-Z)' },
            { value: '-artist__name', label: 'Artista (Z-A)' },
            { value: 'album__title', label: 'Álbum (A-Z)' },
            { value: '-album__title', label: 'Álbum (Z-A)' },
            { value: '-play_count', label: 'Más Reproducidas' },
            { value: 'play_count', label: 'Menos Reproducidas' },
            { value: '-created_at', label: 'Más Recientes' },
            { value: 'created_at', label: 'Más Antiguas' },
            { value: 'duration_seconds', label: 'Más Cortas' },
            { value: '-duration_seconds', label: 'Más Largas' },
            { value: '-release_date', label: 'Lanzamiento Reciente' },
            { value: 'release_date', label: 'Lanzamiento Antiguo' }
          ]
        }
      ]
    }
  ]);

  getFilterGroups() {
    return this.filterGroups;
  }

  updateFilter(groupId: string, filterId: string, value: any) {
    const groups = this.filterGroups();
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const filter = group.filters.find(f => f.id === filterId);
      if (filter) {
        filter.value = value;
        this.filterGroups.set([...groups]);
      }
    }
  }

  toggleGroup(groupId: string) {
    const groups = this.filterGroups();
    const group = groups.find(g => g.id === groupId);
    if (group) {
      group.expanded = !group.expanded;
      this.filterGroups.set([...groups]);
    }
  }

  buildSearchParams(): SongSearchParams {
    const groups = this.filterGroups();
    const params: SongSearchParams = {
      include_youtube: true, // Siempre incluir YouTube como solicitado
      page_size: 20 // Tamaño de página por defecto
    };

    groups.forEach(group => {
      group.filters.forEach(filter => {
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          (params as any)[filter.id] = filter.value;
        }
      });
    });

    return params;
  }

  clearAllFilters() {
    const groups = this.filterGroups();
    groups.forEach(group => {
      group.filters.forEach(filter => {
        filter.value = undefined;
      });
    });
    this.filterGroups.set([...groups]);
  }

  hasActiveFilters(): boolean {
    const groups = this.filterGroups();
    return groups.some(group => 
      group.filters.some(filter => 
        filter.value !== undefined && filter.value !== null && filter.value !== ''
      )
    );
  }

  getActiveFiltersCount(): number {
    const groups = this.filterGroups();
    return groups.reduce((count, group) => 
      count + group.filters.filter(filter => 
        filter.value !== undefined && filter.value !== null && filter.value !== ''
      ).length, 0
    );
  }
}
