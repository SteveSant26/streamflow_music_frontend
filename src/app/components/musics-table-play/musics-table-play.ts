import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface Song {
  id: number;
  title: string;
  artists: string[];
  album: string;
  albumId: number;
  duration: string;
  image: string;
}

interface CurrentMusic {
  song: Song | null;
  playlist: any | null;
  songs: Song[];
}

@Component({
  selector: 'app-musics-table-play',
  imports: [],
  templateUrl: './musics-table-play.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicsTablePlay {
  @Input() song!: Song;
  @Input() isCurrentSong: boolean = false;

  // Mock state para el reproductor
  currentMusic: CurrentMusic = {
    song: null,
    playlist: null,
    songs: []
  };
  isPlaying: boolean = false;

  isNewSongOfAnotherPlaylist(song: Song): boolean {
    return this.currentMusic.playlist?.id !== song.albumId;
  }

  isCurrentSongRunning(song: Song): boolean {
    return (this.currentMusic.song?.id === song.id) &&
           (this.currentMusic.playlist?.albumId === song.albumId) &&
           this.isPlaying;
  }

  setNewCurrentMusic(song: Song): void {
    // Mock: simular carga de nueva playlist
    setTimeout(() => {
      this.currentMusic = {
        song: song,
        playlist: { id: song.albumId, albumId: song.albumId },
        songs: [song]
      };
      this.isPlaying = true;
    }, 100);
  }

  handleClick(song: Song): void {
    if (this.isCurrentSongRunning(song)) {
      this.isPlaying = false;
      return;
    }

    if (this.isNewSongOfAnotherPlaylist(song)) {
      this.setNewCurrentMusic(song);
      return;
    }

    // La playlist es la misma, pero la canción es diferente
    if (this.currentMusic.song?.id !== song.id) {
      this.currentMusic = {
        ...this.currentMusic,
        song: song
      };
    }
    this.isPlaying = true;
  }
}
