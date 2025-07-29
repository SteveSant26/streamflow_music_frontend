import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { PlaylistService, SongService } from "../../services";
import { Playlist, Song, Artist } from "../../models";

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
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly playlistService: PlaylistService,
    private readonly songService: SongService,
  ) {}

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

  private loadPlaylistData() {
    if (!this.playlistId) {
      this.error = "ID de playlist no válido";
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    console.log(
      `🎵 Cargando playlist ${this.playlistId} desde Django backend...`,
    );

    // Cargar datos de la playlist desde Django backend
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (djangoPlaylist: any) => {
        console.log("✅ Playlist cargada desde backend:", djangoPlaylist);

        // Adaptar datos de Django (snake_case) a Angular (camelCase)
        this.playlist = this.adaptDjangoPlaylist(djangoPlaylist);

        // Actualizar propiedades del componente
        this.updateComponentProperties();
        this.loading = false;
      },
      error: (error) => {
        console.error("❌ Error loading playlist from Django:", error);
        this.error = error.message || "Error al cargar la playlist";
        // Cargar datos mock como fallback
        this.loadFallbackData();
      },
    });
  }

  private adaptDjangoPlaylist(djangoData: any): Playlist {
    return {
      id: djangoData.id?.toString() || this.playlistId!,
      name: djangoData.name || "Playlist Sin Nombre",
      description: djangoData.description || "",
      coverImage:
        djangoData.cover_image ||
        djangoData.coverImage ||
        this.getPlaylistImage(),
      songs: djangoData.songs || [],
      userId: djangoData.owner?.toString() || "1",
      isPublic: djangoData.is_public ?? djangoData.isPublic ?? true,
      totalDuration: djangoData.total_duration || djangoData.totalDuration || 0,
      totalSongs:
        djangoData.songs_count ||
        djangoData.totalSongs ||
        djangoData.songs?.length ||
        0,
      createdAt:
        djangoData.created_at ||
        djangoData.createdAt ||
        new Date().toISOString(),
      updatedAt:
        djangoData.updated_at ||
        djangoData.updatedAt ||
        new Date().toISOString(),
    };
  }

  private updateComponentProperties() {
    if (!this.playlist) return;

    this.playlistName = this.playlist.name;
    this.playlistDescription = this.playlist.description || "";
    this.playlistCoverImage = this.playlist.coverImage || "";
    this.songs = this.playlist.songs;
    this.songCount = this.playlist.totalSongs;
    this.duration = this.formatDuration(this.playlist.totalDuration);
    this.createdDate = this.formatDate(this.playlist.createdAt);
  }

  private loadFallbackData() {
    console.log("🔄 Cargando datos de fallback...");

    // Datos mock mientras configuramos el backend
    const mockPlaylist: Playlist = {
      id: this.playlistId!,
      name: this.getFallbackPlaylistName(),
      description: this.getFallbackDescription(),
      coverImage: this.getPlaylistImage(),
      songs: this.getMockSongs(),
      userId: "1",
      isPublic: true,
      totalDuration: 3600, // 1 hora
      totalSongs: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.playlist = mockPlaylist;
    this.updateComponentProperties();
    this.loading = false;
  }

  private getFallbackPlaylistName(): string {
    const names = {
      "1": "Mi Playlist Favorita",
      "2": "Música para Trabajar",
      "3": "Relajación y Chill",
    };
    return (
      names[this.playlistId as keyof typeof names] ||
      `Playlist ${this.playlistId}`
    );
  }

  private getFallbackDescription(): string {
    const descriptions = {
      "1": "Las mejores canciones para cualquier momento",
      "2": "Música perfecta para concentrarse y ser productivo",
      "3": "Sonidos relajantes para desconectar del estrés",
    };
    return (
      descriptions[this.playlistId as keyof typeof descriptions] ||
      "Una playlist increíble"
    );
  }

  private getMockSongs(): Song[] {
    const mockArtist1: Artist = {
      id: "1",
      name: "Queen",
      image: "https://picsum.photos/100/100?random=10",
      verified: true,
      followers: 2000000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockArtist2: Artist = {
      id: "2",
      name: "Adele",
      image: "https://picsum.photos/100/100?random=20",
      verified: true,
      followers: 1500000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return [
      {
        id: "1",
        title: "Bohemian Rhapsody",
        artistId: "1",
        artist: mockArtist1,
        duration: 355,
        fileUrl: "https://example.com/song1.mp3",
        coverImage: "https://picsum.photos/64/64?random=1",
        plays: 1000000,
        likes: 50000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Someone Like You",
        artistId: "2",
        artist: mockArtist2,
        duration: 285,
        fileUrl: "https://example.com/song2.mp3",
        coverImage: "https://picsum.photos/64/64?random=2",
        plays: 800000,
        likes: 40000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  private getPlaylistColor(): string {
    const colors = ["9333EA", "3B82F6", "EF4444", "10B981", "F59E0B"];
    const index = parseInt(this.playlistId || "0") % colors.length;
    return colors[index];
  }

  private getPlaylistEmoji(): string {
    const emojis = ["🎵", "🎧", "🎶", "🎤", "🎸"];
    const index = parseInt(this.playlistId || "0") % emojis.length;
    return emojis[index];
  }

  private applyFallbackGradient() {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    ];

    const index = parseInt(this.playlistId || "0") % gradients.length;
    this.dynamicGradient = gradients[index];

    // Aplicar al elemento si existe
    setTimeout(() => {
      const element = document.querySelector(".playlist-header") as HTMLElement;
      if (element) {
        element.style.background = this.dynamicGradient;
      }
    }, 100);
  }

  private extractColorsFromImage(img: HTMLImageElement) {
    try {
      // Crear canvas para extraer colores
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Extraer color dominante (simplificado)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      let count = 0;

      // Muestrear cada 10 píxeles para performance
      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Crear gradiente con el color extraído
      const color1 = `rgb(${r}, ${g}, ${b})`;
      const color2 = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;

      this.dynamicGradient = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;

      // Aplicar gradiente
      const element = document.querySelector(".playlist-header") as HTMLElement;
      if (element) {
        element.style.background = this.dynamicGradient;
      }

      console.log("🎨 Gradiente extraído:", this.dynamicGradient);
    } catch (error) {
      console.error("Error extrayendo colores:", error);
      this.applyFallbackGradient();
    }
  }

  testDifferentImage() {
    // Método para probar diferentes imágenes y gradientes
    const testImages = [
      `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
    ];

    const randomImage =
      testImages[Math.floor(Math.random() * testImages.length)];
    this.playlistCoverImage = randomImage;

    console.log("🎨 Probando nueva imagen:", randomImage);
  }
}
