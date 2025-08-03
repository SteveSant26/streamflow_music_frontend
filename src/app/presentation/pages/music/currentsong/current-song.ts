import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlayerState } from '../../../../domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';

interface CurrentSongView {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
  progress: number;
  volume: number;
  cover: string;
  gradient: string;
  isPlaying: boolean;
  lyrics?: string;
}

@Component({
  selector: 'app-current-song',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './currentsong.html',
  styleUrls: ['./current-song.css'],
})
export class CurrentSongComponent implements OnInit, OnDestroy {
  currentSong: CurrentSongView | null = null;
  showLyricsPanel = false;
  Math = Math; // Expose Math for template use
  private readonly destroy$ = new Subject<void>();
  private previousVolume = 0.5; // Para recordar el volumen anterior al hacer mute

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly globalPlayerState: GlobalPlayerStateService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit() {
    this.setupPlayerStateSubscription();
    this.initializePlayer();

    // Evitar scroll en el body solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = 'hidden';
      this.document.body.style.margin = '0';
      this.document.body.style.padding = '0';
    }
  }

  ngOnDestroy() {
    // CRITICAL: Preserve state before any component destruction
    this.globalPlayerState.preserveStateForNavigation();

    this.destroy$.next();
    this.destroy$.complete();

    // Restaurar scroll cuando se salga de la vista solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = '';
      this.document.body.style.margin = '';
      this.document.body.style.padding = '';
    }
  }

  private setupPlayerStateSubscription(): void {
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((playerState: PlayerState) => {
        this.updateCurrentSongView(playerState);
        this.cdr.detectChanges();
      });
  }

  private initializePlayer(): void {
    // Ensure global player state is initialized
    this.globalPlayerState.ensureInitialized();

    // Force a state update to ensure we have the latest player state
    const currentState = this.globalPlayerState.getPlayerState();
    this.updateCurrentSongView(currentState);
  }

  private updateCurrentSongView(playerState: PlayerState): void {
    if (playerState.currentSong) {
      this.currentSong = {
        id: playerState.currentSong.id,
        title: playerState.currentSong.title,
        artist: playerState.currentSong.artist,
        album: playerState.currentSong.artist, // Usando artist como album por ahora
        duration: this.formatTime(playerState.duration),
        currentTime: this.formatTime(playerState.currentTime),
        progress: playerState.progress,
        volume: playerState.volume,
        cover: playerState.currentSong.thumbnailUrl || '/assets/gorillaz2.jpg',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        isPlaying: playerState.isPlaying,
        lyrics: '🎵 Lyrics not available yet 🎵',
      };
    } else {
      this.currentSong = null;
    }
  }

  private formatTime(seconds: number): string {
    if (!seconds || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    console.log('Imagen de canción cargada:', img.src);

    setTimeout(() => {
      this.extractColorsFromImage(img);
    }, 100);
  }

  onImageError(event: Event) {
    console.error('Error al cargar imagen de canción:', event);
    this.applyFallbackGradient();
  }

  togglePlayPause() {
    console.log('Current-song: togglePlayPause clicked');

    // Use ONLY the centralized method
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.togglePlayPause();

    // Force sync immediately after action
    this.globalPlayerState.forceSyncAllComponents();
  }

  toggleLyricsPanel() {
    this.showLyricsPanel = !this.showLyricsPanel;
    console.log(
      'Panel de letras:',
      this.showLyricsPanel ? 'Abierto' : 'Cerrado',
    );
  }

  goBack() {
    // CRITICAL: Preserve state before navigation
    this.globalPlayerState.preserveStateForNavigation();

    this.router.navigate(['/home']);
  }

  skipPrevious() {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    this.globalPlayerState.ensureInitialized();

    playerUseCase.playPrevious().catch((error: any) => {
      console.error('Error al reproducir canción anterior:', error);
    });
    console.log('Canción anterior');
  }

  skipNext() {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    this.globalPlayerState.ensureInitialized();

    playerUseCase.playNext().catch((error: any) => {
      console.error('Error al reproducir siguiente canción:', error);
    });
    console.log('Siguiente canción');
  }

  onProgressClick(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const newProgress = (clickX / width) * 100;

    console.log('Current-song: Progress click to:', newProgress + '%');

    // Use PlayerUseCase to handle seeking
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.seekToPercentage(newProgress);

    // Force sync after seek
    this.globalPlayerState.forceSyncAllComponents();
  }

  onProgressKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Simulate a click in the middle for keyboard users
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const centerX = rect.width / 2;
      const newProgress = 50; // Set to middle when using keyboard

      console.log('Current-song: Progress keyboard to:', newProgress + '%');

      const playerUseCase = this.globalPlayerState.getPlayerUseCase();
      playerUseCase.seekToPercentage(newProgress);
      this.globalPlayerState.forceSyncAllComponents();
    }
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const volume = parseFloat(input.value) / 100;

    // Guardar el volumen anterior si no es 0
    if (volume > 0) {
      this.previousVolume = volume;
    }

    console.log('Current-song: Volume change to:', volume);

    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.setVolume(volume);

    // Force sync after volume change
    this.globalPlayerState.forceSyncAllComponents();
  }

  onVolumeBarClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const newVolume = Math.max(0, Math.min(1, clickPercentage));

    // Guardar el volumen anterior si no es 0
    if (newVolume > 0) {
      this.previousVolume = newVolume;
    }

    console.log('Current-song: Volume click to:', newVolume);

    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.setVolume(newVolume);

    // Force sync after volume change
    this.globalPlayerState.forceSyncAllComponents();
  }

  toggleVolume(): void {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    
    if (this.currentSong && this.currentSong.volume === 0) {
      // Si está en mute, restaurar el volumen anterior o 100%
      const newVolume = this.previousVolume > 0 ? this.previousVolume : 1;
      playerUseCase.setVolume(newVolume);
    } else if (this.currentSong) {
      // Si tiene volumen, guardar el volumen actual y hacer mute
      this.previousVolume = this.currentSong.volume;
      playerUseCase.setVolume(0);
    }

    // Force sync after volume change
    this.globalPlayerState.forceSyncAllComponents();
  }

  private extractColorsFromImage(img: HTMLImageElement) {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyFallbackGradient();
      return;
    }

    try {
      const canvas = this.document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('No se pudo obtener contexto 2D del canvas');
        return;
      }

      const analysisSize = 150;
      canvas.width = analysisSize;
      canvas.height = analysisSize;

      img.crossOrigin = 'anonymous';
      ctx.drawImage(img, 0, 0, analysisSize, analysisSize);

      const colors = [];
      const samples = 30;

      for (let i = 0; i < samples; i++) {
        for (let j = 0; j < samples; j++) {
          const x = Math.floor((analysisSize / samples) * i);
          const y = Math.floor((analysisSize / samples) * j);

          const imageData = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = imageData.data;

          if (a > 200 && r + g + b > 50 && r + g + b < 650) {
            colors.push({ r, g, b });
          }
        }
      }

      if (colors.length > 0) {
        const dominantColor = this.findDominantColor(colors);
        const gradient = this.generateGradient(dominantColor);

        if (this.currentSong) {
          this.currentSong.gradient = gradient;
          this.cdr.detectChanges();
        }
      } else {
        this.applyFallbackGradient();
      }
    } catch (error) {
      console.error('Error al extraer colores:', error);
      this.applyFallbackGradient();
    }
  }

  private applyFallbackGradient() {
    if (this.currentSong) {
      this.currentSong.gradient =
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  private findDominantColor(colors: { r: number; g: number; b: number }[]) {
    const colorGroups: any = {};

    colors.forEach((color) => {
      const key = `${Math.floor(color.r / 25) * 25}-${Math.floor(color.g / 25) * 25}-${Math.floor(color.b / 25) * 25}`;
      if (!colorGroups[key]) {
        colorGroups[key] = { ...color, count: 0 };
      }
      colorGroups[key].count++;
    });

    let dominantColor = colors[0];
    let maxCount = 0;

    Object.values(colorGroups).forEach((group: any) => {
      if (group.count > maxCount) {
        maxCount = group.count;
        dominantColor = group;
      }
    });

    return dominantColor;
  }

  private generateGradient(color: { r: number; g: number; b: number }) {
    const baseColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    const darkerColor = `rgb(${Math.max(0, color.r - 80)}, ${Math.max(0, color.g - 80)}, ${Math.max(0, color.b - 80)})`;
    const lighterColor = `rgb(${Math.min(255, color.r + 50)}, ${Math.min(255, color.g + 50)}, ${Math.min(255, color.b + 50)})`;

    const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;

    if (brightness < 80) {
      return `linear-gradient(135deg, ${baseColor} 0%, ${lighterColor} 100%)`;
    } else if (brightness > 180) {
      return `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 100%)`;
    } else {
      return `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 50%, ${lighterColor} 100%)`;
    }
  }
}
