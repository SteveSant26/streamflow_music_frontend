import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { GetRandomSongsUseCase } from '../../../../domain/usecases/song/song.usecases';
import { FavoritesUseCase } from '../../../../domain/usecases/favorites/favorites.usecases';
import { Song } from '../../../../domain/entities/song.entity';
import { AudioPlayerService } from '../../../../infrastructure/services/audio-player.service';
import { PlaylistService } from '../../../../infrastructure/services/playlist.service';

@Component({
  selector: 'app-random-songs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './random-songs.component.html',
  styleUrl: './random-songs.component.css'
})
export class RandomSongsComponent implements OnInit {
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly audioPlayerService = inject(AudioPlayerService);
  private readonly playlistService = inject(PlaylistService);
  private readonly favoritesUseCase = inject(FavoritesUseCase);

  // Signals
  songs = signal<Song[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentlyPlaying = signal<string | null>(null);

  // Table columns
  displayedColumns: string[] = ['thumbnail', 'title', 'artist', 'album', 'duration', 'actions'];

  ngOnInit() {
    this.loadRandomSongs();
  }

  loadRandomSongs() {
    this.loading.set(true);
    this.error.set(null);

    this.getRandomSongsUseCase.execute(1, 30).subscribe({
      next: (songs) => {
        this.songs.set(songs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading random songs:', error);
        this.error.set('Error al cargar canciones aleatorias. Por favor, inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  refreshSongs() {
    this.loadRandomSongs();
  }

  playSong(song: Song) {
    this.currentlyPlaying.set(song.id);
    
    // Crear playlist temporal con todas las canciones aleatorias
    const currentSongs = this.songs();
    const songIndex = currentSongs.findIndex(s => s.id === song.id);
    
    this.playlistService.createPlaylist(currentSongs, 'Canciones Aleatorias', songIndex);
    console.log(`Reproduciendo "${song.title}" desde canciones aleatorias`);
  }

  playAllSongs() {
    const currentSongs = this.songs();
    if (currentSongs.length > 0) {
      this.playlistService.createPlaylist(currentSongs, 'Canciones Aleatorias', 0);
      console.log(`Reproduciendo ${currentSongs.length} canciones aleatorias`);
    }
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  addToFavorites(song: Song) {
    console.log('❤️ RandomSongs: Add to favorites:', song.title);
    
    this.favoritesUseCase.addToFavorites(song.id).subscribe({
      next: (favorite) => {
        console.log('✅ Canción agregada a favoritos exitosamente:', favorite);
        console.log(`🔔 "${song.title}" se agregó a favoritos`);
      },
      error: (error) => {
        console.error('❌ Error agregando a favoritos:', error);
        console.log(`🔔 Error: No se pudo agregar "${song.title}" a favoritos`);
      }
    });
  }

  addToPlaylist(song: Song) {
    // Implementar lógica para agregar a playlist
    console.log('Add to playlist:', song.title);
  }
}
