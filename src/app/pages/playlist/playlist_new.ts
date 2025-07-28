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
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    const color = this.getPlaylistColor();
    const emoji = this.getPlaylistEmoji();
    img.src = `https://via.placeholder.com/300x300/${color}/FFFFFF?text=${emoji}`;
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
