import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Playlist, CreatePlaylistDto, UpdatePlaylistDto } from '../../../domain/entities/playlist.entity';
import { PlaylistFacadeService } from '../../../domain/services/playlist-facade.service';
import { 
  PlaylistListComponent, 
  PlaylistFormComponent
} from '../../components/playlist';

@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [
    CommonModule,
    PlaylistListComponent,
    PlaylistFormComponent
  ],
  template: `
    <div class="playlist-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Mis Playlists</h1>
          <p class="page-subtitle">
            Organiza tu música en colecciones personalizadas
          </p>
        </div>
        
        <!-- Stats -->
        <div class="stats-grid" *ngIf="hasPlaylists()">
          <div class="stat-card">
            <div class="stat-value">{{ playlistStats().totalPlaylists }}</div>
            <div class="stat-label">Playlists</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ playlistStats().totalSongs }}</div>
            <div class="stat-label">Canciones</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ playlistStats().publicPlaylistsCount }}</div>
            <div class="stat-label">Públicas</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="page-content">
        
        <!-- Playlist List -->
        <app-playlist-list
          [title]="'Todas las Playlists'"
          [playlists]="userPlaylists()"
          [showControls]="true"
          [showCreateButton]="true"
          [showPlaylistActions]="true"
          [showVisibility]="true"
          (playlistSelected)="onPlaylistSelected($event)"
          (playlistPlay)="onPlaylistPlay($event)"
          (playlistEdit)="onPlaylistEdit($event)"
          (playlistDuplicate)="onPlaylistDuplicate($event)"
          (playlistDelete)="onPlaylistDelete($event)"
          (createPlaylist)="onCreatePlaylist()"
          (filtersChanged)="onFiltersChanged($event)"
        />

      </div>

      <!-- Modals -->
      
      <!-- Create/Edit Playlist Modal -->
      <div class="modal-overlay" *ngIf="showPlaylistForm()" (click)="closePlaylistForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <app-playlist-form
            [playlist]="selectedForEdit()"
            [isVisible]="showPlaylistForm()"
            (playlistSaved)="onPlaylistSaved($event)"
            (formCancelled)="closePlaylistForm()"
          />
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showDeleteConfirmation()" (click)="closeDeleteConfirmation()">
        <div class="modal-content confirmation-modal" (click)="$event.stopPropagation()">
          <div class="confirmation-header">
            <h3 class="confirmation-title">Confirmar eliminación</h3>
          </div>
          
          <div class="confirmation-body">
            <div class="warning-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p class="confirmation-message">
              ¿Estás seguro de que quieres eliminar la playlist 
              <strong>"{{ selectedForDelete()?.name }}"</strong>?
            </p>
            <p class="confirmation-warning">
              Esta acción no se puede deshacer.
            </p>
          </div>
          
          <div class="confirmation-actions">
            <button 
              class="btn btn-secondary"
              (click)="closeDeleteConfirmation()"
              [disabled]="isDeleting()">
              Cancelar
            </button>
            <button 
              class="btn btn-danger"
              (click)="confirmDelete()"
              [disabled]="isDeleting()">
              <i class="fas fa-sync fa-spin" *ngIf="isDeleting()"></i>
              <i class="fas fa-trash" *ngIf="!isDeleting()"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Toast notifications -->
      <div class="toast-container">
        <div 
          class="toast toast-success" 
          *ngIf="showSuccessToast()"
          [@slideIn]>
          <i class="fas fa-check-circle"></i>
          <span>{{ successMessage() }}</span>
          <button class="toast-close" (click)="hideSuccessToast()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlist-page {
      @apply min-h-screen bg-gray-50 dark:bg-gray-900;
    }

    .page-header {
      @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-8;
    }

    .header-content {
      @apply max-w-7xl mx-auto mb-6;
    }

    .page-title {
      @apply text-3xl font-bold text-gray-900 dark:text-white mb-2;
    }

    .page-subtitle {
      @apply text-lg text-gray-600 dark:text-gray-300;
    }

    .stats-grid {
      @apply max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4;
    }

    .stat-card {
      @apply bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center;
    }

    .stat-value {
      @apply text-2xl font-bold text-blue-600 dark:text-blue-400;
    }

    .stat-label {
      @apply text-sm text-gray-600 dark:text-gray-300 mt-1;
    }

    .page-content {
      @apply max-w-7xl mx-auto px-6 py-8;
    }

    .modal-overlay {
      @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
    }

    .modal-content {
      @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto;
    }

    .confirmation-modal {
      @apply max-w-sm;
    }

    .confirmation-header {
      @apply p-6 border-b border-gray-200 dark:border-gray-700;
    }

    .confirmation-title {
      @apply text-lg font-semibold text-gray-900 dark:text-white;
    }

    .confirmation-body {
      @apply p-6 text-center space-y-4;
    }

    .warning-icon {
      @apply text-4xl text-yellow-500;
    }

    .confirmation-message {
      @apply text-gray-700 dark:text-gray-300;
    }

    .confirmation-warning {
      @apply text-sm text-gray-500 dark:text-gray-400;
    }

    .confirmation-actions {
      @apply flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700;
    }

    .btn {
      @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
      @apply flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .btn-secondary {
      @apply bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200;
      @apply hover:bg-gray-400 dark:hover:bg-gray-500;
    }

    .btn-danger {
      @apply bg-red-600 text-white hover:bg-red-700;
    }

    .toast-container {
      @apply fixed bottom-4 right-4 z-50;
    }

    .toast {
      @apply flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-l-4;
      @apply min-w-80 max-w-md;
    }

    .toast-success {
      @apply border-green-500 text-green-700 dark:text-green-300;
    }

    .toast-close {
      @apply ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200;
    }
  `],
  animations: [
    // Add slide-in animation for toasts
  ]
})
export class PlaylistPageComponent implements OnInit {
  private readonly playlistFacade = inject(PlaylistFacadeService);

  // State signals
  private readonly showPlaylistFormSignal = signal<boolean>(false);
  private readonly showDeleteConfirmationSignal = signal<boolean>(false);
  private readonly selectedForEditSignal = signal<Playlist | null>(null);
  private readonly selectedForDeleteSignal = signal<Playlist | null>(null);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly showSuccessToastSignal = signal<boolean>(false);
  private readonly successMessageSignal = signal<string>('');

  // Facade state
  readonly userPlaylists = this.playlistFacade.userPlaylists;
  readonly isLoading = this.playlistFacade.isLoading;
  readonly error = this.playlistFacade.error;

  // Computed properties
  readonly showPlaylistForm = this.showPlaylistFormSignal.asReadonly();
  readonly showDeleteConfirmation = this.showDeleteConfirmationSignal.asReadonly();
  readonly selectedForEdit = this.selectedForEditSignal.asReadonly();
  readonly selectedForDelete = this.selectedForDeleteSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly showSuccessToast = this.showSuccessToastSignal.asReadonly();
  readonly successMessage = this.successMessageSignal.asReadonly();

  readonly hasPlaylists = () => this.userPlaylists().length > 0;
  readonly playlistStats = () => this.playlistFacade.getPlaylistStats();

  ngOnInit(): void {
    this.loadPlaylists();
    this.setupEventListeners();
  }

  // Event handlers
  onPlaylistSelected(playlist: Playlist): void {
    this.playlistFacade.selectPlaylist(playlist.id);
  }

  onPlaylistPlay(playlist: Playlist): void {
    // Integrate with existing player service
    console.log('Playing playlist:', playlist.name);
    this.showToast(`Reproduciendo "${playlist.name}"`);
  }

  onPlaylistEdit(playlist: Playlist): void {
    this.selectedForEditSignal.set(playlist);
    this.showPlaylistFormSignal.set(true);
  }

  onPlaylistDuplicate(playlist: Playlist): void {
    this.duplicatePlaylist(playlist);
  }

  onPlaylistDelete(playlist: Playlist): void {
    this.selectedForDeleteSignal.set(playlist);
    this.showDeleteConfirmationSignal.set(true);
  }

  onCreatePlaylist(): void {
    this.selectedForEditSignal.set(null);
    this.showPlaylistFormSignal.set(true);
  }

  onPlaylistSaved(playlist: Playlist): void {
    this.closePlaylistForm();
    const isEdit = this.selectedForEdit() !== null;
    const message = isEdit 
      ? `Playlist "${playlist.name}" actualizada`
      : `Playlist "${playlist.name}" creada`;
    this.showToast(message);
  }

  onFiltersChanged(filters: any): void {
    this.playlistFacade.setFilters(filters);
  }

  // Modal controls
  closePlaylistForm(): void {
    this.showPlaylistFormSignal.set(false);
    this.selectedForEditSignal.set(null);
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmationSignal.set(false);
    this.selectedForDeleteSignal.set(null);
  }

  async confirmDelete(): Promise<void> {
    const playlist = this.selectedForDelete();
    if (!playlist) return;

    this.isDeletingSignal.set(true);

    try {
      const success = await this.playlistFacade.deletePlaylist(playlist.id);
      if (success) {
        this.showToast(`Playlist "${playlist.name}" eliminada`);
        this.closeDeleteConfirmation();
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    } finally {
      this.isDeletingSignal.set(false);
    }
  }

  // Toast controls
  hideSuccessToast(): void {
    this.showSuccessToastSignal.set(false);
  }

  private showToast(message: string): void {
    this.successMessageSignal.set(message);
    this.showSuccessToastSignal.set(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hideSuccessToast();
    }, 3000);
  }

  // Private methods
  private async loadPlaylists(): Promise<void> {
    await this.playlistFacade.loadUserPlaylists();
  }

  private async duplicatePlaylist(playlist: Playlist): Promise<void> {
    const newName = `${playlist.name} (Copia)`;
    const result = await this.playlistFacade.duplicatePlaylist(playlist.id, newName);
    
    if (result) {
      this.showToast(`Playlist duplicada como "${result.name}"`);
    }
  }

  private setupEventListeners(): void {
    // Listen to domain events
    this.playlistFacade.onPlaylistCreated().subscribe(playlist => {
      console.log('Playlist created event:', playlist);
    });

    this.playlistFacade.onPlaylistUpdated().subscribe(playlist => {
      console.log('Playlist updated event:', playlist);
    });

    this.playlistFacade.onPlaylistDeleted().subscribe(({ id }) => {
      console.log('Playlist deleted event:', id);
    });
  }
}
