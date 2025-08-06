import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

// Domain
import { Song } from '../../../../../domain/entities/song.entity';
import { Playlist } from '../../../../../domain/entities/playlist.entity';

// Use Cases
import { GetUserPlaylistsUseCase } from '../../../../../domain/usecases/playlist/playlist.usecases';
import { GetRandomSongsUseCase } from '../../../../../domain/usecases/song/song.usecases';

// Components
import { CreatePlaylistDialogComponent } from '../../../../components/music/playlist/create-playlist-dialog/create-playlist-dialog.component';
import { AddSongToPlaylistDialogComponent } from '../../../../components/music/playlist/add-song-to-playlist-dialog/add-song-to-playlist-dialog.component';

@Component({
  selector: 'app-playlist-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './playlist-demo.component.html',
  styleUrl: './playlist-demo.component.css'
})
export class PlaylistDemoComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);

  // Signals
  userPlaylists = signal<Playlist[]>([]);
  demoSongs = signal<Song[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // Load playlists
    this.getUserPlaylistsUseCase.execute().subscribe({
      next: (playlists) => {
        this.userPlaylists.set(playlists);
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.userPlaylists.set([]);
      }
    });

    // Load demo songs
    this.getRandomSongsUseCase.execute(5).subscribe({
      next: (songs) => {
        this.demoSongs.set(songs);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading songs:', error);
        this.demoSongs.set([]);
        this.isLoading.set(false);
      }
    });
  }

  openCreatePlaylistDialog(): void {
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Playlist created:', result);
        // Reload playlists to show the new one
        this.loadData();
      }
    });
  }

  openAddSongDialog(): void {
    const songs = this.demoSongs();
    if (songs.length === 0) return;

    // Use the first song as demo
    const demoSong = songs[0];
    
    const dialogRef = this.dialog.open(AddSongToPlaylistDialogComponent, {
      width: '500px',
      data: { song: demoSong },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Song added to playlist:', result);
        // Optionally reload data to reflect changes
        this.loadData();
      }
    });
  }
}
