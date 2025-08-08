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
import { FormsModule } from '@angular/forms';

import { GetAllArtistsUseCase } from '../../../../domain/usecases/artist.usecases';
import { ArtistListItem } from '../../../../domain/entities/artist.entity';
import { ROUTES_CONFIG_MUSIC } from '../../../../config/routes-config/routes-music.config';

@Component({
  selector: 'app-artists',
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
    FormsModule
  ],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent implements OnInit {
  private readonly getAllArtistsUseCase = inject(GetAllArtistsUseCase);

  // Signals
  artists = signal<ArtistListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');
  sortBy = signal('name');
  verifiedOnly = signal(false);

  // Computed
  filteredArtists = computed(() => {
    const search = this.searchTerm().toLowerCase();
    let artistsList = this.artists();
    
    // Filter by search term
    if (search) {
      artistsList = artistsList.filter(artist => 
        artist.name.toLowerCase().includes(search)
      );
    }

    // Filter by verified status
    if (this.verifiedOnly()) {
      artistsList = artistsList.filter(artist => artist.is_verified);
    }
    
    return artistsList;
  });

  ngOnInit() {
    this.loadArtists();
  }

  loadArtists() {
    this.loading.set(true);
    this.error.set(null);

    this.getAllArtistsUseCase.execute({
      ordering: this.sortBy(),
      page_size: 50,
      verified: this.verifiedOnly() || undefined
    }).subscribe({
      next: (artists) => {
        this.artists.set(artists);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading artists:', error);
        this.error.set('Error al cargar los artistas. Por favor, inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.loadArtists();
  }

  toggleVerifiedFilter() {
    this.verifiedOnly.set(!this.verifiedOnly());
    this.loadArtists();
  }

  navigateToArtist(artistId: string) {
    console.log('Navigate to artist:', artistId);
  }

  getArtistLink(artistId: string): string {
    return ROUTES_CONFIG_MUSIC.ARTIST.getLinkWithId(artistId);
  }

  formatFollowersCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }
}
