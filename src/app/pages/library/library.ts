import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class LibraryComponent {
  activeTab: 'playlists' | 'artists' | 'albums' = 'playlists';

  // Modal state
  showCreateModal = false;

  // Image upload state
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // Form data for new playlist
  newPlaylist = {
    name: '',
    description: '',
    isPrivate: false,
  };

  constructor(private readonly router: Router) {}

  // Mock data para playlists
  mockPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Mi Playlist Favorita',
      description: 'Las mejores canciones para relajarse',
      image: 'https://picsum.photos/400/400?random=1',
      songCount: 25,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Música para Trabajar',
      description: 'Concentración y productividad',
      image: 'https://picsum.photos/400/400?random=2',
      songCount: 42,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Road Trip Vibes',
      description: 'Para esos viajes largos en carretera',
      image: 'https://picsum.photos/400/400?random=3',
      songCount: 18,
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'Chill Evening',
      description: 'Perfecta para las noches tranquilas',
      image: 'https://picsum.photos/400/400?random=4',
      songCount: 31,
      createdAt: new Date(),
    },
    {
      id: '5',
      name: 'Workout Energy',
      description: 'Música enérgica para el gimnasio',
      image: 'https://picsum.photos/400/400?random=5',
      songCount: 20,
      createdAt: new Date(),
    },
    {
      id: '6',
      name: 'Sunday Morning',
      description: 'Despertar con buena música',
      image: 'https://picsum.photos/400/400?random=6',
      songCount: 15,
      createdAt: new Date(),
    },
  ];

  // Mock data para artistas
  mockArtists: Artist[] = [
    {
      id: '1',
      name: 'Arctic Monkeys',
      genre: 'Indie Rock',
      image: 'https://picsum.photos/400/400?random=11',
      followers: '2.4M',
      isFollowing: true,
    },
    {
      id: '2',
      name: 'Billie Eilish',
      genre: 'Pop Alternativo',
      image: 'https://picsum.photos/400/400?random=12',
      followers: '8.1M',
      isFollowing: true,
    },
    {
      id: '3',
      name: 'The Weeknd',
      genre: 'R&B',
      image: 'https://picsum.photos/400/400?random=13',
      followers: '6.7M',
      isFollowing: false,
    },
    {
      id: '4',
      name: 'Tame Impala',
      genre: 'Psychedelic Pop',
      image: 'https://picsum.photos/400/400?random=14',
      followers: '1.8M',
      isFollowing: true,
    },
    {
      id: '5',
      name: 'Dua Lipa',
      genre: 'Pop',
      image: 'https://picsum.photos/400/400?random=15',
      followers: '5.2M',
      isFollowing: false,
    },
  ];

  // Mock data para álbumes
  mockAlbums: Album[] = [
    {
      id: '1',
      title: 'AM',
      artist: 'Arctic Monkeys',
      year: 2013,
      image: 'https://picsum.photos/400/400?random=21',
      songCount: 12,
    },
    {
      id: '2',
      title: 'When We All Fall Asleep',
      artist: 'Billie Eilish',
      year: 2019,
      image: 'https://picsum.photos/400/400?random=22',
      songCount: 14,
    },
    {
      id: '3',
      title: 'After Hours',
      artist: 'The Weeknd',
      year: 2020,
      image: 'https://picsum.photos/400/400?random=23',
      songCount: 14,
    },
    {
      id: '4',
      title: 'Currents',
      artist: 'Tame Impala',
      year: 2015,
      image: 'https://picsum.photos/400/400?random=24',
      songCount: 13,
    },
    {
      id: '5',
      title: 'Future Nostalgia',
      artist: 'Dua Lipa',
      year: 2020,
      image: 'https://picsum.photos/400/400?random=25',
      songCount: 11,
    },
    {
      id: '6',
      title: 'Tranquility Base Hotel',
      artist: 'Arctic Monkeys',
      year: 2018,
      image: 'https://picsum.photos/400/400?random=26',
      songCount: 11,
    },
  ];

  get isEmpty(): boolean {
    switch (this.activeTab) {
      case 'playlists':
        return this.mockPlaylists.length === 0;
      case 'artists':
        return this.mockArtists.length === 0;
      case 'albums':
        return this.mockAlbums.length === 0;
      default:
        return true;
    }
  }

  setActiveTab(tab: 'playlists' | 'artists' | 'albums'): void {
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
      name: '',
      description: '',
      isPrivate: false,
    };
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen válida (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB');
        return;
      }

      this.selectedImageFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;

    // Clear the input
    const input = document.getElementById('imageInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  triggerImageUpload(): void {
    const input = document.getElementById('imageInput') as HTMLInputElement;
    input?.click();
  }

  savePlaylist(): void {
    if (!this.newPlaylist.name.trim()) {
      return;
    }

    // Use the selected image or a default placeholder
    const playlistImage =
      this.imagePreviewUrl ||
      'https://picsum.photos/400/400?random=' + Date.now();

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: this.newPlaylist.name.trim(),
      description: this.newPlaylist.description.trim(),
      image: playlistImage,
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
    // Navegar a la vista individual de la playlist
    this.router.navigate(['/playlist', playlist.id]);
  }

  startPlayingPlaylist(playlist: Playlist, event: Event): void {
    // Prevenir que se navegue cuando se hace click en el botón de play
    event.stopPropagation();
    // Aquí iría la lógica para empezar a reproducir la playlist
    console.log('Reproduciendo playlist:', playlist.name);
  }

  playAlbum(album: Album): void {
    console.log('Reproducir álbum:', album.title);
  }

  viewArtist(artist: Artist): void {
    // Navegar a la vista individual del artista
    this.router.navigate(['/artist', artist.id]);
  }

  toggleFollowArtist(artist: Artist): void {
    artist.isFollowing = !artist.isFollowing;
    console.log(
      artist.isFollowing ? 'Siguiendo' : 'Dejando de seguir',
      artist.name,
    );
  }

  exploreMusic(): void {
    console.log('Explorar música');
  }

  // Métodos para manejo de eventos de teclado
  onKeyDown(event: KeyboardEvent, action: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
}
