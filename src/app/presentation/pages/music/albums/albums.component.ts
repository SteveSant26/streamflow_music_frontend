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
import { FormsModule } from '@angular/forms';

import { GetAllAlbumsUseCase } from '../../../../domain/usecases/album.usecases';
import { AlbumListItem } from '../../../../domain/entities/album.entity';
import { ROUTES_CONFIG_MUSIC } from '../../../../config/routes-config/routes-music.config';

@Component({
  selector: 'app-albums',
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
    FormsModule
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent implements OnInit {
  private readonly getAllAlbumsUseCase = inject(GetAllAlbumsUseCase);

  // Signals
  albums = signal<AlbumListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');
  sortBy = signal('title');

  // Computed
  filteredAlbums = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const albumsList = this.albums();
    
    if (!search) return albumsList;
    
    return albumsList.filter(album => 
      album.title.toLowerCase().includes(search) ||
      album.artist_name.toLowerCase().includes(search)
    );
  });

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.loading.set(true);
    this.error.set(null);

    this.getAllAlbumsUseCase.execute({
      ordering: this.sortBy(),
      page_size: 50
    }).subscribe({
      next: (albums) => {
        this.albums.set(albums);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading albums:', error);
        this.error.set('Error al cargar los álbumes. Por favor, inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.loadAlbums();
  }

  navigateToAlbum(albumId: string) {
    // Implementar navegación al detalle del álbum
    console.log('Navigate to album:', albumId);
  }

  getAlbumLink(albumId: string): string {
    return ROUTES_CONFIG_MUSIC.ALBUM.getLinkWithId(albumId);
  }
}
