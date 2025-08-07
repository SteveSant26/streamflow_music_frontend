import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Playlist } from '../../../domain/entities/playlist.entity';
import { PlaylistFacadeService } from '../../../domain/services/playlist-facade.service';
import { ROUTES_CONFIG_MUSIC } from '../../../config/routes-config';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-card" 
         [class.selected]="isSelected()"
         (click)="onPlaylistClick()">
      
      <!-- Playlist Cover -->
      <div class="playlist-cover">
        <img 
          [src]="getCoverImage()" 
          [alt]="playlist().name"
          class="cover-image"
          loading="lazy"
        />
        <div class="overlay">
          <button class="play-button" (click)="onPlayClick($event)">
            <i class="fas fa-play"></i>
          </button>
        </div>
      </div>

      <!-- Playlist Info -->
      <div class="playlist-info">
        <h3 class="playlist-title" [title]="playlist().name">
          {{ playlist().name }}
        </h3>
        
        <p class="playlist-description" 
           *ngIf="playlist().description"
           [title]="playlist().description">
          {{ playlist().description }}
        </p>
        
        <div class="playlist-meta">
          <span class="song-count">
            {{ playlist().total_songs }} {{ playlist().total_songs === 1 ? 'canción' : 'canciones' }}
          </span>
          
          <span class="visibility" *ngIf="showVisibility()">
            <i [class]="getVisibilityIcon()"></i>
            {{ playlist().is_public ? 'Público' : 'Privado' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="playlist-actions" *ngIf="showActions()">
          <button 
            class="action-btn edit-btn"
            (click)="onEditClick($event)"
            [disabled]="isLoading()"
            title="Editar playlist">
            <i class="fas fa-edit"></i>
          </button>
          
          <button 
            class="action-btn duplicate-btn"
            (click)="onDuplicateClick($event)"
            [disabled]="isLoading()"
            title="Duplicar playlist">
            <i class="fas fa-copy"></i>
          </button>
          
          <button 
            class="action-btn delete-btn"
            (click)="onDeleteClick($event)"
            [disabled]="isLoading() || playlist().is_default"
            title="Eliminar playlist">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlist-card {
      @apply bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer;
      @apply border border-gray-200 dark:border-gray-700;
    }

    .playlist-card.selected {
      @apply ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20;
    }

    .playlist-cover {
      @apply relative overflow-hidden rounded-t-lg aspect-square;
    }

    .cover-image {
      @apply w-full h-full object-cover;
    }

    .overlay {
      @apply absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200;
      @apply flex items-center justify-center;
    }

    .play-button {
      @apply bg-white text-gray-900 rounded-full p-3 opacity-0 hover:opacity-100 transition-all duration-200;
      @apply hover:scale-105 shadow-lg;
    }

    .playlist-info {
      @apply p-4;
    }

    .playlist-title {
      @apply font-semibold text-lg text-gray-900 dark:text-white truncate mb-1;
    }

    .playlist-description {
      @apply text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2;
    }

    .playlist-meta {
      @apply flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3;
    }

    .song-count {
      @apply font-medium;
    }

    .visibility {
      @apply flex items-center gap-1;
    }

    .playlist-actions {
      @apply flex items-center gap-2;
    }

    .action-btn {
      @apply p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
      @apply transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .edit-btn:hover {
      @apply text-blue-600 bg-blue-50 dark:bg-blue-900/20;
    }

    .duplicate-btn:hover {
      @apply text-green-600 bg-green-50 dark:bg-green-900/20;
    }

    .delete-btn:hover {
      @apply text-red-600 bg-red-50 dark:bg-red-900/20;
    }
  `]
})
export class PlaylistCardComponent {
  private readonly router = inject(Router);
  private readonly playlistFacade = inject(PlaylistFacadeService);

  // Inputs
  readonly playlist = input.required<Playlist>();
  readonly isSelected = input<boolean>(false);
  readonly showActions = input<boolean>(true);
  readonly showVisibility = input<boolean>(true);

  // Outputs
  readonly playlistSelected = output<Playlist>();
  readonly playlistPlay = output<Playlist>();
  readonly playlistEdit = output<Playlist>();
  readonly playlistDuplicate = output<Playlist>();
  readonly playlistDelete = output<Playlist>();

  // State
  readonly isLoading = this.playlistFacade.isLoading;

  onPlaylistClick(): void {
    // Navegar directamente al detalle de la playlist
    this.router.navigate([ROUTES_CONFIG_MUSIC.PLAYLIST.getLinkWithId(this.playlist().id)]);
    // También emitir el evento para compatibilidad
    this.playlistSelected.emit(this.playlist());
  }

  onPlayClick(event: Event): void {
    event.stopPropagation();
    this.playlistPlay.emit(this.playlist());
  }

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.playlistEdit.emit(this.playlist());
  }

  onDuplicateClick(event: Event): void {
    event.stopPropagation();
    this.playlistDuplicate.emit(this.playlist());
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.playlistDelete.emit(this.playlist());
  }

  getCoverImage(): string {
    // Usar la imagen de la playlist si está disponible, sino usar una imagen placeholder
    return this.playlist().playlist_img || `https://picsum.photos/300/300?random=${this.playlist().id}`;
  }

  getVisibilityIcon(): string {
    return this.playlist().is_public 
      ? 'fas fa-globe text-green-500' 
      : 'fas fa-lock text-gray-500';
  }
}
