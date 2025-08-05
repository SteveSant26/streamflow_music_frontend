import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { PlayerControlButtonBar } from '../player-control-button-bar/player-control-button-bar';
import { PlayerCurrentSong } from '../player-current-song/player-current-song';
import { PlayerSoundControl } from '../player-sound-control/player-sound-control';
import { PlayerVolumeControl } from '../player-volume-control/player-volume-control';
import { PlayerUseCase } from '@app/domain/usecases';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
  selector: 'app-player',
  standalone: true,
  imports: [
    PlayerControlButtonBar,
    PlayerCurrentSong,
    PlayerSoundControl,
    PlayerVolumeControl,
    TranslateModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './player.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Player implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioElement', { static: false })
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
    private readonly playlistService: PlaylistService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Ensure global player state is initialized
    this.globalPlayerState.ensureInitialized();

    // Subscribe to player state from Clean Architecture
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.log('🔄 Player component state update:', {
          hasCurrentSong: !!state.currentSong,
          currentSong: state.currentSong?.title,
          isPlaying: state.isPlaying
        });
        
        this.playerState = state;
        this.updateLegacyState(state);
        this.cdr.detectChanges(); // Force change detection for OnPush
      });

    this.playerUseCase
      .onSongEnd()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Song ended - handled by use case
      });

    this.playerUseCase
      .onError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: any) => {
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
        artists: [state.currentSong.artist_name || 'Unknown Artist'],
        album: state.currentSong.album?.title || 'Unknown Album',
        albumId: state.currentSong.album?.id ? parseInt(state.currentSong.album.id) : 1,
        duration: state.currentSong.duration_formatted || '0:00',
        image: state.currentSong.album?.cover_url || state.currentSong.thumbnail_url || '/assets/default-album.png',
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
      
      // Sync volume with player state
      this.globalPlayerState
        .getPlayerState$()
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
          if (audioElement.volume !== state.volume) {
            audioElement.volume = state.volume;
          }
        });
    }
  }

  ngOnDestroy(): void {
    // CRITICAL: Preserve state before any component destruction
    this.globalPlayerState.preserveStateForNavigation();

    this.destroy$.next();
    this.destroy$.complete();
  }

  openPlaylistModal(): void {
    console.log('🎵 openPlaylistModal() ejecutado');
    
    // Navigate to the current song page where the playlist modal is available
    if (this.playerState?.currentSong) {
      console.log('✅ Navegando a current-song desde playlist button');
      // Usar la ruta correcta definida en routes-config
      this.router.navigate(['/music/current-song']).then(success => {
        console.log('🚀 Navegación resultado:', success);
      }).catch(error => {
        console.error('❌ Error en navegación:', error);
      });
    } else {
      console.log('⚠️ No hay canción actual, navegando a library');
      // Si no hay canción, navegar a la biblioteca de música
      this.router.navigate(['/music/library']).then(success => {
        console.log('🚀 Navegación a library resultado:', success);
      }).catch(error => {
        console.error('❌ Error en navegación a library:', error);
      });
    }
  }

  goToCurrentSong(): void {
    console.log('🎵 goToCurrentSong() ejecutado');
    
    // Navigate directly to current song page
    if (this.playerState?.currentSong) {
      console.log('✅ Navegando a current-song desde music note button');
      this.router.navigate(['/music/current-song']).then(success => {
        console.log('🚀 Navegación resultado:', success);
      }).catch(error => {
        console.error('❌ Error en navegación:', error);
      });
    } else {
      console.log('⚠️ No hay canción actual para mostrar');
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
