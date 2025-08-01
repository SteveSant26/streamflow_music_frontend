import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { PlayerControlButtonBar } from "../player-control-button-bar/player-control-button-bar";
import { PlayerCurrentSong } from "../player-current-song/player-current-song";
import { PlayerSoundControl } from "../player-sound-control/player-sound-control";
import { PlayerVolumeControl } from "../player-volume-control/player-volume-control";
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { GlobalPlayerStateService } from '../../shared/services/global-player-state.service';
import { Subject, takeUntil } from 'rxjs';

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

  // State from Clean Architecture
  playerState: PlayerState | null = null;
  showInteractionMessage = false;
  private readonly destroy$ = new Subject<void>();

  // Legacy state for template compatibility
  currentMusic: CurrentMusic = {
    song: null,
    playlist: null,
    songs: [],
  };

  isPlaying = false;
  volume = 0.5;

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly globalPlayerState: GlobalPlayerStateService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Ensure global player state is initialized
    this.globalPlayerState.ensureInitialized();

    // Subscribe to player state from Clean Architecture
    this.globalPlayerState.getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.playerState = state;
        this.updateLegacyState(state);
        this.cdr.detectChanges(); // Force change detection for OnPush
      });

    this.playerUseCase.onSongEnd()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Song ended - handled by use case
      });

    this.playerUseCase.onError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        console.error('Player error:', error);
        if (error.includes('not allowed')) {
          this.showInteractionMessage = true;
        }
        this.cdr.detectChanges(); // Force change detection for errors
      });

    this.loadDefaultPlaylist();
  }

  private updateLegacyState(state: PlayerState): void {
    this.isPlaying = state.isPlaying;
    this.volume = state.volume;
    
    if (state.currentSong) {
      // Map Clean Architecture Song to legacy Song format
      this.currentMusic.song = {
        id: parseInt(state.currentSong.id) || 1,
        title: state.currentSong.title,
        artists: [state.currentSong.artist],
        album: 'Unknown Album',
        albumId: 1,
        duration: this.formatTime(state.currentSong.duration),
        image: state.currentSong.albumCover || '/assets/gorillaz2.jpg'
      };

      // Don't manually set the audio source - let the repository handle it
      // The repository will manage the audio element after setAudioElement is called
    } else {
      this.currentMusic.song = null;
    }
  }

  private loadDefaultPlaylist(): void {
    // The global player state service handles default playlist loading
    this.globalPlayerState.ensureInitialized();
  }

  ngAfterViewInit(): void {
    if (this.audioRef?.nativeElement) {
      const audioElement = this.audioRef.nativeElement;
      
      // Connect the template audio element to Clean Architecture
      this.playerUseCase.setAudioElement(audioElement);
      
      // Set initial volume
      audioElement.volume = this.volume;
    }
  }

  ngOnDestroy(): void {
    // CRITICAL: Preserve state before any component destruction
    this.globalPlayerState.preserveStateForNavigation();
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
