import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Playlist, PlaylistFilters } from '../../../domain/entities/playlist.entity';
import { PlaylistFacadeService } from '../../../domain/services/playlist-facade.service';
import { PlaylistCardComponent } from './playlist-card.component';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaylistCardComponent],
  template: `
    <div class="playlist-list">
      <!-- Header -->
      <div class="list-header">
        <h2 class="list-title">{{ title() }}</h2>
        
        <!-- Search and filters -->
        <div class="controls" *ngIf="showControls()">
          <div class="search-box">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              placeholder="Buscar playlists..."
              class="search-input"
            />
            <i class="fas fa-search search-icon"></i>
          </div>
          
          <div class="filter-controls">
            <select 
              [(ngModel)]="visibilityFilter"
              (change)="onFilterChange()"
              class="filter-select">
              <option value="">Todas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
            
            <button 
              class="btn btn-primary"
              (click)="onCreatePlaylist()"
              *ngIf="showCreateButton()">
              <i class="fas fa-plus"></i>
              Nueva Playlist
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="spinner"></div>
        <p>Cargando playlists...</p>
      </div>

      <!-- Error state -->
      <div class="error-state" *ngIf="error() && !isLoading()">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error() }}</p>
          <button class="btn btn-secondary" (click)="onRetry()">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!isLoading() && !error() && displayedPlaylists().length === 0">
        <div class="empty-message">
          <i class="fas fa-music"></i>
          <h3>{{ getEmptyStateTitle() }}</h3>
          <p>{{ getEmptyStateMessage() }}</p>
          <button 
            class="btn btn-primary"
            (click)="onCreatePlaylist()"
            *ngIf="showCreateButton()">
            <i class="fas fa-plus"></i>
            Crear tu primera playlist
          </button>
        </div>
      </div>

      <!-- Playlist grid -->
      <div class="playlists-grid" *ngIf="!isLoading() && !error() && displayedPlaylists().length > 0">
        <app-playlist-card
          *ngFor="let playlist of displayedPlaylists(); trackBy: trackByPlaylistId"
          [playlist]="playlist"
          [isSelected]="selectedPlaylistId() === playlist.id"
          [showActions]="showPlaylistActions()"
          [showVisibility]="showVisibility()"
          (playlistSelected)="onPlaylistSelected($event)"
          (playlistPlay)="onPlaylistPlay($event)"
          (playlistEdit)="onPlaylistEdit($event)"
          (playlistDuplicate)="onPlaylistDuplicate($event)"
          (playlistDelete)="onPlaylistDelete($event)"
        />
      </div>

      <!-- Load more button -->
      <div class="load-more" *ngIf="showLoadMore()">
        <button 
          class="btn btn-secondary"
          (click)="onLoadMore()"
          [disabled]="isLoading()">
          <i class="fas fa-sync" [class.fa-spin]="isLoading()"></i>
          Cargar más
        </button>
      </div>
    </div>
  `,
  styles: [`
    .playlist-list {
      @apply space-y-6;
    }

    .list-header {
      @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4;
    }

    .list-title {
      @apply text-2xl font-bold text-gray-900 dark:text-white;
    }

    .controls {
      @apply flex flex-col sm:flex-row gap-4;
    }

    .search-box {
      @apply relative;
    }

    .search-input {
      @apply w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg;
      @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
      @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }

    .search-icon {
      @apply absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400;
    }

    .filter-controls {
      @apply flex items-center gap-3;
    }

    .filter-select {
      @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg;
      @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
      @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }

    .btn {
      @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
      @apply flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700;
    }

    .btn-secondary {
      @apply bg-gray-600 text-white hover:bg-gray-700;
    }

    .loading-state {
      @apply flex flex-col items-center justify-center py-12 space-y-4;
    }

    .spinner {
      @apply w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin;
    }

    .error-state {
      @apply flex justify-center py-12;
    }

    .error-message {
      @apply text-center space-y-4;
    }

    .empty-state {
      @apply flex justify-center py-12;
    }

    .empty-message {
      @apply text-center space-y-4 max-w-md;
    }

    .empty-message i {
      @apply text-6xl text-gray-300 dark:text-gray-600;
    }

    .empty-message h3 {
      @apply text-xl font-semibold text-gray-900 dark:text-white;
    }

    .empty-message p {
      @apply text-gray-600 dark:text-gray-300;
    }

    .playlists-grid {
      @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6;
    }

    .load-more {
      @apply flex justify-center pt-6;
    }
  `]
})
export class PlaylistListComponent implements OnInit {
  private readonly playlistFacade = inject(PlaylistFacadeService);

  // Inputs
  readonly title = input<string>('Mis Playlists');
  readonly playlists = input<Playlist[]>([]);
  readonly showControls = input<boolean>(true);
  readonly showCreateButton = input<boolean>(true);
  readonly showPlaylistActions = input<boolean>(true);
  readonly showVisibility = input<boolean>(true);
  readonly showLoadMore = input<boolean>(false);

  // Outputs
  readonly playlistSelected = output<Playlist>();
  readonly playlistPlay = output<Playlist>();
  readonly playlistEdit = output<Playlist>();
  readonly playlistDuplicate = output<Playlist>();
  readonly playlistDelete = output<Playlist>();
  readonly createPlaylist = output<void>();
  readonly loadMore = output<void>();
  readonly filtersChanged = output<PlaylistFilters>();

  // State from facade
  readonly isLoading = this.playlistFacade.isLoading;
  readonly error = this.playlistFacade.error;
  readonly selectedPlaylistId = this.playlistFacade.selectedPlaylistId;

  // Local state
  searchTerm = '';
  visibilityFilter = '';

  // Computed
  displayedPlaylists() {
    const playlists = this.playlists();
    let filtered = [...playlists];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(playlist =>
        playlist.name.toLowerCase().includes(term) ||
        playlist.description?.toLowerCase().includes(term)
      );
    }

    // Apply visibility filter
    if (this.visibilityFilter) {
      filtered = filtered.filter(playlist =>
        this.visibilityFilter === 'public' ? playlist.is_public : !playlist.is_public
      );
    }

    return filtered;
  }

  ngOnInit(): void {
    // Initial load if no playlists provided
    if (this.playlists().length === 0) {
      this.loadPlaylists();
    }
  }

  onSearchChange(): void {
    this.emitFilters();
  }

  onFilterChange(): void {
    this.emitFilters();
  }

  onPlaylistSelected(playlist: Playlist): void {
    this.playlistSelected.emit(playlist);
  }

  onPlaylistPlay(playlist: Playlist): void {
    this.playlistPlay.emit(playlist);
  }

  onPlaylistEdit(playlist: Playlist): void {
    this.playlistEdit.emit(playlist);
  }

  onPlaylistDuplicate(playlist: Playlist): void {
    this.playlistDuplicate.emit(playlist);
  }

  onPlaylistDelete(playlist: Playlist): void {
    this.playlistDelete.emit(playlist);
  }

  onCreatePlaylist(): void {
    this.createPlaylist.emit();
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  onRetry(): void {
    this.loadPlaylists();
  }

  trackByPlaylistId(index: number, playlist: Playlist): string {
    return playlist.id;
  }

  getEmptyStateTitle(): string {
    if (this.searchTerm.trim()) {
      return 'No se encontraron playlists';
    }
    return 'No tienes playlists';
  }

  getEmptyStateMessage(): string {
    if (this.searchTerm.trim()) {
      return `No encontramos playlists que coincidan con "${this.searchTerm}"`;
    }
    return 'Crea tu primera playlist para organizar tu música favorita';
  }

  private async loadPlaylists(): Promise<void> {
    await this.playlistFacade.loadUserPlaylists();
  }

  private emitFilters(): void {
    const filters: PlaylistFilters = {};
    
    if (this.searchTerm.trim()) {
      filters.search = this.searchTerm.trim();
    }

    if (this.visibilityFilter) {
      filters.is_public = this.visibilityFilter === 'public';
    }

    this.filtersChanged.emit(filters);
  }
}
