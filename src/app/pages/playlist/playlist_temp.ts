import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

interface Playlist {
  name: string;
  description: string;
  createdDate: string;
  coverImage: string;
  songs: Song[];
}

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./playlist.html",
  styleUrls: ["./playlist.css"],
})
export class PlaylistComponent implements OnInit {
  playlistId: string | null = null;
  playlist: Playlist | null = null;
  playlistName: string = "";
  playlistDescription: string = "";
  playlistCoverImage: string = "";
  songCount: number = 0;
  duration: string = "0";
  createdDate: string = "";
  songs: Song[] = [];
  dynamicGradient: string = "";

  constructor(private readonly route: ActivatedRoute) {}

  get currentPlaylistImage(): string {
    return (
      this.playlistCoverImage ||
      this.playlist?.coverImage ||
      `https://picsum.photos/300/300?random=${this.playlistId || 1}`
    );
  }

  getPlaylistImage(): string {
    if (this.playlist?.coverImage) {
      return this.playlist.coverImage;
    }
    return `https://picsum.photos/300/300?random=${this.playlistId || 1}`;
  }

  getContainerClass(): string {
    switch (this.playlistId) {
      case "1":
        return "playlist-container playlist-purple";
      case "2":
        return "playlist-container playlist-blue";
      case "3":
        return "playlist-container playlist-red";
      default:
        return "playlist-container playlist-purple";
    }
  }

  ngOnInit() {
    this.playlistId = this.route.snapshot.paramMap.get("id");
    this.loadPlaylistData();
    // Aplicar gradiente de fallback inicial
    this.applyFallbackGradient();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    const color = this.getPlaylistColor();
    const emoji = this.getPlaylistEmoji();
    img.src = `https://via.placeholder.com/300x300/${color}/FFFFFF?text=${emoji}`;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    console.log("Imagen cargada:", img.src);

    // Pequeño delay para asegurar que la imagen está completamente cargada
    setTimeout(() => {
      this.extractColorsFromImage(img);
    }, 100);
  }

  private extractColorsFromImage(img: HTMLImageElement) {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorMap = new Map<string, number>();
      const sampleRate = 10; // Muestrear cada 10 píxeles para mejor rendimiento

      for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        if (alpha > 128) {
          // Solo píxeles no transparentes
          const colorKey = `${Math.floor(r / 10) * 10},${Math.floor(g / 10) * 10},${Math.floor(b / 10) * 10}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
      }

      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([color]) => {
          const [r, g, b] = color.split(",").map(Number);
          return { r, g, b };
        });

      if (sortedColors.length > 0) {
        const dominantColor = sortedColors[0];
        this.generateGradient(dominantColor);
      } else {
        this.applyFallbackGradient();
      }
    } catch (error) {
      console.error("Error al extraer colores de la imagen:", error);
      this.applyFallbackGradient();
    }
  }

  private generateGradient(color: { r: number; g: number; b: number }) {
    const baseColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

    // Crear variaciones del color base
    const darkerColor = `rgb(${Math.max(0, color.r - 40)}, ${Math.max(0, color.g - 40)}, ${Math.max(0, color.b - 40)})`;
    const lighterColor = `rgb(${Math.min(255, color.r + 30)}, ${Math.min(255, color.g + 30)}, ${Math.min(255, color.b + 30)})`;

    // Determinar si el color es muy oscuro o muy claro para ajustar la dirección
    const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;

    if (brightness < 100) {
      // Color oscuro - gradiente hacia más claro
      this.dynamicGradient = `linear-gradient(135deg, ${baseColor} 0%, ${lighterColor} 100%)`;
    } else if (brightness > 200) {
      // Color claro - gradiente hacia más oscuro
      this.dynamicGradient = `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 100%)`;
    } else {
      // Color medio - gradiente en ambas direcciones
      this.dynamicGradient = `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 50%, ${lighterColor} 100%)`;
    }

    console.log("Gradiente generado:", this.dynamicGradient);
  }

  private applyFallbackGradient() {
    // Gradientes de fallback basados en el ID de la playlist
    switch (this.playlistId) {
      case "1":
        this.dynamicGradient =
          "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)";
        break;
      case "2":
        this.dynamicGradient =
          "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)";
        break;
      case "3":
        this.dynamicGradient =
          "linear-gradient(135deg, #EF4444 0%, #F87171 100%)";
        break;
      default:
        this.dynamicGradient =
          "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)";
    }
    console.log("Aplicado gradiente de fallback:", this.dynamicGradient);
  }

  // Método de prueba para cambiar imagen y ver el efecto del gradiente
  testDifferentImage() {
    const testImages = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", // Original
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", // Azul/morado
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", // Rojizo
      "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop", // Verde
    ];

    if (!this.playlist) return;

    const currentIndex = testImages.indexOf(this.playlist.coverImage);
    const nextIndex = (currentIndex + 1) % testImages.length;

    console.log("🎨 Cambiando a imagen:", testImages[nextIndex]);
    this.playlist.coverImage = testImages[nextIndex];
    this.playlistCoverImage = testImages[nextIndex];
  }

  private getPlaylistColor(): string {
    switch (this.playlistId) {
      case "1":
        return "8B5CF6";
      case "2":
        return "3B82F6";
      case "3":
        return "EF4444";
      default:
        return "8B5CF6";
    }
  }

  private getPlaylistEmoji(): string {
    switch (this.playlistId) {
      case "1":
        return "🎵";
      case "2":
        return "🎯";
      case "3":
        return "🛣️";
      default:
        return "🎵";
    }
  }

  private loadPlaylistData() {
    // Simular carga de datos específicos según el ID de la playlist
    // En una aplicación real, esto vendría de un servicio
    const playlistData = this.getPlaylistById(this.playlistId);

    if (playlistData) {
      this.playlist = playlistData;
      this.playlistName = playlistData.name;
      this.playlistDescription = playlistData.description;
      this.playlistCoverImage = playlistData.coverImage;
      this.songs = playlistData.songs;
      this.songCount = playlistData.songs.length;
      this.duration = this.calculateTotalDuration(playlistData.songs);
      this.createdDate = playlistData.createdDate;
    }
  }

  private getPlaylistById(id: string | null) {
    // Mock data que coincide con las playlists de la biblioteca
    const mockPlaylistsData: any = {
      "1": {
        name: "Mi Playlist Favorita",
        description: "Las mejores canciones para relajarse",
        createdDate: "2024-01-15",
        coverImage: "https://picsum.photos/300/300?random=1",
        songs: [
          {
            id: "1",
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            duration: "5:55",
          },
          {
            id: "2",
            title: "Stairway to Heaven",
            artist: "Led Zeppelin",
            album: "Led Zeppelin IV",
            duration: "8:02",
          },
          {
            id: "3",
            title: "Hotel California",
            artist: "Eagles",
            album: "Hotel California",
            duration: "6:30",
          },
        ],
      },
      "2": {
        name: "Música para Trabajar",
        description: "Concentración y productividad",
        createdDate: "2024-01-10",
        coverImage: "https://picsum.photos/300/300?random=2",
        songs: [
          {
            id: "4",
            title: "Weightless",
            artist: "Marconi Union",
            album: "Distance",
            duration: "8:10",
          },
          {
            id: "5",
            title: "Clair de Lune",
            artist: "Claude Debussy",
            album: "Suite Bergamasque",
            duration: "4:32",
          },
          {
            id: "6",
            title: "Gymnopédie No. 1",
            artist: "Erik Satie",
            album: "Trois Gymnopédies",
            duration: "3:23",
          },
        ],
      },
      "3": {
        name: "Road Trip Vibes",
        description: "Para esos viajes largos en carretera",
        createdDate: "2024-01-05",
        coverImage: "https://picsum.photos/300/300?random=3",
        songs: [
          {
            id: "7",
            title: "Born to Be Wild",
            artist: "Steppenwolf",
            album: "Steppenwolf",
            duration: "3:30",
          },
          {
            id: "8",
            title: "Take It Easy",
            artist: "Eagles",
            album: "Eagles",
            duration: "3:21",
          },
          {
            id: "9",
            title: "Life is a Highway",
            artist: "Tom Cochrane",
            album: "Mad Mad World",
            duration: "4:24",
          },
        ],
      },
    };

    return mockPlaylistsData[id || "1"] || mockPlaylistsData["1"];
  }

  private calculateTotalDuration(songs: Song[]): string {
    let totalSeconds = 0;

    songs.forEach((song) => {
      const [minutes, seconds] = song.duration.split(":").map(Number);
      totalSeconds += minutes * 60 + seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
