import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="library-container p-6">
      <h1 class="text-3xl font-bold mb-8">Tu Biblioteca</h1>
      
      <div class="tabs mb-6">
        <button class="tab-button active">Playlists</button>
        <button class="tab-button">Artistas</button>
        <button class="tab-button">Álbumes</button>
      </div>
      
      <div class="content">
        <!-- Lista de elementos de la biblioteca -->
      </div>
    </div>
  `,
  styles: [`
    .tab-button {
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .tab-button.active {
      background: #3b82f6;
      color: white;
    }
  `]
})
export class LibraryComponent {
  constructor() {}
}
