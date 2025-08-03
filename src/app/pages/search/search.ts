import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: "app-search",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./search.html",
  styleUrl: "./search.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  searchQuery = "";

  genres = [
    {
      nameKey: "GENRES.ROCK",
      descriptionKey: "GENRES.ROCK_DESC",
      name: "Rock",
      color: "from-red-500 to-orange-600",
    },
    {
      nameKey: "GENRES.POP",
      descriptionKey: "GENRES.POP_DESC",
      name: "Pop",
      color: "from-pink-500 to-purple-600",
    },
    {
      nameKey: "GENRES.HIP_HOP",
      descriptionKey: "GENRES.HIP_HOP_DESC",
      name: "Hip Hop",
      color: "from-yellow-500 to-orange-500",
    },
    {
      nameKey: "GENRES.ELECTRONIC",
      descriptionKey: "GENRES.ELECTRONIC_DESC",
      name: "Electronic",
      color: "from-blue-500 to-cyan-500",
    },
    {
      nameKey: "GENRES.JAZZ",
      descriptionKey: "GENRES.JAZZ_DESC",
      name: "Jazz",
      color: "from-amber-600 to-yellow-600",
    },
    {
      nameKey: "GENRES.REGGAETON",
      descriptionKey: "GENRES.REGGAETON_DESC",
      name: "Reggaeton",
      color: "from-green-500 to-emerald-600",
    },
    {
      nameKey: "GENRES.CLASSICAL",
      descriptionKey: "GENRES.CLASSICAL_DESC",
      name: "Classical",
      color: "from-indigo-500 to-purple-700",
    },
    {
      nameKey: "GENRES.ALTERNATIVE",
      descriptionKey: "GENRES.ALTERNATIVE_DESC",
      name: "Alternative",
      color: "from-gray-600 to-gray-800",
    },
  ];

  constructor() {}

  onSearch(query: string) {
    this.searchQuery = query.trim();
    if (this.searchQuery) {
      // Implementar lógica de búsqueda
      console.log("Buscando:", this.searchQuery);
    }
  }

  onGenreClick(genre: string) {
    this.searchQuery = genre;
    // Simular búsqueda por género
    console.log("Búsqueda por género:", genre);
  }

  clearSearch() {
    this.searchQuery = "";
  }
}
