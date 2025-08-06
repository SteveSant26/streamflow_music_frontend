import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LyricsService, SongLyricsResponse } from '../../../infrastructure/services/lyrics.service';
import { Song } from '../../../domain/entities/song.entity';

@Component({
  selector: 'app-song-lyrics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="lyrics-card">
      <mat-card-header>
        <div class="lyrics-header">
          <div class="song-info">
            <mat-card-title>{{ song()?.title || 'Canción' }}</mat-card-title>
            <mat-card-subtitle>{{ song()?.artist_name || 'Artista' }}</mat-card-subtitle>
          </div>
          
          <div class="lyrics-actions">
            @if (!isLoading() && !lyricsData()?.has_lyrics) {
              <button 
                mat-icon-button 
                (click)="searchLyrics()"
                [disabled]="isSearching()"
                matTooltip="Buscar letras">
                <mat-icon>search</mat-icon>
              </button>
            }
            
            @if (lyricsData()?.has_lyrics) {
              <button 
                mat-icon-button 
                (click)="refreshLyrics()"
                [disabled]="isSearching()"
                matTooltip="Actualizar letras">
                <mat-icon>refresh</mat-icon>
              </button>
            }
          </div>
        </div>
      </mat-card-header>

      <mat-card-content class="lyrics-content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando letras...</p>
          </div>
        } @else if (isSearching()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Buscando letras...</p>
          </div>
        } @else if (lyricsData()?.has_lyrics && lyricsData()?.lyrics) {
          <div class="lyrics-text">
            <pre>{{ lyricsData()?.lyrics }}</pre>
            @if (lyricsData()?.source) {
              <div class="lyrics-source">
                <small>Fuente: {{ getSourceName(lyricsData()?.source!) }}</small>
              </div>
            }
          </div>
        } @else if (hasSearched()) {
          <div class="no-lyrics">
            <mat-icon class="no-lyrics-icon">music_off</mat-icon>
            <h3>Letras no disponibles</h3>
            <p>No se encontraron letras para esta canción.</p>
            <button 
              mat-button 
              color="primary" 
              (click)="searchLyrics()"
              [disabled]="isSearching()">
              <mat-icon>search</mat-icon>
              Buscar de nuevo
            </button>
          </div>
        } @else {
          <div class="search-prompt">
            <mat-icon class="search-icon">lyrics</mat-icon>
            <h3>Ver letras</h3>
            <p>Haz clic para buscar las letras de esta canción.</p>
            <button 
              mat-button 
              color="primary" 
              (click)="searchLyrics()"
              [disabled]="isSearching()">
              <mat-icon>search</mat-icon>
              Buscar letras
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styleUrl: './song-lyrics.component.css'
})
export class SongLyricsComponent implements OnInit {
  @Input() song = signal<Song | null>(null);
  @Input() autoLoad = false;

  // Signals
  lyricsData = signal<SongLyricsResponse | null>(null);
  isLoading = signal(false);
  isSearching = signal(false);
  hasSearched = signal(false);
  error = signal<string | null>(null);

  // Computed
  hasLyrics = computed(() => this.lyricsData()?.has_lyrics ?? false);

  constructor(
    private lyricsService: LyricsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.autoLoad && this.song()?.id) {
      this.loadLyrics();
    }
  }

  loadLyrics() {
    const currentSong = this.song();
    if (!currentSong?.id) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.lyricsService.getSongLyrics(currentSong.id, false).subscribe({
      next: (response) => {
        this.lyricsData.set(response);
        this.isLoading.set(false);
        this.hasSearched.set(true);
      },
      error: (error) => {
        console.error('Error loading lyrics:', error);
        this.error.set('Error al cargar las letras');
        this.isLoading.set(false);
        this.hasSearched.set(true);
      }
    });
  }

  searchLyrics() {
    const currentSong = this.song();
    if (!currentSong?.id) return;

    this.isSearching.set(true);
    this.error.set(null);

    this.lyricsService.getSongLyrics(currentSong.id, true).subscribe({
      next: (response) => {
        this.lyricsData.set(response);
        this.isSearching.set(false);
        this.hasSearched.set(true);

        if (response.has_lyrics) {
          this.snackBar.open('¡Letras encontradas!', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open('No se encontraron letras para esta canción', 'Cerrar', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error searching lyrics:', error);
        this.error.set('Error al buscar las letras');
        this.isSearching.set(false);
        this.hasSearched.set(true);
        
        this.snackBar.open('Error al buscar letras', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  refreshLyrics() {
    const currentSong = this.song();
    if (!currentSong?.id) return;

    this.isSearching.set(true);
    this.error.set(null);

    this.lyricsService.updateSongLyrics(currentSong.id, true).subscribe({
      next: (response) => {
        if (response.updated) {
          // Actualizar los datos de letras
          this.lyricsData.set({
            song_id: response.song_id,
            title: response.title,
            artist: response.artist,
            lyrics: response.lyrics,
            has_lyrics: response.lyrics !== null,
            source: 'external'
          });
          
          this.snackBar.open('Letras actualizadas', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open('No se encontraron nuevas letras', 'Cerrar', {
            duration: 3000,
            panelClass: ['info-snackbar']
          });
        }
        
        this.isSearching.set(false);
      },
      error: (error) => {
        console.error('Error refreshing lyrics:', error);
        this.error.set('Error al actualizar las letras');
        this.isSearching.set(false);
        
        this.snackBar.open('Error al actualizar letras', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getSourceName(source: string): string {
    const sourceNames: { [key: string]: string } = {
      'database': 'Base de datos',
      'external': 'Búsqueda externa',
      'youtube': 'YouTube',
      'lyrics_ovh': 'Lyrics.ovh',
      'genius': 'Genius',
      'azlyrics': 'AZLyrics'
    };
    
    return sourceNames[source] || source;
  }
}
