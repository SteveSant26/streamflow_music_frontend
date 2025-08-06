import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ROUTES_CONFIG_MUSIC } from '../../../../config/routes-config/routes-music.config';
import { 
  GetUserPlaylistsUseCase, 
  DeletePlaylistUseCase,
  EnsureDefaultPlaylistUseCase
} from '../../../../domain/usecases/playlist/playlist.usecases';
import { Playlist } from '../../../../domain/entities/playlist.entity';
import { CreatePlaylistDialogComponent } from '../../../components/music/playlist/create-playlist-dialog/create-playlist-dialog.component';

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
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css'
})
export class PlaylistsComponent implements OnInit {
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly deletePlaylistUseCase = inject(DeletePlaylistUseCase);
  private readonly ensureDefaultPlaylistUseCase = inject(EnsureDefaultPlaylistUseCase);
  private readonly dialog = inject(MatDialog);

  // Configuraciones de rutas para el template
  readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;

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
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload playlists to show the new one
        this.loadPlaylists();
      }
    });
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
