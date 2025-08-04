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
} from '../../../../domain/usecases/playlist/playlist.usecases';
import { Playlist } from '../../../../domain/entities/playlist.entity';

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
