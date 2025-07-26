import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-container p-6">
      <h1 class="text-3xl font-bold mb-4">Playlist {{ playlistId }}</h1>
      <p class="text-gray-600 mb-8">Detalles de la playlist</p>
      <!-- Contenido de la playlist -->
    </div>
  `
})
export class PlaylistComponent {
  playlistId: string | null = null;
  
  constructor(private route: ActivatedRoute) {
    this.playlistId = this.route.snapshot.paramMap.get('id');
  }
}
