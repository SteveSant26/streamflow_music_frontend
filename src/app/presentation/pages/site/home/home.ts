import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Card, Greeting } from '@app/presentation/components/ui';
import { PlayListItemCard, MusicsTable } from '@app/presentation/components/music';
import { MusicSectionButton } from '@app/presentation/components/music-section/music-section';
import { ViewModeService } from '@app/presentation/shared/services/view-mode.service';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_SITE, ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';
import { 
  GetMostPopularSongsUseCase, 
  GetRandomSongsUseCase,
  PlaySongUseCase
} from '../../../../domain/usecases/song/song.usecases';
import { Song } from '../../../../domain/entities/song.entity';
import { Playlist } from '../../../../domain/entities/playlist.entity';
import { UnifiedPlaylistService } from '../../../../infrastructure/services/unified-playlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Card,
    Greeting,
    PlayListItemCard,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MusicsTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  // Servicios inyectados
  private readonly getMostPopularUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  private readonly unifiedPlaylistService = inject(UnifiedPlaylistService);
  readonly viewModeService = inject(ViewModeService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Route configs
  protected readonly ROUTES_CONFIG_SITE = ROUTES_CONFIG_SITE;
  protected readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;

  // Signals para el estado del componente
  readonly popularSongs = signal<Song[]>([]);
  readonly randomSongs = signal<Song[]>([]);
  readonly featuredPlaylists = signal<Playlist[]>([]);
  readonly loading = signal(true);
  readonly playlistsLoading = signal(true);

  // Signal computed para el tipo de vista
  readonly currentViewType = computed(() => {
    const currentMode = this.viewModeService.viewMode();
    const resultType = currentMode === 'list' ? 'grid' : 'table';
    console.log('🎯 COMPUTED currentViewType: viewMode =', currentMode, '→ resultType =', resultType);
    console.log('🎯 COMPUTED Should show:', resultType === 'grid' ? 'GRID/CARDS' : 'TABLE');
    return resultType;
  });

  // Datos mock para las playlists (mantenemos algunos como ejemplo - DEPRECATED, usar featuredPlaylists signal)
  mockPlaylistsData = [
    {
      id: 1,
      title: 'Hits del Rock',
      cover: '/assets/playlists/playlist1.jpg',
      artists: ['Queen', 'Led Zeppelin', 'The Beatles'],
      action: () => this.loadMostPopularSongs()
    },
    {
      id: 2,
      title: 'Mix Aleatorio',
      cover: '/assets/playlists/playlist2.webp',
      artists: ['Varios Artistas'],
      action: () => this.loadRandomSongs()
    },
    {
      id: 3,
      title: 'Descubrimientos',
      cover: '/assets/playlists/playlist3.jpg',
      artists: ['Nuevos Artistas'],
      action: () => this.loadRandomSongs()
    },
    {
      id: 4,
      title: 'Tendencias',
      cover: '/assets/playlists/playlist4.jpg',
      artists: ['Top Charts'],
      action: () => this.loadMostPopularSongs()
    },
  ];

  ngOnInit(): void {
    this.loadHomeData();
    this.loadFeaturedPlaylists();
    
    // Effect para debuggear cambios de view mode
    effect(() => {
      const currentMode = this.viewModeService.viewMode();
      console.log('🏠 Home Effect: View mode changed to:', currentMode);
      console.log('🏠 Home Effect: Should show', currentMode === 'list' ? 'GRID/CARDS' : 'TABLE');
    });
  }

  loadFeaturedPlaylists(): void {
    this.playlistsLoading.set(true);
    this.unifiedPlaylistService.getPublicPlaylists(1, 4).subscribe({
      next: (response) => {
        console.log('🎵 Featured playlists loaded:', response.results);
        this.featuredPlaylists.set(response.results);
        this.playlistsLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading featured playlists:', error);
        this.playlistsLoading.set(false);
        // Fallback a playlists mock si hay error
        this.loadMockPlaylists();
      }
    });
  }

  loadMockPlaylists(): void {
    // Mock playlists como fallback
    const mockPlaylists: Playlist[] = [
      {
        id: 'mock-1',
        name: 'Hits del Rock',
        description: 'Los mejores éxitos del rock de todos los tiempos',
        user_id: 'system',
        is_default: false,
        is_public: true,
        total_songs: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: 'Mix Aleatorio',
        description: 'Una mezcla de géneros para descubrir nueva música',
        user_id: 'system',
        is_default: false,
        is_public: true,
        total_songs: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-3',
        name: 'Descubrimientos',
        description: 'Artistas emergentes y canciones por descubrir',
        user_id: 'system',
        is_default: false,
        is_public: true,
        total_songs: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-4',
        name: 'Tendencias',
        description: 'Lo más popular en el momento',
        user_id: 'system',
        is_default: false,
        is_public: true,
        total_songs: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.featuredPlaylists.set(mockPlaylists);
  }

  // Método para debug - llamar desde el template
  debugViewMode(): string {
    const mode = this.viewModeService.viewMode();
    console.log('🔍 Debug from template - current mode:', mode);
    return mode;
  }

  // Método para resetear el viewMode (para debug)
  resetViewMode(): void {
    console.log('🔄 Resetting view mode to list');
    this.viewModeService.setViewMode('list');
  }

  // Método para toggle manual del viewMode (para debug)
  toggleViewModeManually(): void {
    const current = this.viewModeService.viewMode();
    const newMode = current === 'list' ? 'table' : 'list';
    console.log('🔄 Manual toggle from', current, 'to', newMode);
    this.viewModeService.setViewMode(newMode);
  }

  // ====================== SONG ACTIONS ======================

  addToQueue(song: Song): void {
    // TODO: Implementar agregar a cola
    console.log('Agregando a cola:', song.title);
  }

  addToPlaylist(song: Song): void {
    // TODO: Implementar agregar a playlist
    console.log('Agregando a playlist:', song.title);
  }

  addToFavorites(song: Song): void {
    // TODO: Implementar agregar a favoritos
    console.log('Agregando a favoritos:', song.title);
  }

  showMoreOptions(song: Song): void {
    // TODO: Implementar más opciones
    console.log('Más opciones para:', song.title);
  }

  private loadHomeData(): void {
    this.loading.set(true);

    // Cargar canciones populares
    this.getMostPopularUseCase.execute(1, 10).subscribe({
      next: (songs) => {
        this.popularSongs.set(songs);
      },
      error: (error) => {
        console.error('Error al cargar canciones populares:', error);
        this.popularSongs.set([]);
      }
    });

    // Cargar canciones aleatorias
    this.getRandomSongsUseCase.execute(1, 8).subscribe({
      next: (songs) => {
        this.randomSongs.set(songs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar canciones aleatorias:', error);
        this.randomSongs.set([]);
        this.loading.set(false);
      }
    });
  }

  // Métodos para reproducir canciones
  playSong(song: Song): void {
    console.log(`Reproduciendo: ${song.title} - ${song.artist_name}`);
    // Implementar lógica de reproducción
  }

  loadMostPopularSongs(): void {
    this.getMostPopularUseCase.execute(1, 15).subscribe({
      next: (songs) => {
        this.popularSongs.set(songs);
        console.log(`Cargadas ${songs.length} canciones populares`);
      },
      error: (error) => {
        console.error('Error al cargar más canciones populares:', error);
      }
    });
  }

  loadRandomSongs(): void {
    this.getRandomSongsUseCase.execute(1, 15).subscribe({
      next: (songs) => {
        this.randomSongs.set(songs);
        console.log(`Cargadas ${songs.length} canciones aleatorias`);
      },
      error: (error) => {
        console.error('Error al cargar más canciones aleatorias:', error);
      }
    });
  }

  // Método para refrescar toda la data
  refreshHomeData(): void {
    this.loadHomeData();
  }

  // Método para reproducir una canción específica - ya existe uno anterior, removiendo duplicado

  // Método para formatear el conteo de reproducciones
  formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Getter para debugging - ver qué tipo se está usando
  getCurrentViewType(): 'grid' | 'table' {
    const currentMode = this.viewModeService.viewMode();
    const resultType = currentMode === 'list' ? 'grid' : 'table';
    console.log('🎯 Home getCurrentViewType: viewMode =', currentMode, '→ resultType =', resultType);
    console.log('🎯 Should show:', resultType === 'grid' ? 'GRID/CARDS' : 'TABLE');
    return resultType;
  }

  // Configuraciones para las secciones de música (usando computed para reactividad)
  readonly popularSectionConfig = computed(() => {
    const primaryButton: MusicSectionButton = {
      text: 'Ver todas',
      action: () => this.loadMostPopularSongs(),
      ariaLabel: 'Ver todas las canciones populares'
    };

    // Usar el servicio global para determinar el tipo de vista
    const currentViewMode = this.viewModeService.viewMode();
    const viewType: 'grid' | 'table' = currentViewMode === 'list' ? 'grid' : 'table';
    
    console.log('🏠 Popular Section - Current view mode:', currentViewMode, 'Using type:', viewType);

    return {
      title: '🔥 Más Populares',
      type: viewType,
      primaryButton,
      songs: this.popularSongs(),
      loading: this.loading(),
      emptyMessage: 'No se pudieron cargar las canciones populares',
      loadingMessage: 'Cargando canciones populares...'
    };
  });

  readonly randomSectionConfig = computed(() => {
    const actionButtons: MusicSectionButton[] = [
      {
        icon: 'refresh',
        action: () => this.loadRandomSongs(),
        ariaLabel: 'Refrescar canciones aleatorias'
      },
      {
        icon: 'play_arrow',
        action: () => this.loadRandomSongs(),
        ariaLabel: 'Reproducir playlist aleatoria'
      }
    ];

    // Usar el servicio global para determinar el tipo de vista
    const currentViewMode = this.viewModeService.viewMode();
    const viewType: 'grid' | 'table' = currentViewMode === 'list' ? 'grid' : 'table';
    
    console.log('🏠 Random Section - Current view mode:', currentViewMode, 'Using type:', viewType);

    return {
      title: '🎲 Descubre Música Nueva',
      type: viewType,
      actionButtons,
      songs: this.randomSongs(),
      loading: this.loading(),
      showPlayCount: false,
      emptyMessage: 'No se pudieron cargar las canciones',
      loadingMessage: 'Cargando música...'
    };
  });
}
