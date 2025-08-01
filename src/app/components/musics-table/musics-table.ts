import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MusicsTablePlay } from "../musics-table-play/musics-table-play";
import { MatIcon } from "@angular/material/icon";

interface Song {
  id: number;
  title: string;
  artists: string[];
  album: string;
  albumId: number;
  duration: string;
  image: string;
}

@Component({
  selector: "app-musics-table",
  imports: [MusicsTablePlay, MatIcon],
  templateUrl: "./musics-table.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTable {
  @Input() songs: Song[] = [];

  // Mock state para el reproductor
  currentSong: Song | null = null;
  currentPlaylistId: number | null = null;

  isCurrentSong(song: Song): boolean {
    return (
      this.currentSong?.id === song.id &&
      this.currentPlaylistId === song.albumId
    );
  }

  // Mock songs data para testing
  constructor() {
    this.songs = [
      {
        id: 1,
        title: "Bohemian Rhapsody",
        artists: ["Queen"],
        album: "A Night at the Opera",
        albumId: 101,
        duration: "5:55",
        image: "/assets/playlists/playlist1.jpg",
      },
      {
        id: 2,
        title: "Hotel California",
        artists: ["Eagles"],
        album: "Hotel California",
        albumId: 102,
        duration: "6:30",
        image: "/assets/playlists/playlist2.webp",
      },
      {
        id: 3,
        title: "Stairway to Heaven",
        artists: ["Led Zeppelin"],
        album: "Led Zeppelin IV",
        albumId: 103,
        duration: "8:02",
        image: "/assets/playlists/playlist3.jpg",
      },
      {
        id: 4,
        title: "Sweet Child O' Mine",
        artists: ["Guns N' Roses"],
        album: "Appetite for Destruction",
        albumId: 104,
        duration: "5:03",
        image: "/assets/playlists/playlist4.jpg",
      },
    ];
  }
}
