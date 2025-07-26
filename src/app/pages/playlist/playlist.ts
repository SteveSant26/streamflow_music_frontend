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

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./playlist.html",
  styleUrls: ["./playlist.css"],
})
export class PlaylistComponent implements OnInit {
  playlistId: string | null = null;
  songCount: number = 0;
  duration: string = "0";
  createdDate: string = "";
  songs: Song[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.playlistId = this.route.snapshot.paramMap.get("id");
    this.loadPlaylistData();
  }

  private loadPlaylistData() {
    // Datos de ejemplo - esto vendrá de un servicio
    this.songs = [
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
      {
        id: "4",
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        album: "Appetite for Destruction",
        duration: "5:03",
      },
      {
        id: "5",
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        album: "Nevermind",
        duration: "5:01",
      },
    ];

    this.songCount = this.songs.length;
    this.duration = this.calculateTotalDuration();
    this.createdDate = "2024";
  }

  private calculateTotalDuration(): string {
    const totalMinutes = this.songs.reduce((total, song) => {
      const [minutes, seconds] = song.duration.split(":").map(Number);
      return total + minutes + seconds / 60;
    }, 0);

    return Math.round(totalMinutes).toString();
  }
}
