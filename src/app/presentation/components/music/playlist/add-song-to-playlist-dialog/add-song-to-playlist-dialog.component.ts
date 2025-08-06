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
  templateUrl: './add-song-to-playlist-dialog.component.html',
  styleUrl: './add-song-to-playlist-dialog.component.css'
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
