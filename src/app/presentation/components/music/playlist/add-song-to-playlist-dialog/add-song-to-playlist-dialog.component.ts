import { Component, inject, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { 
  GetUserPlaylistsUseCase, 
  AddSongToPlaylistUseCase,
  CreatePlaylistUseCase 
} from '../../../../../domain/usecases/playlist/playlist.usecases';
import { Playlist, CreatePlaylistDto, AddSongToPlaylistDto } from '../../../../../domain/entities/playlist.entity';
import { Song } from '../../../../../domain/entities/song.entity';

export interface AddSongToPlaylistDialogData {
  song: Song;
}

@Component({
  selector: 'app-add-song-to-playlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  template: `
    <div class="add-song-dialog">
      <h2 mat-dialog-title>
        <mat-icon>playlist_add</mat-icon>
        Agregar a Playlist
      </h2>
      
      <div mat-dialog-content class="dialog-content">
        <!-- Song info -->
        <div class="song-info">
          <img 
            [src]="data.song.thumbnail_url || '/assets/placeholders/song.jpg'" 
            [alt]="data.song.title"
            class="song-thumbnail"
            (error)="onImageError($event)">
          <div class="song-details">
            <h3>{{data.song.title}}</h3>
            <p>{{data.song.artist_name}}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Loading state -->
        <div *ngIf="isLoading()" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Cargando playlists...</p>
        </div>

        <!-- Error state -->
        <div *ngIf="error()" class="error-container">
          <mat-icon color="warn">error</mat-icon>
          <p>Error al cargar las playlists</p>
          <button mat-button color="primary" (click)="loadPlaylists()">
            <mat-icon>refresh</mat-icon>
            Reintentar
          </button>
        </div>

        <!-- Playlists list -->
        <div *ngIf="!isLoading() && !error()" class="playlists-container">
          <h3 class="section-title">Selecciona una playlist:</h3>
          
          <!-- Empty state -->
          <div *ngIf="playlists().length === 0" class="empty-state">
            <mat-icon>queue_music</mat-icon>
            <p>No tienes playlists aún</p>
            <button mat-raised-button color="primary" (click)="createNewPlaylist()">
              <mat-icon>add</mat-icon>
              Crear Primera Playlist
            </button>
          </div>

          <!-- Playlists list -->
          <mat-list *ngIf="playlists().length > 0" class="playlists-list">
            <mat-list-item 
              *ngFor="let playlist of playlists()" 
              class="playlist-item"
              [class.adding]="addingToPlaylist() === playlist.id"
              (click)="addToPlaylist(playlist)">
              
              <div class="playlist-content">
                <div class="playlist-icon">
                  <mat-icon *ngIf="playlist.name === 'Favoritos'">favorite</mat-icon>
                  <mat-icon *ngIf="playlist.name !== 'Favoritos'">queue_music</mat-icon>
                </div>
                
                <div class="playlist-info">
                  <h4>{{playlist.name}}</h4>
                  <p>{{playlist.total_songs}} canciones • {{playlist.is_public ? 'Pública' : 'Privada'}}</p>
                </div>
                
                <div class="playlist-actions">
                  <mat-spinner 
                    diameter="24" 
                    *ngIf="addingToPlaylist() === playlist.id">
                  </mat-spinner>
                  <mat-icon 
                    *ngIf="addingToPlaylist() !== playlist.id"
                    class="add-icon">
                    add
                  </mat-icon>
                </div>
              </div>
            </mat-list-item>
          </mat-list>

          <mat-divider *ngIf="playlists().length > 0"></mat-divider>

          <!-- Create new playlist option -->
          <button 
            mat-stroked-button 
            class="create-new-btn"
            (click)="createNewPlaylist()"
            [disabled]="addingToPlaylist() !== null">
            <mat-icon>add</mat-icon>
            Crear Nueva Playlist
          </button>
        </div>
      </div>

      <div mat-dialog-actions>
        <button 
          mat-button 
          (click)="onCancel()"
          [disabled]="addingToPlaylist() !== null">
          Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .add-song-dialog {
      min-width: 400px;
      max-width: 500px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: var(--primary-color, #1976d2);
    }

    .dialog-content {
      max-height: 60vh;
      overflow-y: auto;
      padding: 0 1.5rem;
    }

    .song-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
    }

    .song-thumbnail {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      background: var(--surface-variant, #f5f5f5);
    }

    .song-details h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--on-surface, #000);
    }

    .song-details p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--on-surface-variant, #666);
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem 0;
      text-align: center;
    }

    .playlists-container {
      padding: 1rem 0;
    }

    .section-title {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--on-surface, #000);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem 0;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--on-surface-variant, #666);
    }

    .playlists-list {
      padding: 0;
    }

    .playlist-item {
      cursor: pointer;
      border-radius: 8px;
      margin: 0.25rem 0;
      transition: background-color 0.2s;
    }

    .playlist-item:hover:not(.adding) {
      background: var(--surface-variant, rgba(0, 0, 0, 0.04));
    }

    .playlist-item.adding {
      opacity: 0.7;
      cursor: wait;
    }

    .playlist-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 0.75rem;
    }

    .playlist-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--primary-color, #1976d2);
      color: white;
      border-radius: 8px;
    }

    .playlist-info {
      flex: 1;
    }

    .playlist-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--on-surface, #000);
    }

    .playlist-info p {
      margin: 0;
      font-size: 0.75rem;
      color: var(--on-surface-variant, #666);
    }

    .playlist-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    .add-icon {
      color: var(--primary-color, #1976d2);
    }

    .create-new-btn {
      width: 100%;
      margin-top: 1rem;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 1rem 1.5rem 0;
      margin: 0;
    }

    /* Dark mode support */
    :host-context(.dark-theme) .song-thumbnail {
      background: var(--surface-variant-dark, #2c2c2c);
    }

    :host-context(.dark-theme) .song-details h3,
    :host-context(.dark-theme) .section-title,
    :host-context(.dark-theme) .playlist-info h4 {
      color: var(--on-surface-dark, #fff);
    }

    :host-context(.dark-theme) .song-details p,
    :host-context(.dark-theme) .playlist-info p {
      color: var(--on-surface-variant-dark, #b3b3b3);
    }

    :host-context(.dark-theme) .playlist-item:hover:not(.adding) {
      background: var(--surface-variant-dark, rgba(255, 255, 255, 0.04));
    }
  `]
})
export class AddSongToPlaylistDialogComponent implements OnInit {
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly addSongToPlaylistUseCase = inject(AddSongToPlaylistUseCase);
  private readonly createPlaylistUseCase = inject(CreatePlaylistUseCase);
  private readonly dialogRef = inject(MatDialogRef<AddSongToPlaylistDialogComponent>);

  playlists = signal<Playlist[]>([]);
  isLoading = signal(false);
  error = signal(false);
  addingToPlaylist = signal<string | null>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddSongToPlaylistDialogData
  ) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.isLoading.set(true);
    this.error.set(false);

    this.getUserPlaylistsUseCase.execute().subscribe({
      next: (playlists) => {
        this.playlists.set(playlists);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.error.set(true);
        this.isLoading.set(false);
      }
    });
  }

  addToPlaylist(playlist: Playlist) {
    if (this.addingToPlaylist()) return;

    this.addingToPlaylist.set(playlist.id);

    const addSongData: AddSongToPlaylistDto = {
      song_id: this.data.song.id
    };

    this.addSongToPlaylistUseCase.execute(playlist.id, addSongData).subscribe({
      next: () => {
        this.addingToPlaylist.set(null);
        this.dialogRef.close({
          success: true,
          playlist: playlist,
          action: 'added'
        });
      },
      error: (error) => {
        console.error('Error adding song to playlist:', error);
        this.addingToPlaylist.set(null);
        // Show error to user
        this.error.set(true);
      }
    });
  }

  createNewPlaylist() {
    // Create a simple playlist with the song's title and add the song to it
    const playlistData: CreatePlaylistDto = {
      name: `Playlist de ${this.data.song.title}`,
      description: `Playlist creada para ${this.data.song.title}`,
      is_public: false
    };

    this.isLoading.set(true);

    this.createPlaylistUseCase.execute(playlistData).subscribe({
      next: (newPlaylist) => {
        // Add the song to the new playlist
        const addSongData: AddSongToPlaylistDto = {
          song_id: this.data.song.id
        };

        this.addSongToPlaylistUseCase.execute(newPlaylist.id, addSongData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.dialogRef.close({
              success: true,
              playlist: newPlaylist,
              action: 'created_and_added'
            });
          },
          error: (error) => {
            console.error('Error adding song to new playlist:', error);
            this.isLoading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
        this.isLoading.set(false);
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/placeholders/song.jpg';
  }

  onCancel() {
    this.dialogRef.close();
  }
}
