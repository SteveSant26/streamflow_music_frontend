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
} from '../../domain/usecases/song/song.usecases';
import { Song } from '../../domain/entities/song.entity';
import { PlaylistService } from '../../infrastructure/services/playlist.service';
import { AudioPlayerService } from '../../infrastructure/services/audio-player.service';

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
} from '../../domain/usecases/song/song.usecases';
import { Song } from '../../domain/entities/song.entity';
import { PlaylistService } from '../../infrastructure/services/playlist.service';
import { AudioPlayerService } from '../../infrastructure/services/audio-player.service';

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
        this.router.navigate(['/not-found']);
      }
    });
  }

  private loadSimilarSongs(): void {
    // Cargar canciones aleatorias como "similares"
    this.getRandomSongsUseCase.execute({ page_size: 6 }).subscribe({
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
      this.audioPlayerService.play();
    } else {
      // Si es una canción diferente, reproducirla
      this.playSongUseCase.execute(currentSong.id, true).subscribe({
        next: () => {
          console.log(`Reproduciendo: ${currentSong.title}`);
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
    if (currentSong.fileUrl) {
      window.open(currentSong.fileUrl, '_blank');
    }
  }

  shareSong(): void {
    const currentSong = this.song();
    if (!currentSong) return;

    if (navigator.share) {
      navigator.share({
        title: currentSong.title,
        text: `Escucha "${currentSong.title}" de ${currentSong.artist}`,
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
      this.router.navigate(['/artist', currentSong.artist]);
    }
  }

  goToAlbum(): void {
    const currentSong = this.song();
    if (currentSong) {
      this.router.navigate(['/album', currentSong.album]);
    }
  }

  playSimilarSong(song: Song): void {
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        this.router.navigate(['/song', song.id]);
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
}
