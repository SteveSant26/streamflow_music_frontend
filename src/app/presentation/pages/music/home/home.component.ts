import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import {  finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES_CONFIG_MUSIC } from '@app/config';

import { Song } from '../../../../domain/entities/song.entity';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';
import { ViewModeService } from '../../../shared/services/view-mode.service';
import { MusicSectionComponent } from '../../../components/music-section/music-section';
import { 
  GetMostPopularSongsUseCase,
  GetRandomSongsUseCase,
  PlaySongUseCase 
} from '../../../../domain/usecases/song/song.usecases';
import { GlobalPlayerStateService } from '../../../../infrastructure/services/global-player-state.service';
import { ThemeDirective } from '../../../../shared/directives/theme.directive';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MusicSectionComponent,
    ThemeDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly themeService = inject(MaterialThemeService);
  private readonly viewModeService = inject(ViewModeService);
  private readonly getMostPopularSongsUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  private readonly globalPlayerStateService = inject(GlobalPlayerStateService);
  private readonly router = inject(Router);

  // Observable para el tema
  isDarkTheme$ = this.themeService.isDarkMode();
  
  // Signal para el modo de vista
  viewMode = this.viewModeService.viewMode;

  // Signals para el estado
  mostPopularSongs = signal<Song[]>([]);
  randomSongs = signal<Song[]>([]);
  isLoadingPopular = signal(false);
  isLoadingRandom = signal(false);
  errorPopular = signal<string | null>(null);
  errorRandom = signal<string | null>(null);

  // Button configurations for music sections
  popularSongsActionButtons = [
    {
      icon: 'refresh',
      action: () => this.loadMostPopularSongs(),
      ariaLabel: 'Recargar canciones populares'
    }
  ];

  randomSongsActionButtons = [
    {
      icon: 'refresh',
      action: () => this.loadRandomSongs(),
      ariaLabel: 'Recargar canciones aleatorias'
    }
  ];

  ngOnInit() {
    this.loadMostPopularSongs();
    this.loadRandomSongs();
  }

  private loadMostPopularSongs() {
    this.isLoadingPopular.set(true);
    this.errorPopular.set(null);

    this.getMostPopularSongsUseCase.execute(1, 10).pipe(
      finalize(() => this.isLoadingPopular.set(false))
    ).subscribe({
      next: (songs) => this.mostPopularSongs.set(songs),
      error: (error) => {
        console.error('Error loading popular songs:', error);
        this.errorPopular.set('No se pudieron cargar las canciones populares');
      }
    });
  }

  private loadRandomSongs() {
    this.isLoadingRandom.set(true);
    this.errorRandom.set(null);

    this.getRandomSongsUseCase.execute(1, 10).pipe(
      finalize(() => this.isLoadingRandom.set(false))
    ).subscribe({
      next: (songs) => this.randomSongs.set(songs),
      error: (error) => {
        console.error('Error loading random songs:', error);
        this.errorRandom.set('No se pudieron cargar las canciones aleatorias');
      }
    });
  }

  onSongSelect(song: Song) {
    // Navegación a la página de detalles de la canción
    this.router.navigate([ROUTES_CONFIG_MUSIC.SONG.getLinkWithId(song.id)]);
  }

  onPopularSongSelected(song: Song) {
    console.log('🎵 Home: Popular song selected:', song.title);
    this.onPlaySong(song);
  }

  onRandomSongSelected(song: Song) {
    console.log('🎵 Home: Random song selected:', song.title);
    this.onPlaySong(song);
  }

  onRetryPopularSongs() {
    console.log('🔄 Home: Retrying popular songs load');
    this.loadMostPopularSongs();
  }

  onRetryRandomSongs() {
    console.log('🔄 Home: Retrying random songs load');
    this.loadRandomSongs();
  }

  toggleViewMode() {
    this.viewModeService.toggleViewMode();
  }

  // Métodos para acciones de canciones
  onAddToQueue(song: Song) {
    console.log('🎵 Home: Add to queue requested for:', song.title);
    // TODO: Implementar lógica de agregar a cola
  }

  onAddToPlaylist(song: Song) {
    console.log('📋 Home: Add to playlist requested for:', song.title);
    // TODO: Implementar lógica de agregar a playlist
  }

  onAddToFavorites(song: Song) {
    console.log('❤️ Home: Add to favorites requested for:', song.title);
    // TODO: Implementar lógica de agregar a favoritos
  }

  onMoreOptions(song: Song) {
    console.log('⚙️ Home: More options requested for:', song.title);
    // TODO: Implementar menú de más opciones
  }

  onPlaySong(song: Song) {
    // Determinar de qué lista viene la canción y usar ese contexto
    const popularSongs = this.mostPopularSongs();
    const randomSongs = this.randomSongs();
    
    if (popularSongs.find(s => s.id === song.id)) {
      // La canción está en la lista de populares
      console.log('🎵 Reproduciendo desde canciones populares');
      this.playSongUseCase.executeFromContext(song.id, popularSongs, 'Canciones Populares', 'popular').subscribe({
        next: () => {
          console.log('✅ Reproducción iniciada desde contexto popular');
        },
        error: (error) => {
          console.error('❌ Error reproduciendo desde populares:', error);
        }
      });
    } else if (randomSongs.find(s => s.id === song.id)) {
      // La canción está en la lista de aleatorias  
      console.log('🎵 Reproduciendo desde canciones aleatorias');
      this.playSongUseCase.executeFromContext(song.id, randomSongs, 'Canciones Aleatorias', 'random').subscribe({
        next: () => {
          console.log('✅ Reproducción iniciada desde contexto aleatorio');
        },
        error: (error) => {
          console.error('❌ Error reproduciendo desde aleatorias:', error);
        }
      });
    } else {
      // Fallback al método simple
      console.log('🎵 Reproduciendo con contexto simple (fallback)');
      this.playSongUseCase.executeSimple(song.id).subscribe({
        next: () => {
          console.log('✅ Reproducción iniciada (fallback)');
        },
        error: (error) => {
          console.error('❌ Error en reproducción fallback:', error);
        }
      });
    }
  }

  refresh() {
    this.loadMostPopularSongs();
    this.loadRandomSongs();
  }

  // Método requerido por el template
  toggleTheme() {
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme.isDark ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  testPlayMusic() {
    console.log('🧪 Testing music player...');
    
    // Asegurar que el reproductor esté inicializado
    this.globalPlayerStateService.ensureInitialized();
    
    // Intentar con canciones populares primero
    const popularSongs = this.mostPopularSongs();
    if (popularSongs.length > 0) {
      const firstSong = popularSongs[0];
      console.log('🎵 Probando con canción popular:', firstSong);
      this.onPlaySong(firstSong);
      return;
    }

    // Fallback a canciones aleatorias
    const randomSongs = this.randomSongs();
    if (randomSongs.length > 0) {
      const firstSong = randomSongs[0];
      console.log('🎵 Probando con canción aleatoria:', firstSong);
      this.onPlaySong(firstSong);
      return;
    }

    console.log('❌ No hay canciones disponibles para probar');
  }
}
