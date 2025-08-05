import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { Song } from '@app/domain/entities/song.entity';

@Component({
  selector: 'app-add-to-current-playlist-button',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  template: `
    <button
      mat-icon-button
      [title]="isInPlaylist ? 'Ya está en la playlist actual' : 'Agregar a playlist actual'"
      [disabled]="isInPlaylist"
      [class]="isInPlaylist 
        ? 'text-green-500 cursor-not-allowed' 
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'"
      (click)="addToCurrentPlaylist()"
      class="transition-colors duration-200"
    >
      <mat-icon>{{ isInPlaylist ? 'playlist_add_check' : 'playlist_add' }}</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AddToCurrentPlaylistButtonComponent {
  @Input() song!: Song;
  
  private readonly playlistService = inject(PlaylistService);
  
  get isInPlaylist(): boolean {
    const currentPlaylist = this.playlistService.getCurrentPlaylist();
    if (!currentPlaylist) return false;
    
    return currentPlaylist.items.some(item => item.id === this.song?.id);
  }

  addToCurrentPlaylist(): void {
    if (!this.song || this.isInPlaylist) return;
    
    this.playlistService.addSongToCurrentPlaylist(this.song);
  }
}
