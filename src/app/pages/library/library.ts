import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songCount: number;
  createdAt: Date;
}

interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  followers: string;
  isFollowing: boolean;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  image: string;
  songCount: number;
}

@Component({
  selector: "app-library",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./library.html",
  styleUrl: "./library.css",
})
export class LibraryComponent {
  activeTab: "playlists" | "artists" | "albums" = "playlists";

  // Modal state
  showCreateModal = false;

  // Form data for new playlist
  newPlaylist = {
    name: "",
    description: "",
    isPrivate: false,
  };

  // Mock data para playlists
  mockPlaylists: Playlist[] = [
    {
      id: "1",
      name: "Mi Playlist Favorita",
      description: "Las mejores canciones para relajarse",
      image: "https://picsum.photos/400/400?random=1",
      songCount: 25,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Música para Trabajar",
      description: "Concentración y productividad",
      image: "https://picsum.photos/400/400?random=2",
      songCount: 42,
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Road Trip Vibes",
      description: "Para esos viajes largos en carretera",
      image: "https://picsum.photos/400/400?random=3",
      songCount: 18,
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "Chill Evening",
      description: "Perfecta para las noches tranquilas",
      image: "https://picsum.photos/400/400?random=4",
      songCount: 31,
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Workout Energy",
      description: "Música enérgica para el gimnasio",
      image: "https://picsum.photos/400/400?random=5",
      songCount: 20,
      createdAt: new Date(),
    },
    {
      id: "6",
      name: "Sunday Morning",
      description: "Despertar con buena música",
      image: "https://picsum.photos/400/400?random=6",
      songCount: 15,
      createdAt: new Date(),
    },
  ];

  // Mock data para artistas
  mockArtists: Artist[] = [
    {
      id: "1",
      name: "Arctic Monkeys",
      genre: "Indie Rock",
      image: "https://picsum.photos/400/400?random=11",
      followers: "2.4M",
      isFollowing: true,
    },
    {
      id: "2",
      name: "Billie Eilish",
      genre: "Pop Alternativo",
      image: "https://picsum.photos/400/400?random=12",
      followers: "8.1M",
      isFollowing: true,
    },
    {
      id: "3",
      name: "The Weeknd",
      genre: "R&B",
      image: "https://picsum.photos/400/400?random=13",
      followers: "6.7M",
      isFollowing: false,
    },
    {
      id: "4",
      name: "Tame Impala",
      genre: "Psychedelic Pop",
      image: "https://picsum.photos/400/400?random=14",
      followers: "1.8M",
      isFollowing: true,
    },
    {
      id: "5",
      name: "Dua Lipa",
      genre: "Pop",
      image: "https://picsum.photos/400/400?random=15",
      followers: "5.2M",
      isFollowing: false,
    },
  ];

  // Mock data para álbumes
  mockAlbums: Album[] = [
    {
      id: "1",
      title: "AM",
      artist: "Arctic Monkeys",
      year: 2013,
      image: "https://picsum.photos/400/400?random=21",
      songCount: 12,
    },
    {
      id: "2",
      title: "When We All Fall Asleep",
      artist: "Billie Eilish",
      year: 2019,
      image: "https://picsum.photos/400/400?random=22",
      songCount: 14,
    },
    {
      id: "3",
      title: "After Hours",
      artist: "The Weeknd",
      year: 2020,
      image: "https://picsum.photos/400/400?random=23",
      songCount: 14,
    },
    {
      id: "4",
      title: "Currents",
      artist: "Tame Impala",
      year: 2015,
      image: "https://picsum.photos/400/400?random=24",
      songCount: 13,
    },
    {
      id: "5",
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      year: 2020,
      image: "https://picsum.photos/400/400?random=25",
      songCount: 11,
    },
    {
      id: "6",
      title: "Tranquility Base Hotel",
      artist: "Arctic Monkeys",
      year: 2018,
      image: "https://picsum.photos/400/400?random=26",
      songCount: 11,
    },
  ];

  get isEmpty(): boolean {
    switch (this.activeTab) {
      case "playlists":
        return this.mockPlaylists.length === 0;
      case "artists":
        return this.mockArtists.length === 0;
      case "albums":
        return this.mockAlbums.length === 0;
      default:
        return true;
    }
  }

  setActiveTab(tab: "playlists" | "artists" | "albums"): void {
    this.activeTab = tab;
  }

  createPlaylist(): void {
    this.showCreateModal = true;
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newPlaylist = {
      name: "",
      description: "",
      isPrivate: false,
    };
  }

  savePlaylist(): void {
    if (!this.newPlaylist.name.trim()) {
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: this.newPlaylist.name.trim(),
      description: this.newPlaylist.description.trim(),
      image: "https://picsum.photos/400/400?random=" + Date.now(),
      songCount: 0,
      createdAt: new Date(),
    };

    this.mockPlaylists.unshift(newPlaylist);
    this.closeModal();
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  playPlaylist(playlist: Playlist): void {
    console.log("Reproducir playlist:", playlist.name);
  }

  playAlbum(album: Album): void {
    console.log("Reproducir álbum:", album.title);
  }

  viewArtist(artist: Artist): void {
    console.log("Ver artista:", artist.name);
  }

  toggleFollowArtist(artist: Artist): void {
    artist.isFollowing = !artist.isFollowing;
    console.log(
      artist.isFollowing ? "Siguiendo" : "Dejando de seguir",
      artist.name,
    );
  }

  exploreMusic(): void {
    console.log("Explorar música");
  }

  // Métodos para manejo de eventos de teclado
  onKeyDown(event: KeyboardEvent, action: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }
}
