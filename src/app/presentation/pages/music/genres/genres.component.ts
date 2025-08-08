import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { GetAllGenresUseCase } from '../../../../domain/usecases/genre.usecases';
import { GenreListItem } from '../../../../domain/entities/genre.entity';
import { ROUTES_CONFIG_MUSIC } from '../../../../config/routes-config/routes-music.config';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent implements OnInit {
  private readonly getAllGenresUseCase = inject(GetAllGenresUseCase);
  private readonly translateService = inject(TranslateService);

  // Signals
  genres = signal<GenreListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');
  sortBy = signal('name');
  viewMode = signal<'grid' | 'chips'>('grid');

  // Computed
  filteredGenres = computed(() => {
    const search = this.searchTerm().toLowerCase();
    let genresList = this.genres();
    
    if (search) {
      genresList = genresList.filter(genre => 
        genre.name.toLowerCase().includes(search) ||
        genre.description?.toLowerCase().includes(search)
      );
    }
    
    return genresList;
  });

  ngOnInit() {
    this.loadGenres();
  }

  loadGenres() {
    this.loading.set(true);
    this.error.set(null);

    this.getAllGenresUseCase.execute({
      ordering: this.sortBy(),
      page_size: 100
    }).subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.error.set(this.translateService.instant('ERRORS.LOAD_GENRES_FULL'));
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.loadGenres();
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'chips' : 'grid');
  }

  navigateToGenre(genreId: string) {
    console.log('Navigate to genre:', genreId);
  }

  getGenreLink(genreId: string): string {
    return ROUTES_CONFIG_MUSIC.GENRE.getLinkWithId(genreId);
  }

  getGenreColor(genre: GenreListItem): string {
    return genre.color || '#e0e0e0';
  }
}
