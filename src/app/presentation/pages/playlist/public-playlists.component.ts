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
import { MatTabsModule } from '@angular/material/tabs';

import {
  GetPublicPlaylistsUseCase,
  SearchPublicPlaylistsUseCase,
  GetPopularPublicPlaylistsUseCase
} from '../../../domain/usecases/playlist/public-playlists.usecases';
import { Playlist } from '../../../domain/entities/playlist.entity';

@Component({
  selector: 'app-public-playlists',
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
    MatTabsModule
  ],
  template: `
    <div class="public-playlists-container">
      <!-- Header -->
      <div class="header">
        <h1>
          <mat-icon>public</mat-icon>
          Descubrir Playlists
        </h1>
        <p class="subtitle">
          Explora playlists públicas creadas por la comunidad
        </p>
      </div>

      <!-- Search -->
      <div class="search-section">
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Buscar playlists públicas</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchTerm" 
            (keyup.enter)="performSearch()"
            placeholder="Nombre de playlist, género, artista...">
          <button matSuffix mat-icon-button (click)="performSearch()">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <!-- Tabs -->
      <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
        <!-- Tab: Todas -->
        <mat-tab label="Todas">
          <div class="tab-content">
            <div class="loading-section" *ngIf="isLoadingAll()">
              <mat-spinner></mat-spinner>
              <p>Cargando playlists...</p>
            </div>

            <div class="empty-state" *ngIf="!isLoadingAll() && allPlaylists().length === 0">
              <mat-icon class="empty-icon">public</mat-icon>
              <h3>No se encontraron playlists</h3>
              <p>No hay playlists públicas disponibles en este momento</p>
            </div>

            <div class="playlists-grid" *ngIf="!isLoadingAll() && allPlaylists().length > 0">
              <mat-card 
                *ngFor="let playlist of allPlaylists(); trackBy: trackByPlaylistId"
                class="playlist-card"
                (click)="viewPlaylist(playlist)">
                <mat-card-header>
                  <mat-card-title>{{ playlist.name }}</mat-card-title>
                  <mat-card-subtitle>
                    {{ playlist.total_songs }} canciones • Por {{ getUserName(playlist) }}
                  </mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content *ngIf="playlist.description">
                  <p class="description">{{ playlist.description }}</p>
                </mat-card-content>
                
                <mat-card-actions>
                  <button 
                    mat-icon-button 
                    (click)="playPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="viewPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Populares -->
        <mat-tab label="Populares">
          <div class="tab-content">
            <div class="loading-section" *ngIf="isLoadingPopular()">
              <mat-spinner></mat-spinner>
              <p>Cargando playlists populares...</p>
            </div>

            <div class="empty-state" *ngIf="!isLoadingPopular() && popularPlaylists().length === 0">
              <mat-icon class="empty-icon">trending_up</mat-icon>
              <h3>No hay playlists populares</h3>
              <p>Aún no hay playlists populares disponibles</p>
            </div>

            <div class="playlists-grid" *ngIf="!isLoadingPopular() && popularPlaylists().length > 0">
              <mat-card 
                *ngFor="let playlist of popularPlaylists(); trackBy: trackByPlaylistId"
                class="playlist-card popular"
                (click)="viewPlaylist(playlist)">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon class="popular-icon">trending_up</mat-icon>
                    {{ playlist.name }}
                  </mat-card-title>
                  <mat-card-subtitle>
                    {{ playlist.total_songs }} canciones • Por {{ getUserName(playlist) }}
                  </mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content *ngIf="playlist.description">
                  <p class="description">{{ playlist.description }}</p>
                </mat-card-content>
                
                <mat-card-actions>
                  <button 
                    mat-icon-button 
                    (click)="playPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="viewPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Resultados de Búsqueda -->
        <mat-tab label="Búsqueda" *ngIf="hasSearchResults()">
          <div class="tab-content">
            <div class="search-info">
              <p>Resultados para: "<strong>{{ lastSearchTerm() }}</strong>"</p>
              <button mat-button (click)="clearSearch()">
                <mat-icon>clear</mat-icon>
                Limpiar búsqueda
              </button>
            </div>

            <div class="loading-section" *ngIf="isLoadingSearch()">
              <mat-spinner></mat-spinner>
              <p>Buscando playlists...</p>
            </div>

            <div class="empty-state" *ngIf="!isLoadingSearch() && searchResults().length === 0">
              <mat-icon class="empty-icon">search_off</mat-icon>
              <h3>No se encontraron resultados</h3>
              <p>No hay playlists que coincidan con tu búsqueda</p>
            </div>

            <div class="playlists-grid" *ngIf="!isLoadingSearch() && searchResults().length > 0">
              <mat-card 
                *ngFor="let playlist of searchResults(); trackBy: trackByPlaylistId"
                class="playlist-card"
                (click)="viewPlaylist(playlist)">
                <mat-card-header>
                  <mat-card-title>{{ playlist.name }}</mat-card-title>
                  <mat-card-subtitle>
                    {{ playlist.total_songs }} canciones • Por {{ getUserName(playlist) }}
                  </mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content *ngIf="playlist.description">
                  <p class="description">{{ playlist.description }}</p>
                </mat-card-content>
                
                <mat-card-actions>
                  <button 
                    mat-icon-button 
                    (click)="playPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="viewPlaylist(playlist); $event.stopPropagation()">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .public-playlists-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      margin-bottom: 1.5rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .search-section {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .tab-content {
      padding-top: 1.5rem;
    }

    .search-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .playlist-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .playlist-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .playlist-card.popular {
      border: 2px solid #ff9800;
    }

    .popular-icon {
      color: #ff9800;
      margin-right: 0.5rem;
    }

    .description {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .public-playlists-container {
        padding: 1rem;
      }
      
      .playlists-grid {
        grid-template-columns: 1fr;
      }

      .search-info {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    }
  `]
})
export class PublicPlaylistsPageComponent implements OnInit {
  private readonly getPublicPlaylistsUseCase = inject(GetPublicPlaylistsUseCase);
  private readonly searchPublicPlaylistsUseCase = inject(SearchPublicPlaylistsUseCase);
  private readonly getPopularPlaylistsUseCase = inject(GetPopularPublicPlaylistsUseCase);

  // State
  allPlaylists = signal<Playlist[]>([]);
  popularPlaylists = signal<Playlist[]>([]);
  searchResults = signal<Playlist[]>([]);
  
  isLoadingAll = signal(false);
  isLoadingPopular = signal(false);
  isLoadingSearch = signal(false);
  
  searchTerm = '';
  lastSearchTerm = signal('');
  selectedTabIndex = signal(0);

  ngOnInit() {
    this.loadAllPlaylists();
  }

  private async loadAllPlaylists() {
    this.isLoadingAll.set(true);
    
    try {
      const response = await this.getPublicPlaylistsUseCase.execute({
        page: 1,
        page_size: 50,
        ordering: '-created_at'
      }).toPromise();
      
      if (response) {
        this.allPlaylists.set(response.results);
      }
    } catch (error) {
      console.error('Error loading public playlists:', error);
    } finally {
      this.isLoadingAll.set(false);
    }
  }

  private async loadPopularPlaylists() {
    this.isLoadingPopular.set(true);
    
    try {
      const response = await this.getPopularPlaylistsUseCase.execute({
        page: 1,
        page_size: 20
      }).toPromise();
      
      if (response) {
        this.popularPlaylists.set(response.results);
      }
    } catch (error) {
      console.error('Error loading popular playlists:', error);
    } finally {
      this.isLoadingPopular.set(false);
    }
  }

  async performSearch() {
    if (!this.searchTerm.trim()) return;
    
    this.isLoadingSearch.set(true);
    this.lastSearchTerm.set(this.searchTerm);
    
    try {
      const response = await this.searchPublicPlaylistsUseCase.execute(
        this.searchTerm,
        { page: 1, page_size: 50 }
      ).toPromise();
      
      if (response) {
        this.searchResults.set(response.results);
        // Cambiar a la tab de búsqueda
        this.selectedTabIndex.set(2);
      }
    } catch (error) {
      console.error('Error searching playlists:', error);
    } finally {
      this.isLoadingSearch.set(false);
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.lastSearchTerm.set('');
    this.searchResults.set([]);
    this.selectedTabIndex.set(0);
  }

  hasSearchResults(): boolean {
    return this.lastSearchTerm().length > 0;
  }

  onTabChange(index: number) {
    this.selectedTabIndex.set(index);
    
    // Cargar datos según la tab seleccionada
    if (index === 1 && this.popularPlaylists().length === 0) {
      this.loadPopularPlaylists();
    }
  }

  viewPlaylist(playlist: Playlist) {
    console.log('View public playlist:', playlist.name);
    // Navegar a la vista detallada de la playlist (solo lectura)
  }

  playPlaylist(playlist: Playlist) {
    console.log('Play public playlist:', playlist.name);
    // Reproducir playlist pública
  }

  getUserName(playlist: Playlist): string {
    // En la API real, esto vendría en los datos de la playlist
    return 'Usuario'; // Placeholder
  }

  trackByPlaylistId(index: number, playlist: Playlist): string {
    return playlist.id;
  }
}
