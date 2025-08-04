import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ROUTES_CONFIG_MUSIC, ROUTES_CONFIG_GENERAL } from '@app/config/routes-config';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { 
  GetSongByIdUseCase, 
  PlaySongUseCase,
  GetRandomSongsUseCase 
} from '@app/domain/usecases/song/song.usecases';
import { Song } from '@app/domain/entities/song.entity';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { AudioPlayerService } from '@app/infrastructure/services/audio-player.service';

@Component({
  selector: 'app-song-description',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    TranslateModule,
  ],
  templateUrl: './song-description.html',
  styleUrls: ['./song-description.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDescriptionComponent implements OnInit {
  // Signals para el estado del componente
  readonly song = signal<Song | null>(null);
  readonly similarSongs = signal<Song[]>([]);
  readonly loading = signal(true);
  readonly showLyrics = signal(false);

  // Servicios inyectados
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getSongUseCase = inject(GetSongByIdUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly playlistService = inject(PlaylistService);
  private readonly audioPlayerService = inject(AudioPlayerService);

  // Estado del reproductor (desde los servicios)
  readonly playbackState$ = this.playlistService.playbackState$;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const songId = params['id'];
      if (songId) {
        this.loadSong(songId);
        this.loadSimilarSongs();
      }
    });
  }

  private loadSong(id: string): void {
    this.loading.set(true);
    
    this.getSongUseCase.execute(id).subscribe({
      next: (song) => {
        this.song.set(song);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la canción:', error);
        this.loading.set(false);
        // Redirigir a una página de error o mostrar mensaje
        this.router.navigate([ROUTES_CONFIG_GENERAL.NOT_FOUND.path]);
      }
    });
  }

  private loadSimilarSongs(): void {
    // Cargar canciones aleatorias como "similares"
    this.getRandomSongsUseCase.execute(6).subscribe({
      next: (songs) => {
        this.similarSongs.set(songs.slice(0, 3)); // Solo mostrar 3
      },
      error: (error) => {
        console.error('Error al cargar canciones similares:', error);
        this.similarSongs.set([]);
      }
    });
  }

  togglePlay(): void {
    const currentSong = this.song();
    if (!currentSong) return;

    const state = this.playlistService.getCurrentState();
    
    if (state.currentSong?.id === currentSong.id) {
      // Si es la misma canción, toggle play/pause
      this.playlistService.togglePlayback();
    } else {
      // Si es una canción diferente, reproducirla
      this.playSongUseCase.execute(currentSong.id, true).subscribe({
        next: (song) => {
          console.log(`Reproduciendo: ${song.title}`);
          // Crear una nueva playlist con esta canción
          this.playlistService.createPlaylist([song], 'Current Song', 0);
          // Iniciar reproducción
          this.playlistService.togglePlayback();
        },
        error: (error) => {
          console.error('Error al reproducir canción:', error);
        }
      });
    }
  }

  addToPlaylist(): void {
    const currentSong = this.song();
    if (!currentSong) return;

    this.playlistService.addToPlaylist(currentSong);
    console.log(`Agregado a la cola: ${currentSong.title}`);
  }

  downloadSong(): void {
    const currentSong = this.song();
    if (!currentSong) return;
    
    // Abrir el archivo de audio en una nueva pestaña para descarga
    if (currentSong.file_url) {
      window.open(currentSong.file_url, '_blank');
    }
  }

  shareSong(): void {
    const currentSong = this.song();
    if (!currentSong) return;

    if (navigator.share) {
      navigator.share({
        title: currentSong.title,
        text: `Escucha "${currentSong.title}" de ${currentSong.artist_name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar URL al clipboard
      navigator.clipboard.writeText(window.location.href);
      console.log('URL copiada al portapapeles');
    }
  }

  toggleLyrics(): void {
    this.showLyrics.set(!this.showLyrics());
  }

  goToArtist(): void {
    const currentSong = this.song();
    if (currentSong) {
      this.router.navigate([ROUTES_CONFIG_MUSIC.ARTIST.getLinkWithId(currentSong.artist_id || currentSong.artist_name || 'unknown')]);
    }
  }

  goToAlbum(): void {
    const currentSong = this.song();
    if (currentSong) {
      this.router.navigate([ROUTES_CONFIG_MUSIC.ALBUM.getLinkWithId(currentSong.album_id || currentSong.album_name || 'unknown')]);
    }
  }

  playSimilarSong(song: Song): void {
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        this.router.navigate([ROUTES_CONFIG_MUSIC.SONG.getLinkWithId(song.id)]);
      },
      error: (error) => {
        console.error('Error al reproducir canción similar:', error);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  // Métodos de utilidad para el template
  isCurrentSongPlaying(): boolean {
    const currentSong = this.song();
    const state = this.playlistService.getCurrentState();
    return state.currentSong?.id === currentSong?.id && state.isPlaying;
  }

  formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Estado de liked (placeholder - implementar con API real)
  isLiked(): boolean {
    // TODO: Implementar lógica real con API de favoritos
    return false;
  }

  toggleLike(): void {
    const currentSong = this.song();
    if (!currentSong) return;
    
    // TODO: Implementar lógica real con API de favoritos
    console.log(`Toggle like para: ${currentSong.title}`);
  }

  getSongDescription(): string {
    const currentSong = this.song();
    if (!currentSong) return '';
    
    return `${currentSong.title} de ${currentSong.artist_name}`;
  }
}
