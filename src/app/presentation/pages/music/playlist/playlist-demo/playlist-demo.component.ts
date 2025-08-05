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
import { SongActionButtonComponent } from '../../../../components/music/song/song-action-button/song-action-button.component';
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
    MatDividerModule,
    SongActionButtonComponent
  ],
  template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">Playlist Demo</h1>
      
      <!-- Demo Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <mat-card class="p-6">
          <h2 class="text-xl font-semibold mb-4">Test Dialogs</h2>
          <div class="space-y-4">
            <button mat-raised-button color="primary" (click)="openCreatePlaylistDialog()" class="w-full">
              <mat-icon>playlist_add</mat-icon>
              Test Create Playlist Dialog
            </button>
            
            <button 
              mat-raised-button 
              color="accent" 
              (click)="openAddSongDialog()" 
              [disabled]="demoSongs().length === 0"
              class="w-full"
            >
              <mat-icon>library_add</mat-icon>
              Test Add Song to Playlist Dialog
            </button>
          </div>
        </mat-card>

        <mat-card class="p-6">
          <h2 class="text-xl font-semibold mb-4">Current State</h2>
          <div class="space-y-2">
            <p><strong>Playlists:</strong> {{ userPlaylists().length }}</p>
            <p><strong>Demo Songs:</strong> {{ demoSongs().length }}</p>
            <p><strong>Loading:</strong> {{ isLoading() ? 'Yes' : 'No' }}</p>
          </div>
          
          <button mat-button (click)="loadData()" class="w-full mt-4">
            <mat-icon>refresh</mat-icon>
            Refresh Data
          </button>
        </mat-card>
      </div>

      <!-- Demo Songs List -->
      <mat-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Demo Songs</h2>
        
        @if (isLoading()) {
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        } @else if (demoSongs().length === 0) {
          <p class="text-gray-500 text-center py-8">No songs available</p>
        } @else {
          <div class="space-y-4">
            @for (song of demoSongs(); track song.id) {
              <div class="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <mat-icon class="text-gray-500">music_note</mat-icon>
                </div>
                
                <div class="flex-1">
                  <h3 class="font-medium">{{ song.title }}</h3>
                  <p class="text-sm text-gray-500">{{ song.artist_name }}</p>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">{{ song.duration_formatted || 'Unknown' }}</span>
                  <app-song-action-button [song]="song" size="small" />
                </div>
              </div>
            }
          </div>
        }
      </mat-card>

      <!-- Current Playlists -->
      <mat-card class="p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4">User Playlists</h2>
        
        @if (userPlaylists().length === 0) {
          <p class="text-gray-500 text-center py-8">No playlists found</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (playlist of userPlaylists(); track playlist.id) {
              <div class="p-4 border rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <mat-icon class="text-gray-500">
                    {{ playlist.is_public ? 'public' : 'lock' }}
                  </mat-icon>
                  <h3 class="font-medium">{{ playlist.name }}</h3>
                </div>
                
                @if (playlist.description) {
                  <p class="text-sm text-gray-500 mb-2">{{ playlist.description }}</p>
                }
                
                <div class="flex justify-between items-center text-xs text-gray-400">
                  <span>{{ playlist.total_songs || 0 }} songs</span>
                  <span>{{ playlist.is_public ? 'Public' : 'Private' }}</span>
                </div>
              </div>
            }
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      min-height: calc(100vh - 200px);
    }
    
    mat-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
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
