import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-artist",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artist-container p-6">
      <div class="artist-header mb-8" *ngIf="artist">
        <!-- Artist Hero Section -->
        <div
          class="relative rounded-2xl overflow-hidden text-white p-8 mb-6 transition-all duration-1000"
          [style.background]="artist.gradient"
        >
          <div class="flex flex-col md:flex-row items-start gap-6">
            <img
              [src]="artist.image"
              [alt]="artist.name"
              class="w-48 h-48 rounded-full object-cover shadow-2xl"
              (load)="onImageLoad($event)"
              (error)="onImageError($event)"
              crossorigin="anonymous"
            />
            <div class="flex-1">
              <h1 class="text-5xl font-bold mb-2">{{ artist.name }}</h1>
              <p class="text-xl opacity-90 mb-4">{{ artist.genre }}</p>
              <div class="flex flex-wrap gap-4 text-sm opacity-80">
                <span>{{ artist.monthlyListeners }} oyentes mensuales</span>
                <span>{{ artist.followers }} seguidores</span>
                <span>Activo desde {{ artist.activeYears }}</span>
              </div>
              <!-- Botón de prueba para cambiar imagen -->
              <button
                (click)="testDifferentImage()"
                class="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
              >
                🎨 Probar otra imagen
              </button>
            </div>
          </div>
        </div>

        <!-- Artist Bio -->
        <div
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6"
        >
          <h2 class="text-2xl font-semibold mb-4">Biografía</h2>
          <p class="text-gray-700 leading-relaxed">{{ artist.biography }}</p>
        </div>
      </div>

      <div class="artist-content" *ngIf="artist">
        <!-- Popular Songs -->
        <section class="popular-songs mb-8">
          <h2 class="text-2xl font-semibold mb-4">Canciones populares</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div
              *ngFor="let song of artist.popularSongs; let i = index"
              class="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span class="text-gray-500 w-8 text-center">{{ i + 1 }}</span>
              <div class="flex-1 ml-4">
                <h3 class="font-medium">{{ song.title }}</h3>
                <p class="text-sm text-gray-600">{{ song.album }}</p>
              </div>
              <div class="text-sm text-gray-500">
                {{ song.duration }}
              </div>
            </div>
          </div>
        </section>

        <!-- Albums -->
        <section class="albums mb-8">
          <h2 class="text-2xl font-semibold mb-4">Álbumes</h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <div
              *ngFor="let album of artist.albums"
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <img
                [src]="album.cover"
                [alt]="album.title"
                class="w-full aspect-square object-cover rounded-lg mb-3"
              />
              <h3 class="font-semibold mb-1">{{ album.title }}</h3>
              <p class="text-sm text-gray-600 mb-1">{{ album.year }}</p>
              <p class="text-xs text-gray-500">{{ album.tracks }} canciones</p>
            </div>
          </div>
        </section>

        <!-- Awards & Recognition -->
        <section class="awards mb-8" *ngIf="artist.awards.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Premios y reconocimientos</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                *ngFor="let award of artist.awards"
                class="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <h4 class="font-medium">{{ award.name }}</h4>
                  <p class="text-sm text-gray-600">
                    {{ award.year }} - {{ award.category }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Default view for other artists -->
      <div *ngIf="!artist" class="text-center py-12">
        <h1 class="text-4xl font-bold mb-2">Artista {{ artistId }}</h1>
        <p class="text-gray-600">Información del artista próximamente</p>
      </div>
    </div>
  `,
})
export class ArtistComponent implements OnInit {
  artistId: string | null = null;
  artist: any = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.artistId = this.route.snapshot.paramMap.get("id");
    if (this.artistId === "1") {
      this.loadGorillazData();
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    console.log(
      "Imagen cargada:",
      img.src,
      "Dimensiones:",
      img.width,
      "x",
      img.height,
    );

    // Pequeño delay para asegurar que la imagen está completamente cargada
    setTimeout(() => {
      this.extractColorsFromImage(img);
    }, 100);
  }

  onImageError(event: Event) {
    console.error("Error al cargar la imagen:", event);
    this.applyFallbackGradient();
  }

  testDifferentImage() {
    const testImages = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", // Original
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", // Azul/morado
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", // Rojizo
      "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop", // Verde
    ];

    const currentIndex = testImages.indexOf(this.artist.image);
    const nextIndex = (currentIndex + 1) % testImages.length;

    console.log("🎨 Cambiando a imagen:", testImages[nextIndex]);
    this.artist.image = testImages[nextIndex];
  }

  private extractColorsFromImage(img: HTMLImageElement) {
    try {
      console.log("Iniciando extracción de colores...");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("No se pudo obtener contexto 2D del canvas");
        return;
      }

      // Reducir el tamaño para análisis más rápido
      const analysisSize = 200;
      canvas.width = analysisSize;
      canvas.height = analysisSize;

      // Configurar CORS para imágenes externas
      img.crossOrigin = "anonymous";

      ctx.drawImage(img, 0, 0, analysisSize, analysisSize);

      // Extraer colores de diferentes puntos de la imagen
      const colors = [];
      const samples = 50; // Más muestras para mejor análisis

      for (let i = 0; i < samples; i++) {
        for (let j = 0; j < samples; j++) {
          const x = Math.floor((analysisSize / samples) * i);
          const y = Math.floor((analysisSize / samples) * j);

          const imageData = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = imageData.data;

          // Solo considerar píxeles no transparentes y con suficiente saturación
          if (a > 200 && r + g + b > 60 && r + g + b < 700) {
            colors.push({ r, g, b });
          }
        }
      }

      console.log("Colores extraídos:", colors.length);

      if (colors.length > 0) {
        const dominantColor = this.findDominantColor(colors);
        console.log("Color dominante:", dominantColor);

        const gradient = this.generateGradient(dominantColor);
        console.log("Gradiente generado:", gradient);

        if (this.artist) {
          this.artist.gradient = gradient;
          console.log("Gradiente aplicado al artista");
          // Forzar detección de cambios
          this.cdr.detectChanges();
        }
      } else {
        console.warn("No se encontraron colores válidos en la imagen");
        this.applyFallbackGradient();
      }
    } catch (error) {
      console.error("Error al extraer colores de la imagen:", error);
      this.applyFallbackGradient();
    }
  }

  private applyFallbackGradient() {
    if (this.artist) {
      this.artist.gradient =
        "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)";
      console.log("Aplicado gradiente de fallback");
    }
  }

  private findDominantColor(
    colors: Array<{ r: number; g: number; b: number }>,
  ) {
    // Agrupar colores similares y encontrar el más común
    const colorGroups: any = {};

    colors.forEach((color) => {
      // Reducir la precisión del color para agrupar similares
      const key = `${Math.floor(color.r / 20) * 20}-${Math.floor(color.g / 20) * 20}-${Math.floor(color.b / 20) * 20}`;
      if (!colorGroups[key]) {
        colorGroups[key] = { ...color, count: 0 };
      }
      colorGroups[key].count++;
    });

    // Encontrar el grupo con más colores
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
    // Crear variaciones del color dominante
    const baseColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

    // Color más oscuro para el gradiente
    const darkerColor = `rgb(${Math.max(0, color.r - 60)}, ${Math.max(0, color.g - 60)}, ${Math.max(0, color.b - 60)})`;

    // Color más claro para el gradiente
    const lighterColor = `rgb(${Math.min(255, color.r + 40)}, ${Math.min(255, color.g + 40)}, ${Math.min(255, color.b + 40)})`;

    // Determinar si el color es muy oscuro o muy claro para ajustar la dirección
    const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;

    if (brightness < 100) {
      // Color oscuro - gradiente hacia más claro
      return `linear-gradient(135deg, ${baseColor} 0%, ${lighterColor} 100%)`;
    } else if (brightness > 200) {
      // Color claro - gradiente hacia más oscuro
      return `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 100%)`;
    } else {
      // Color medio - gradiente en ambas direcciones
      return `linear-gradient(135deg, ${darkerColor} 0%, ${baseColor} 50%, ${lighterColor} 100%)`;
    }
  }

  private loadGorillazData() {
    this.artist = {
      id: 1,
      name: "Gorillaz",
      genre: "Alternative Rock, Electronic, Hip Hop",
      image: "/assets/gorillaz2.jpg", // Imagen de prueba
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Gradiente inicial que será reemplazado
      monthlyListeners: "45.2M",
      followers: "12.8M",
      activeYears: "1998 - presente",
      biography: `Gorillaz es una banda virtual británica creada en 1998 por Damon Albarn y Jamie Hewlett. La banda está compuesta por cuatro miembros ficticios animados: 2-D (vocalista, teclados), Murdoc Niccals (bajo), Noodle (guitarra, teclados, voz ocasional) y Russel Hobbs (batería). Gorillaz ha sido aclamado como uno de los proyectos musicales más innovadores y exitosos del siglo XXI, combinando elementos de rock alternativo, hip hop, electrónica y pop.

El concepto único de la banda como un grupo completamente virtual, con personajes animados que tienen sus propias personalidades y trasfondos elaborados, fue revolucionario en la industria musical. A lo largo de su carrera, Gorillaz ha colaborado con una amplia gama de artistas, desde De La Soul y Del the Funky Homosapien hasta Elton John y Beck, creando un sonido ecléctico que trasciende géneros musicales.

La banda ha lanzado múltiples álbumes exitosos, incluyendo su álbum debut homónimo (2001), "Demon Days" (2005), "Plastic Beach" (2010), "Humanz" (2017), "The Now Now" (2018), "Song Machine" (2020) y "Cracker Island" (2023). Sus videos musicales y presentaciones en vivo utilizan tecnología de vanguardia para dar vida a los personajes animados, creando experiencias visuales únicas.`,
      popularSongs: [
        { title: "Feel Good Inc.", album: "Demon Days", duration: "3:41" },
        { title: "Clint Eastwood", album: "Gorillaz", duration: "5:41" },
        {
          title: "On Melancholy Hill",
          album: "Plastic Beach",
          duration: "3:53",
        },
        { title: "Saturnz Barz", album: "Humanz", duration: "3:58" },
        { title: "Humility", album: "The Now Now", duration: "3:01" },
        { title: "Dirty Harry", album: "Demon Days", duration: "3:43" },
        { title: "Stylo", album: "Plastic Beach", duration: "4:30" },
        { title: "Tranz", album: "The Now Now", duration: "2:42" },
        { title: "Cracker Island", album: "Cracker Island", duration: "3:42" },
        { title: "19-2000", album: "Gorillaz", duration: "3:27" },
      ],
      albums: [
        {
          title: "Gorillaz",
          year: "2001",
          tracks: 15,
          cover: "/assets/playlists/playlist1.jpg",
        },
        {
          title: "Demon Days",
          year: "2005",
          tracks: 15,
          cover: "/assets/playlists/playlist2.webp",
        },
        {
          title: "Plastic Beach",
          year: "2010",
          tracks: 16,
          cover: "/assets/playlists/playlist3.jpg",
        },
        {
          title: "Humanz",
          year: "2017",
          tracks: 20,
          cover: "/assets/playlists/playlist4.jpg",
        },
        {
          title: "The Now Now",
          year: "2018",
          tracks: 11,
          cover: "/assets/playlists/playlist1.jpg",
        },
        {
          title: "Song Machine, Season One",
          year: "2020",
          tracks: 17,
          cover: "/assets/playlists/playlist2.webp",
        },
        {
          title: "Cracker Island",
          year: "2023",
          tracks: 10,
          cover: "/assets/playlists/playlist3.jpg",
        },
      ],
      awards: [
        {
          name: "Grammy Award",
          year: "2006",
          category: "Best Pop Collaboration with Vocals - Feel Good Inc.",
        },
        { name: "BRIT Award", year: "2006", category: "Best British Group" },
        {
          name: "MTV Video Music Award",
          year: "2005",
          category: "Best Group Video - Feel Good Inc.",
        },
        {
          name: "Q Award",
          year: "2005",
          category: "Best Video - Feel Good Inc.",
        },
        {
          name: "Ivor Novello Award",
          year: "2002",
          category: "Best Contemporary Song - Clint Eastwood",
        },
        { name: "NME Award", year: "2006", category: "Best Band" },
      ],
    };
  }
}
