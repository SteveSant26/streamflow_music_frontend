import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import {
  GetMyPlaylistsUseCase,
  CreateMyPlaylistUseCase,
  DeleteMyPlaylistUseCase
} from '../../../domain/usecases/playlist/my-playlists.usecases';
import { Playlist } from '../../../domain/entities/playlist.entity';
import { PlaylistFormComponent } from '../../components/playlist/playlist-form.component';
import { PlaylistCardComponent } from '../../components/playlist/playlist-card.component';

@Component({
  selector: 'app-my-playlists',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    PlaylistFormComponent,
    PlaylistCardComponent
  ],
  template: `
    <div class="my-playlists-container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <h1 class="title">
            <mat-icon>library_music</mat-icon>
            Mis Playlists
          </h1>
          <p class="subtitle">
            Gestiona tus colecciones de música personalizadas
          </p>
        </div>
        
        <div class="header-actions">
          <button 
            mat-fab 
            color="primary"
            (click)="showCreateForm.set(!showCreateForm())"
            class="create-btn">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section">
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Buscar en mis playlists</mat-label>
          <input 
            matInput 
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Nombre de playlist...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="filter-chips">
          <mat-chip-set>
            <mat-chip 
              [class.selected]="selectedFilter() === 'all'"
              (click)="applyFilter('all')">
              Todas ({{ totalPlaylists() }})
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'public'"
              (click)="applyFilter('public')">
              Públicas ({{ publicPlaylists() }})
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'private'"
              (click)="applyFilter('private')">
              Privadas ({{ privatePlaylists() }})
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Create Form -->
      <div class="create-form-section" *ngIf="showCreateForm()">
        <mat-card class="create-form-card">
          <mat-card-header>
            <mat-card-title>Nueva Playlist</mat-card-title>
            <button 
              mat-icon-button 
              (click)="showCreateForm.set(false)">
              <mat-icon>close</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <app-playlist-form
              [isVisible]="showCreateForm()"
              (playlistSaved)="onPlaylistCreated($event)"
              (formCancelled)="showCreateForm.set(false)">
            </app-playlist-form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading State -->
      <div class="loading-section" *ngIf="isLoading()">
        <mat-spinner></mat-spinner>
        <p>Cargando tus playlists...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading() && filteredPlaylists().length === 0">
        <mat-icon class="empty-icon">library_music</mat-icon>
        <h3>{{ getEmptyStateTitle() }}</h3>
        <p>{{ getEmptyStateMessage() }}</p>
        <button 
          mat-raised-button 
          color="primary"
          (click)="showCreateForm.set(true)"
          *ngIf="searchTerm() === ''">>
          <mat-icon>add</mat-icon>
          Crear mi primera playlist
        </button>
      </div>

      <!-- Playlists Grid -->
      <div class="playlists-grid" *ngIf="!isLoading() && filteredPlaylists().length > 0">
        <app-playlist-card
          *ngFor="let playlist of filteredPlaylists(); trackBy: trackByPlaylistId"
          [playlist]="playlist"
          [showActions]="true"
          [showVisibility]="true"
          (playlistSelected)="onPlaylistSelected($event)"
          (playlistEdit)="onEditPlaylist($event)"
          (playlistDelete)="onDeletePlaylist($event)">
        </app-playlist-card>
      </div>

      <!-- Load More Button -->
      <div class="load-more-section" *ngIf="hasMorePlaylists()">
        <button 
          mat-raised-button 
          (click)="loadMorePlaylists()"
          [disabled]="isLoadingMore()">
          <mat-spinner diameter="20" *ngIf="isLoadingMore()"></mat-spinner>
          {{ isLoadingMore() ? 'Cargando...' : 'Cargar más playlists' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .my-playlists-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .header-content .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .header-content .subtitle {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 1.1rem;
    }

    .create-btn {
      position: sticky;
      top: 2rem;
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
      margin-bottom: 1rem;
    }

    .filter-chips mat-chip {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .filter-chips mat-chip.selected {
      background-color: var(--mat-primary-500);
      color: white;
    }

    .create-form-section {
      margin-bottom: 2rem;
    }

    .create-form-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .create-form-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .loading-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: rgba(0, 0, 0, 0.3);
    }

    .playlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .load-more-section {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .my-playlists-container {
        padding: 1rem;
      }
      
      .header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .playlists-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyPlaylistsPageComponent implements OnInit {
  private readonly getMyPlaylistsUseCase = inject(GetMyPlaylistsUseCase);
  private readonly createPlaylistUseCase = inject(CreateMyPlaylistUseCase);
  private readonly deletePlaylistUseCase = inject(DeleteMyPlaylistUseCase);

  // State
  playlists = signal<Playlist[]>([]);
  isLoading = signal(false);
  isLoadingMore = signal(false);
  searchTerm = signal('');
  selectedFilter = signal<'all' | 'public' | 'private'>('all');
  showCreateForm = signal(false);
  currentPage = signal(1);
  hasMoreData = signal(false);

  // Computed values
  totalPlaylists = signal(0);
  publicPlaylists = signal(0);
  privatePlaylists = signal(0);

  filteredPlaylists = signal<Playlist[]>([]);

  ngOnInit() {
    this.loadPlaylists();
  }

  private async loadPlaylists(page = 1) {
    if (page === 1) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    try {
      const params = {
        page,
        page_size: 12,
        search: this.searchTerm() || undefined,
        ordering: '-created_at'
      };

      this.getMyPlaylistsUseCase.execute(params).subscribe({
        next: (response) => {
          if (response) {
            if (page === 1) {
              this.playlists.set(response.results);
            } else {
              this.playlists.update(current => [...current, ...response.results]);
            }
            
            this.hasMoreData.set(!!response.next);
            this.currentPage.set(page);
            this.updateCounters();
            this.applyCurrentFilter();
          }
        },
        error: (error) => {
          console.error('Error loading my playlists:', error);
        },
        complete: () => {
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        }
      });
    } catch (error) {
      console.error('Error loading my playlists:', error);
      this.isLoading.set(false);
      this.isLoadingMore.set(false);
    }
  }

  private updateCounters() {
    const playlists = this.playlists();
    this.totalPlaylists.set(playlists.length);
    this.publicPlaylists.set(playlists.filter(p => p.is_public).length);
    this.privatePlaylists.set(playlists.filter(p => !p.is_public).length);
  }

  private applyCurrentFilter() {
    const filter = this.selectedFilter();
    const search = this.searchTerm().toLowerCase();
    
    let filtered = this.playlists();
    
    // Apply filter
    if (filter === 'public') {
      filtered = filtered.filter(p => p.is_public);
    } else if (filter === 'private') {
      filtered = filtered.filter(p => !p.is_public);
    }
    
    // Apply search
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    
    this.filteredPlaylists.set(filtered);
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.applyCurrentFilter();
  }

  applyFilter(filter: 'all' | 'public' | 'private') {
    this.selectedFilter.set(filter);
    this.applyCurrentFilter();
  }

  async loadMorePlaylists() {
    if (this.hasMoreData() && !this.isLoadingMore()) {
      await this.loadPlaylists(this.currentPage() + 1);
    }
  }

  hasMorePlaylists(): boolean {
    return this.hasMoreData() && !this.isLoading();
  }

  async onPlaylistCreated(playlist: Playlist) {
    this.playlists.update(current => [playlist, ...current]);
    this.showCreateForm.set(false);
    this.updateCounters();
    this.applyCurrentFilter();
  }

  onPlaylistSelected(playlist: Playlist) {
    // Navigate to playlist detail
    console.log('Navigate to playlist:', playlist.id);
  }

  onEditPlaylist(playlist: Playlist) {
    // Open edit form
    console.log('Edit playlist:', playlist.id);
  }

  async onDeletePlaylist(playlist: Playlist) {
    if (confirm(`¿Estás seguro de que quieres eliminar la playlist "${playlist.name}"?`)) {
      try {
        this.deletePlaylistUseCase.execute(playlist.id).subscribe({
          next: () => {
            this.playlists.update(current => current.filter(p => p.id !== playlist.id));
            this.updateCounters();
            this.applyCurrentFilter();
          },
          error: (error) => {
            console.error('Error deleting playlist:', error);
          }
        });
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  }

  onAddSongs(playlist: Playlist) {
    // Open add songs dialog
    console.log('Add songs to playlist:', playlist.id);
  }

  trackByPlaylistId(index: number, playlist: Playlist): string {
    return playlist.id;
  }

  getEmptyStateTitle(): string {
    if (this.searchTerm()) {
      return 'No se encontraron playlists';
    }
    if (this.selectedFilter() === 'public') {
      return 'No tienes playlists públicas';
    }
    if (this.selectedFilter() === 'private') {
      return 'No tienes playlists privadas';
    }
    return 'No tienes playlists aún';
  }

  getEmptyStateMessage(): string {
    if (this.searchTerm()) {
      return `No hay playlists que coincidan con "${this.searchTerm()}"`;
    }
    if (this.selectedFilter() === 'public') {
      return 'Marca alguna de tus playlists como pública para que otros puedan descubrirla';
    }
    if (this.selectedFilter() === 'private') {
      return 'Crea playlists privadas para tu uso personal';
    }
    return 'Crea tu primera playlist para empezar a organizar tu música';
  }
}
