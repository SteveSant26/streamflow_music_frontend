import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
  progress: number;
  cover: string;
  gradient: string;
  isPlaying: boolean;
  lyrics?: string;
}

@Component({
  selector: "app-current-song",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./currentsong.html",
  styleUrls: ["./current-song.css"],
})
export class CurrentSongComponent implements OnInit, OnDestroy {
  currentSong: Song | null = null;
  showLyricsPanel = false;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  ngOnInit() {
    this.loadCurrentSong();
    // Evitar scroll en el body solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = "hidden";
      this.document.body.style.margin = "0";
      this.document.body.style.padding = "0";
    }
  }

  ngOnDestroy() {
    // Restaurar scroll cuando se salga de la vista solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = "";
      this.document.body.style.margin = "";
      this.document.body.style.padding = "";
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    console.log("Imagen de canción cargada:", img.src);

    setTimeout(() => {
      this.extractColorsFromImage(img);
    }, 100);
  }

  onImageError(event: Event) {
    console.error("Error al cargar imagen de canción:", event);
    this.applyFallbackGradient();
  }

  togglePlayPause() {
    if (this.currentSong) {
      this.currentSong.isPlaying = !this.currentSong.isPlaying;
      console.log(this.currentSong.isPlaying ? "Reproduciendo" : "Pausado");
    }
  }

  toggleLyricsPanel() {
    this.showLyricsPanel = !this.showLyricsPanel;
    console.log(
      "Panel de letras:",
      this.showLyricsPanel ? "Abierto" : "Cerrado",
    );
  }

  goBack() {
    this.router.navigate(["/home"]);
  }

  skipPrevious() {
    console.log("Canción anterior");
    // Aquí iría la lógica para cambiar a la canción anterior
  }

  skipNext() {
    console.log("Siguiente canción");
    // Aquí iría la lógica para cambiar a la siguiente canción
  }

  onProgressClick(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const newProgress = (clickX / width) * 100;

    if (this.currentSong) {
      this.currentSong.progress = newProgress;
      console.log("Nuevo progreso:", newProgress + "%");
    }
  }

  private extractColorsFromImage(img: HTMLImageElement) {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyFallbackGradient();
      return;
    }

    try {
      const canvas = this.document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("No se pudo obtener contexto 2D del canvas");
        return;
      }

      const analysisSize = 150;
      canvas.width = analysisSize;
      canvas.height = analysisSize;

      img.crossOrigin = "anonymous";
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
      console.error("Error al extraer colores:", error);
      this.applyFallbackGradient();
    }
  }

  private applyFallbackGradient() {
    if (this.currentSong) {
      this.currentSong.gradient =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  }

  private findDominantColor(
    colors: Array<{ r: number; g: number; b: number }>,
  ) {
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

  private loadCurrentSong() {
    // Simulando datos de la canción actual
    this.currentSong = {
      id: 1,
      title: "Feel Good Inc.",
      artist: "Gorillaz",
      album: "Demon Days",
      duration: "3:41",
      currentTime: "1:23",
      progress: 37,
      cover: "/assets/gorillaz2.jpg",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      isPlaying: true,
    };
  }
}
