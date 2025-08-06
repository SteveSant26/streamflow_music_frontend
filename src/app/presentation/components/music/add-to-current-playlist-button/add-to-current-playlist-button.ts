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
  templateUrl: './add-to-current-playlist-button.html',
  styleUrl: './add-to-current-playlist-button.css'
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
