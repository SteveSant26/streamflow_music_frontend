import { Injectable } from '@angular/core';
import { SkeletonGroupConfig } from '../components/skeleton-group/skeleton-group.component';

export interface SkeletonPreset {
  albums: SkeletonGroupConfig;
  artists: SkeletonGroupConfig;
  songs: SkeletonGroupConfig;
  genres: SkeletonGroupConfig;
  playlists: SkeletonGroupConfig;
}

@Injectable({
  providedIn: 'root'
})
export class SkeletonService {
  
  /**
   * Configuraciones predefinidas para diferentes tipos de contenido
   */
  private readonly presets: SkeletonPreset = {
    albums: {
      type: 'album',
      count: 6,
      layout: 'grid',
      size: 'medium'
    },
    artists: {
      type: 'artist',
      count: 6,
      layout: 'grid',
      size: 'medium'
    },
    songs: {
      type: 'song',
      count: 8,
      layout: 'list',
      size: 'medium'
    },
    genres: {
      type: 'genre',
      count: 8,
      layout: 'chips',
      size: 'medium'
    },
    playlists: {
      type: 'playlist',
      count: 6,
      layout: 'grid',
      size: 'medium'
    }
  };

  /**
   * Obtiene una configuración predefinida para un tipo específico
   */
  getPreset(type: keyof SkeletonPreset): SkeletonGroupConfig {
    return { ...this.presets[type] };
  }

  /**
   * Crea una configuración personalizada basada en una predefinida
   */
  createCustomConfig(
    baseType: keyof SkeletonPreset, 
    overrides: Partial<SkeletonGroupConfig>
  ): SkeletonGroupConfig {
    const baseConfig = this.getPreset(baseType);
    return { ...baseConfig, ...overrides };
  }

  /**
   * Configuraciones responsivas basadas en el tamaño de pantalla
   */
  getResponsiveConfig(
    type: keyof SkeletonPreset, 
    screenSize: 'mobile' | 'tablet' | 'desktop'
  ): SkeletonGroupConfig {
    const baseConfig = this.getPreset(type);
    
    switch (screenSize) {
      case 'mobile':
        return {
          ...baseConfig,
          count: Math.max(2, Math.floor(baseConfig.count / 2)),
          size: 'small'
        };
      
      case 'tablet':
        return {
          ...baseConfig,
          count: Math.max(3, Math.floor(baseConfig.count * 0.75)),
          size: 'medium'
        };
      
      case 'desktop':
      default:
        return baseConfig;
    }
  }

  /**
   * Configuraciones para páginas específicas de discover
   */
  getDiscoverPageConfigs(): {
    albums: SkeletonGroupConfig;
    artists: SkeletonGroupConfig;
    genres: SkeletonGroupConfig;
  } {
    return {
      albums: this.getPreset('albums'),
      artists: this.getPreset('artists'),
      genres: this.getPreset('genres')
    };
  }

  /**
   * Configuración para diferentes estados de carga
   */
  getLoadingStateConfig(
    type: keyof SkeletonPreset,
    loadingState: 'initial' | 'refresh' | 'pagination'
  ): SkeletonGroupConfig {
    const baseConfig = this.getPreset(type);
    
    switch (loadingState) {
      case 'initial':
        return baseConfig;
      
      case 'refresh':
        return {
          ...baseConfig,
          count: Math.min(baseConfig.count, 4) // Menos elementos en refresh
        };
      
      case 'pagination':
        return {
          ...baseConfig,
          count: Math.min(baseConfig.count, 3) // Aún menos en paginación
        };
      
      default:
        return baseConfig;
    }
  }
}
