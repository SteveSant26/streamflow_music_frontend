import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { 
  GetPlaylistByIdUseCase,
  RemoveSongFromPlaylistUseCase
} from '../../../../domain/usecases/playlist/playlist.usecases';
import { PlaylistWithSongs } from '../../../../domain/entities/playlist.entity';
import { Song } from '../../../../domain/entities/song.entity';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.css'
})
export class PlaylistDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getPlaylistByIdUseCase = inject(GetPlaylistByIdUseCase);
  private readonly removeSongFromPlaylistUseCase = inject(RemoveSongFromPlaylistUseCase);

  playlist = signal<PlaylistWithSongs | null>(null);
  loading = signal(false);
  
  displayedColumns: string[] = ['position', 'title', 'album', 'duration', 'added_at', 'actions'];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const playlistId = params['id'];
      if (playlistId) {
        this.loadPlaylist(playlistId);
      }
    });
  }

  private loadPlaylist(id: string) {
    this.loading.set(true);
    this.getPlaylistByIdUseCase.execute(id).subscribe({
      next: (playlist) => {
        this.playlist.set(playlist);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.loading.set(false);
      }
    });
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  playAllSongs() {
    console.log('Playing all songs from playlist');
  }

  playSong(song: Song) {
    console.log('Playing song:', song.title);
  }

  removeSong(song: Song) {
    if (confirm(`¿Quieres eliminar "${song.title}" de esta playlist?`)) {
      this.removeSongFromPlaylistUseCase.execute(this.playlist()!.id, song.id).subscribe({
        next: () => {
          // Recargar la playlist
          this.loadPlaylist(this.playlist()!.id);
        },
        error: (error) => {
          console.error('Error removing song:', error);
        }
      });
    }
  }
}
