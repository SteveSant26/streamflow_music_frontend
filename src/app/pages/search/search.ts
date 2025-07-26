import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent {
  searchQuery: string = '';
  
  genres = [
    { name: 'Rock', description: 'Clásicos y modernos', color: 'from-red-500 to-orange-600' },
    { name: 'Pop', description: 'Los hits del momento', color: 'from-pink-500 to-purple-600' },
    { name: 'Hip Hop', description: 'Rap y beats urbanos', color: 'from-yellow-500 to-orange-500' },
    { name: 'Electronic', description: 'EDM y synthwave', color: 'from-blue-500 to-cyan-500' },
    { name: 'Jazz', description: 'Smooth y clásico', color: 'from-amber-600 to-yellow-600' },
    { name: 'Reggaeton', description: 'Ritmos latinos', color: 'from-green-500 to-emerald-600' },
    { name: 'Classical', description: 'Música clásica', color: 'from-indigo-500 to-purple-700' },
    { name: 'Alternative', description: 'Indie y alternativo', color: 'from-gray-600 to-gray-800' }
  ];
  
  constructor() {}
  
  onSearch(query: string) {
    this.searchQuery = query.trim();
    if (this.searchQuery) {
      // Implementar lógica de búsqueda
      console.log('Buscando:', this.searchQuery);
    }
  }
  
  onGenreClick(genre: string) {
    this.searchQuery = genre;
    // Simular búsqueda por género
    console.log('Búsqueda por género:', genre);
  }
  
  clearSearch() {
    this.searchQuery = '';
  }
}
