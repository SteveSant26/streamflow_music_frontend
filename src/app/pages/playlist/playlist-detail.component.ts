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
} from '../../domain/usecases/playlist/playlist.usecases';
import { PlaylistWithSongs, PlaylistSong } from '../../domain/entities/playlist.entity';

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
  template: `
    <div class="playlist-detail-container" *ngIf="playlist()">
      <div class="playlist-header">
        <div class="playlist-info">
          <h1>{{ playlist()!.name }}</h1>
          <p *ngIf="playlist()!.description" class="description">
            {{ playlist()!.description }}
          </p>
          <div class="metadata">
            <span>{{ playlist()!.total_songs }} canciones</span>
            <span>•</span>
            <span>{{ playlist()!.is_public ? 'Pública' : 'Privada' }}</span>
            <span *ngIf="playlist()!.is_default">•</span>
            <span *ngIf="playlist()!.is_default" class="favorites-badge">
              <mat-icon>favorite</mat-icon>
              Favoritos
            </span>
          </div>
        </div>
        
        <div class="playlist-actions">
          <button 
            mat-fab 
            color="primary" 
            matTooltip="Reproducir todo"
            (click)="playAllSongs()"
            [disabled]="!playlist()!.songs.length">
            <mat-icon>play_arrow</mat-icon>
          </button>
          
          <button 
            mat-raised-button 
            [routerLink]="['/playlist', playlist()!.id, 'edit']"
            *ngIf="!playlist()!.is_default">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>
      </div>

      <div class="songs-section" *ngIf="playlist()!.songs.length; else noSongs">
        <mat-card class="songs-card">
          <mat-card-header>
            <mat-card-title>Canciones</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <table mat-table [dataSource]="playlist()!.songs" class="songs-table">
              <!-- Position Column -->
              <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef> # </th>
                <td mat-cell *matCellDef="let song"> {{ song.position }} </td>
              </ng-container>

              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef> Título </th>
                <td mat-cell *matCellDef="let song">
                  <div class="song-info">
                    <div class="song-title">{{ song.title }}</div>
                    <div class="song-artist" *ngIf="song.artist_name">
                      {{ song.artist_name }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Album Column -->
              <ng-container matColumnDef="album">
                <th mat-header-cell *matHeaderCellDef> Álbum </th>
                <td mat-cell *matCellDef="let song"> 
                  {{ song.album_name || '-' }} 
                </td>
              </ng-container>

              <!-- Duration Column -->
              <ng-container matColumnDef="duration">
                <th mat-header-cell *matHeaderCellDef> Duración </th>
                <td mat-cell *matCellDef="let song"> 
                  {{ formatDuration(song.duration_seconds) }} 
                </td>
              </ng-container>

              <!-- Added Date Column -->
              <ng-container matColumnDef="added_at">
                <th mat-header-cell *matHeaderCellDef> Agregada </th>
                <td mat-cell *matCellDef="let song"> 
                  {{ song.added_at | date:'short' }} 
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let song">
                  <button 
                    mat-icon-button 
                    color="primary"
                    matTooltip="Reproducir"
                    (click)="playSong(song)">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  
                  <button 
                    mat-icon-button 
                    color="warn"
                    matTooltip="Eliminar de la playlist"
                    (click)="removeSong(song)"
                    *ngIf="!playlist()!.is_default">
                    <mat-icon>remove</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noSongs>
        <div class="no-songs">
          <mat-icon class="large-icon">music_note</mat-icon>
          <h2>Esta playlist está vacía</h2>
          <p>Agrega canciones desde la biblioteca de música.</p>
          <button 
            mat-raised-button 
            color="primary"
            routerLink="/discover">
            <mat-icon>search</mat-icon>
            Explorar Música
          </button>
        </div>
      </ng-template>
    </div>

    <div class="loading" *ngIf="loading()">
      Cargando playlist...
    </div>
  `,
  styles: [`
    .playlist-detail-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .playlist-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
    }

    .playlist-info h1 {
      margin: 0 0 8px 0;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .description {
      margin: 8px 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .metadata {
      margin-top: 16px;
      font-size: 0.95rem;
      opacity: 0.8;
    }

    .metadata span {
      margin: 0 4px;
    }

    .favorites-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #ff6b9d;
    }

    .playlist-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .songs-card {
      margin-top: 24px;
    }

    .songs-table {
      width: 100%;
    }

    .song-info {
      display: flex;
      flex-direction: column;
    }

    .song-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .song-artist {
      font-size: 0.9em;
      color: #666;
    }

    .no-songs {
      text-align: center;
      padding: 64px 24px;
    }

    .large-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #666;
      margin-bottom: 16px;
    }

    .loading {
      text-align: center;
      padding: 64px;
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .playlist-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .playlist-info h1 {
        font-size: 2rem;
      }
    }
  `]
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
    // TODO: Integrar con el reproductor de música
    console.log('Playing all songs from playlist');
  }

  playSong(song: PlaylistSong) {
    // TODO: Integrar con el reproductor de música
    console.log('Playing song:', song.title);
  }

  removeSong(song: PlaylistSong) {
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
