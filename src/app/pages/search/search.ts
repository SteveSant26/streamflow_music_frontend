import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Domain
import { Song } from '../../domain/entities/song.entity';
import { SearchSongsUseCase, PlaySongUseCase } from '../../domain/usecases/song/song.usecases';

// Components
import { MusicsTable } from '../../components/musics-table/musics-table';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, ReactiveFormsModule, MusicsTable],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  // Inyección de dependencias
  private readonly router = inject(Router);
  private readonly searchSongsUseCase = inject(SearchSongsUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);

  // Control de formulario para la búsqueda
  searchControl = new FormControl('');

  // Signals para el estado de la búsqueda
  searchResults = signal<Song[]>([]);
  isSearching = signal(false);
  hasSearched = signal(false);

  // Computed para verificar si hay resultados
  hasResults = computed(() => this.searchResults().length > 0);
  searchQuery = computed(() => this.searchControl.value || '');

  genres = [
    {
      nameKey: 'GENRES.ROCK',
      descriptionKey: 'GENRES.ROCK_DESC',
      name: 'Rock',
      color: 'from-red-500 to-orange-600',
    },
    {
      nameKey: 'GENRES.POP',
      descriptionKey: 'GENRES.POP_DESC',
      name: 'Pop',
      color: 'from-pink-500 to-purple-600',
    },
    {
      nameKey: 'GENRES.HIP_HOP',
      descriptionKey: 'GENRES.HIP_HOP_DESC',
      name: 'Hip Hop',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      nameKey: 'GENRES.ELECTRONIC',
      descriptionKey: 'GENRES.ELECTRONIC_DESC',
      name: 'Electronic',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      nameKey: 'GENRES.JAZZ',
      descriptionKey: 'GENRES.JAZZ_DESC',
      name: 'Jazz',
      color: 'from-amber-600 to-yellow-600',
    },
    {
      nameKey: 'GENRES.REGGAETON',
      descriptionKey: 'GENRES.REGGAETON_DESC',
      name: 'Reggaeton',
      color: 'from-green-500 to-emerald-600',
    },
    {
      nameKey: 'GENRES.CLASSICAL',
      descriptionKey: 'GENRES.CLASSICAL_DESC',
      name: 'Classical',
      color: 'from-indigo-500 to-purple-700',
    },
    {
      nameKey: 'GENRES.ALTERNATIVE',
      descriptionKey: 'GENRES.ALTERNATIVE_DESC',
      name: 'Alternative',
      color: 'from-gray-600 to-gray-800',
    },
  ];

  constructor() {
    // Configurar el observable de búsqueda con debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim().length < 2) {
            this.searchResults.set([]);
            this.hasSearched.set(false);
            this.isSearching.set(false);
            return of([]);
          }

          this.isSearching.set(true);
          return this.searchSongsUseCase.execute({ 
            q: query.trim(),
            include_youtube: false,
            limit: 50
          });
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (songs) => {
          this.searchResults.set(songs);
          this.hasSearched.set(true);
          this.isSearching.set(false);
        },
        error: (error) => {
          console.error('Error en la búsqueda:', error);
          this.searchResults.set([]);
          this.hasSearched.set(true);
          this.isSearching.set(false);
        }
      });
  }

  onSearch(query: string) {
    this.searchControl.setValue(query.trim());
  }

  onGenreClick(genre: string) {
    this.searchControl.setValue(genre);
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  playSong(song: Song): void {
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        console.log(`Reproduciendo: ${song.title} - ${song.artist}`);
      },
      error: (error) => {
        console.error('Error al reproducir canción:', error);
      }
    });
  }
}
