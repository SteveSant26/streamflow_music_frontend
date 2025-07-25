import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { PlayerControlButtonBar } from "../player-control-button-bar/player-control-button-bar";
import { PlayerCurrentSong } from "../player-current-song/player-current-song";
import { PlayerSoundControl } from "../player-sound-control/player-sound-control";
import { PlayerVolumeControl } from "../player-volume-control/player-volume-control";

interface Song {
  id: number;
  title: string;
  artists: string[];
  album: string;
  albumId: number;
  duration: string;
  image: string;
}

interface Playlist {
  id: number;
  name?: string;
  description?: string;
}

interface CurrentMusic {
  song: Song | null;
  playlist: Playlist | null;
  songs: Song[];
}

@Component({
  selector: "app-player",
  imports: [
    PlayerControlButtonBar,
    PlayerCurrentSong,
    PlayerSoundControl,
    PlayerVolumeControl,
  ],
  templateUrl: "./player.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Player implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("audioElement", { static: false })
  audioRef!: ElementRef<HTMLAudioElement>;

  // Mock state para el reproductor
  currentMusic: CurrentMusic = {
    song: null,
    playlist: null,
    songs: [],
  };

  isPlaying: boolean = false;
  volume: number = 0.5;

  ngOnInit(): void {
    // Inicializar con una canción mock
    this.currentMusic = {
      song: {
        id: 1,
        title: "Bohemian Rhapsody",
        artists: ["Queen"],
        album: "A Night at the Opera",
        albumId: 101,
        duration: "5:55",
        image: "/assets/playlists/playlist1.jpg",
      },
      playlist: { id: 101 },
      songs: [],
    };
  }

  ngAfterViewInit(): void {
    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.volume = this.volume;
    }
  }

  ngOnDestroy(): void {
    this.audioRef?.nativeElement?.pause?.();
  }

  play(): void {
    this.audioRef?.nativeElement?.play?.()
      .catch((e) => console.log("Error playing: ", e));
  }

  pause(): void {
    this.audioRef?.nativeElement?.pause?.();
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.play() : this.pause();
  }

  setVolume(newVolume: number): void {
    this.volume = newVolume;
    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.volume = this.volume;
    }
  }

  getNextSong(): Song | null {
    // Mock: devolver la misma canción para el prototipo
    return this.currentMusic.song;
  }

  onNextSong(): void {
    const nextSong = this.getNextSong();
    if (nextSong) {
      this.currentMusic = { ...this.currentMusic, song: nextSong };
    }
  }

  onPlayPauseClick(): void {
    this.togglePlayPause();
  }

  onVolumeChange(volume: number): void {
    this.setVolume(volume);
  }
}
