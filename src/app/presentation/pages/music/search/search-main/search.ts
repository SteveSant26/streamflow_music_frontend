import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Domain
import { Song } from '@app/domain/entities/song.entity';
import { SearchSongsPaginatedUseCase, PlaySongUseCase } from '@app/domain/usecases/song/song.usecases';
import { SongSearchParams } from '@app/domain/dtos/song.dto';

// Components
import { MusicsTable } from '@app/presentation/components/music';
import { SearchFiltersComponent } from '@app/presentation/components/music/search-filters/search-filters.component';

// Services and Directives
import { SearchFiltersService } from '@app/infrastructure/services/search-filters.service';
import { InfiniteScrollDirective } from '@app/shared/directives/infinite-scroll.directive';

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatIconModule, 
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule, 
    MusicsTable,
    SearchFiltersComponent,
    InfiniteScrollDirective
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  // Inyección de dependencias
  private readonly router = inject(Router);
  private readonly searchSongsPaginatedUseCase = inject(SearchSongsPaginatedUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  readonly searchFiltersService = inject(SearchFiltersService);

  // Control de formulario para la búsqueda
  searchControl = new FormControl('');

  // Signals para el estado de la búsqueda
  searchResults = signal<Song[]>([]);
  isSearching = signal(false);
  isLoadingMore = signal(false);
  hasSearched = signal(false);
  showFilters = signal(false);
  pagination = signal<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 0,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false,
  });

  // Computed para verificar si hay resultados
  hasResults = computed(() => this.searchResults().length > 0);
  searchQuery = computed(() => this.searchControl.value || '');
  hasMoreResults = computed(() => this.pagination().hasNext);
  isLoading = computed(() => this.isSearching() || this.isLoadingMore());

  ngOnInit() {
    // Configurar búsqueda automática con debounce
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim().length < 2) {
            this.resetSearch();
            return of(null);
          }
          
          // Crear un observable que llame a performSearch
          this.isSearching.set(true);
          const currentPage = 1;
          
          const searchParams: SongSearchParams = {
            ...this.searchFiltersService.buildSearchParams(),
            search: query,
            page: currentPage,
            page_size: 20,
            include_youtube: true,
          };

          return this.searchSongsPaginatedUseCase.execute(searchParams);
        }),
        catchError((error) => {
          console.error('Error en búsqueda:', error);
          this.isSearching.set(false);
          return of({ songs: [], pagination: this.pagination() });
        })
      )
      .subscribe((result) => {
        if (result) {
          this.searchResults.set(result.songs);
          this.pagination.set(result.pagination);
          this.hasSearched.set(true);
        }
        this.isSearching.set(false);
      });
  }

  private resetSearch() {
    this.searchResults.set([]);
    this.hasSearched.set(false);
    this.pagination.set({
      count: 0,
      next: null,
      previous: null,
      currentPage: 1,
      totalPages: 0,
      pageSize: 20,
      hasNext: false,
      hasPrevious: false,
    });
  }

  private performSearch(query: string, isNewSearch = false) {
    if (isNewSearch) {
      this.isSearching.set(true);
      this.searchResults.set([]);
    } else {
      this.isLoadingMore.set(true);
    }

    const currentPage = isNewSearch ? 1 : this.pagination().currentPage + 1;
    
    // Construir parámetros de búsqueda combinando query y filtros
    const searchParams: SongSearchParams = {
      ...this.searchFiltersService.buildSearchParams(),
      search: query,
      page: currentPage,
      page_size: 20,
      include_youtube: true, // Siempre incluir YouTube
    };

    this.searchSongsPaginatedUseCase.execute(searchParams)
      .pipe(
        catchError((error) => {
          console.error('Error en búsqueda:', error);
          return of({ songs: [], pagination: this.pagination() });
        }),
        finalize(() => {
          this.isSearching.set(false);
          this.isLoadingMore.set(false);
        })
      )
      .subscribe(({ songs, pagination }) => {
        if (isNewSearch) {
          this.searchResults.set(songs);
        } else {
          this.searchResults.update(current => [...current, ...songs]);
        }
        
        this.pagination.set(pagination);
        this.hasSearched.set(true);
      });
  }

  onLoadMore() {
    const query = this.searchControl.value;
    if (query && this.hasMoreResults() && !this.isLoading()) {
      this.performSearch(query, false);
    }
  }

  onFiltersChanged() {
    const query = this.searchControl.value;
    if (query && query.trim().length >= 2) {
      this.performSearch(query, true);
    }
  }

  toggleFilters() {
    this.showFilters.update(current => !current);
  }

  onGenreClick(genreName: string) {
    this.searchFiltersService.updateFilter('content', 'genre_name', genreName);
    this.searchControl.setValue(genreName);
  }

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

  onSearch(query: string) {
    this.searchControl.setValue(query.trim());
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  playSong(song: Song): void {
    this.playSongUseCase.executeSimple(song.id).subscribe({
      next: () => {
        console.log(`Reproduciendo: ${song.title} - ${song.artist_name}`);
      },
      error: (error) => {
        console.error('Error al reproducir canción:', error);
      }
    });
  }
}
