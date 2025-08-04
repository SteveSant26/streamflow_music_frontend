import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { 
  GetUserPlaylistsUseCase, 
  DeletePlaylistUseCase,
  EnsureDefaultPlaylistUseCase
} from '../../domain/usecases/playlist/playlist.usecases';
import { LegacyPlaylist as Playlist } from '../../domain/entities/playlist.entity';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="playlists-container">
      <div class="header">
        <h1>Mis Playlists</h1>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="createPlaylist()"
          class="create-btn">
          <mat-icon>add</mat-icon>
          Nueva Playlist
        </button>
      </div>

      <div class="playlists-grid" *ngIf="playlists()?.length; else noPlaylists">
        <mat-card 
          *ngFor="let playlist of playlists()" 
          class="playlist-card"
          [class.favorites]="playlist.name === 'Favoritos'">
          
          <mat-card-header>
            <mat-card-title>
              {{ playlist.name }}
              <mat-icon 
                *ngIf="playlist.name === 'Favoritos'" 
                class="favorite-icon">
                favorite
              </mat-icon>
            </mat-card-title>
            <mat-card-subtitle>
              {{ playlist.songCount }} canciones
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p *ngIf="playlist.description">{{ playlist.description }}</p>
            <p class="playlist-info">
              <span>{{ playlist.isPublic ? 'Pública' : 'Privada' }}</span>
              <span>•</span>
              <span>{{ playlist.createdDate | date:'short' }}</span>
            </p>
          </mat-card-content>

          <mat-card-actions>
            <button 
              mat-button 
              color="primary"
              [routerLink]="['/my-playlist', playlist.id]">
              <mat-icon>play_arrow</mat-icon>
              Reproducir
            </button>
            
            <button 
              mat-button
              [routerLink]="['/my-playlist', playlist.id, 'edit']"
              *ngIf="playlist.name !== 'Favoritos'">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            
            <button 
              mat-button 
              color="warn"
              (click)="confirmDelete(playlist)"
              *ngIf="playlist.name !== 'Favoritos'">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noPlaylists>
        <div class="no-playlists">
          <mat-icon class="large-icon">queue_music</mat-icon>
          <h2>No tienes playlists aún</h2>
          <p>Crea tu primera playlist para comenzar a organizar tu música.</p>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="createPlaylist()">
            <mat-icon>add</mat-icon>
            Crear Playlist
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .playlists-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .playlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .playlist-card {
      transition: transform 0.2s ease-in-out;
    }

    .playlist-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .playlist-card.favorites {
      border-left: 4px solid #e91e63;
    }

    .favorite-icon {
      color: #e91e63;
      margin-left: 8px;
    }

    .playlist-info {
      font-size: 0.9em;
      color: #666;
      margin-top: 8px;
    }

    .playlist-info span {
      margin: 0 4px;
    }

    .no-playlists {
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

    .no-playlists h2 {
      margin: 16px 0;
      color: #333;
    }

    .no-playlists p {
      margin-bottom: 24px;
      color: #666;
    }
  `]
})
export class PlaylistsComponent implements OnInit {
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly deletePlaylistUseCase = inject(DeletePlaylistUseCase);
  private readonly ensureDefaultPlaylistUseCase = inject(EnsureDefaultPlaylistUseCase);
  private readonly dialog = inject(MatDialog);

  playlists = signal<Playlist[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadPlaylists();
    this.ensureDefaultPlaylist();
  }

  private loadPlaylists() {
    this.loading.set(true);
    this.getUserPlaylistsUseCase.execute().subscribe({
      next: (playlists) => {
        this.playlists.set(playlists);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.loading.set(false);
      }
    });
  }

  private ensureDefaultPlaylist() {
    this.ensureDefaultPlaylistUseCase.execute().subscribe({
      next: () => {
        // La playlist de favoritos se aseguró correctamente
      },
      error: (error) => {
        console.error('Error ensuring default playlist:', error);
      }
    });
  }

  createPlaylist() {
    // TODO: Abrir diálogo para crear playlist
    console.log('Creating new playlist...');
  }

  confirmDelete(playlist: Playlist) {
    if (confirm(`¿Estás seguro de que quieres eliminar la playlist "${playlist.name}"?`)) {
      this.deletePlaylistUseCase.execute(playlist.id).subscribe({
        next: () => {
          this.loadPlaylists(); // Recargar lista
        },
        error: (error) => {
          console.error('Error deleting playlist:', error);
        }
      });
    }
  }
}
