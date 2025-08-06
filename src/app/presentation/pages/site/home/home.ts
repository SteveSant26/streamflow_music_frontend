import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card, Greeting } from '@app/presentation/components/ui';
import { PlayListItemCard } from '@app/presentation/components/music';
import { MusicSectionComponent, MusicSectionButton } from '@app/presentation/components/music-section/music-section';
import { ViewModeService } from '@app/presentation/shared/services/view-mode.service';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_SITE, ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';
import { 
  GetMostPopularSongsUseCase, 
  GetRandomSongsUseCase,
  PlaySongUseCase
} from '../../../../domain/usecases/song/song.usecases';
import { Song } from '../../../../domain/entities/song.entity';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    Greeting,
    PlayListItemCard,
    MusicSectionComponent,
    TranslateModule,
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
  readonly viewModeService = inject(ViewModeService);

  // Route configs
  protected readonly ROUTES_CONFIG_SITE = ROUTES_CONFIG_SITE;
  protected readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;

  // Signals para el estado del componente
  readonly popularSongs = signal<Song[]>([]);
  readonly randomSongs = signal<Song[]>([]);
  readonly loading = signal(true);

  // Datos mock para las playlists (mantenemos algunos como ejemplo)
  featuredPlaylists = [
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
    
    // Effect para debuggear cambios de view mode
    effect(() => {
      const currentMode = this.viewModeService.viewMode();
      console.log('🏠 Home Effect: View mode changed to:', currentMode);
    });
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
    console.log('🎯 getCurrentViewType: viewMode =', currentMode, '→ resultType =', resultType);
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
