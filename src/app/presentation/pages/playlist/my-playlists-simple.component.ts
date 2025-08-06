import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import {
  GetMyPlaylistsUseCase,
  CreateMyPlaylistUseCase,
  DeleteMyPlaylistUseCase
} from '../../../domain/usecases/playlist/my-playlists.usecases';
import { Playlist } from '../../../domain/entities/playlist.entity';

@Component({
  selector: 'app-my-playlists',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="my-playlists-container">
      <!-- Header -->
      <div class="header">
        <h1>
          <mat-icon>library_music</mat-icon>
          Mis Playlists
        </h1>
        <p class="subtitle">
          Gestiona tus colecciones de música personalizadas
        </p>
        
        <button 
          mat-raised-button 
          color="primary"
          (click)="toggleCreateForm()">
          <mat-icon>add</mat-icon>
          Nueva Playlist
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-section" *ngIf="isLoading()">
        <mat-spinner></mat-spinner>
        <p>Cargando tus playlists...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading() && playlists().length === 0">
        <mat-icon class="empty-icon">library_music</mat-icon>
        <h3>No tienes playlists aún</h3>
        <p>Crea tu primera playlist para empezar a organizar tu música</p>
        <button 
          mat-raised-button 
          color="primary"
          (click)="toggleCreateForm()">
          <mat-icon>add</mat-icon>
          Crear mi primera playlist
        </button>
      </div>

      <!-- Playlists Grid -->
      <div class="playlists-grid" *ngIf="!isLoading() && playlists().length > 0">
        <mat-card 
          *ngFor="let playlist of playlists(); trackBy: trackByPlaylistId"
          class="playlist-card"
          (click)="viewPlaylist(playlist)">
          <mat-card-header>
            <mat-card-title>{{ playlist.name }}</mat-card-title>
            <mat-card-subtitle>
              {{ playlist.total_songs }} canciones • 
              {{ playlist.is_public ? 'Pública' : 'Privada' }}
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
              (click)="editPlaylist(playlist); $event.stopPropagation()">
              <mat-icon>edit</mat-icon>
            </button>
            <button 
              mat-icon-button 
              (click)="deletePlaylist(playlist); $event.stopPropagation()"
              color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Create Form (Simple) -->
      <div class="create-form-overlay" *ngIf="showCreateForm()" (click)="closeCreateForm()">
        <div class="create-form" (click)="$event.stopPropagation()">
          <h3>Nueva Playlist</h3>
          <p>Funcionalidad de creación próximamente...</p>
          <button mat-button (click)="closeCreateForm()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-playlists-container {
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

    .description {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .create-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .create-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      min-width: 300px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .my-playlists-container {
        padding: 1rem;
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
  showCreateForm = signal(false);

  ngOnInit() {
    this.loadPlaylists();
  }

  private async loadPlaylists() {
    this.isLoading.set(true);
    
    try {
      const response = await this.getMyPlaylistsUseCase.execute({
        page: 1,
        page_size: 50,
        ordering: '-created_at'
      }).toPromise();
      
      if (response) {
        this.playlists.set(response.results);
      }
    } catch (error) {
      console.error('Error loading my playlists:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  viewPlaylist(playlist: Playlist) {
    console.log('View playlist:', playlist.name);
    // TODO: Navigate to playlist detail
  }

  playPlaylist(playlist: Playlist) {
    console.log('Play playlist:', playlist.name);
    // TODO: Start playing playlist
  }

  editPlaylist(playlist: Playlist) {
    console.log('Edit playlist:', playlist.name);
    // TODO: Open edit form
  }

  async deletePlaylist(playlist: Playlist) {
    if (confirm(`¿Estás seguro de que quieres eliminar la playlist "${playlist.name}"?`)) {
      try {
        await this.deletePlaylistUseCase.execute(playlist.id).toPromise();
        this.playlists.update(current => current.filter(p => p.id !== playlist.id));
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Error al eliminar la playlist');
      }
    }
  }

  trackByPlaylistId(index: number, playlist: Playlist): string {
    return playlist.id;
  }
}
