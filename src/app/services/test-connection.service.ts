import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class TestConnectionService {
  constructor(private apiService: ApiService) {}

  /**
   * Probar la conexión con Django backend
   */
  testConnection(): Observable<any> {
    console.log("🔍 Probando conexión con Django backend...");

    // Intentar conectar al endpoint de test de Django
    return this.apiService.get("/test/");
  }

  /**
   * Probar un endpoint específico
   */
  testSpecificEndpoint(endpoint: string): Observable<any> {
    console.log(`🔍 Probando endpoint específico: ${endpoint}`);
    return this.apiService.get(endpoint);
  }

  /**
   * Obtener la URL completa para debug
   */
  getFullUrl(endpoint: string): string {
    return this.apiService.getFullUrl(endpoint);
  }

  /**
   * Probar endpoints específicos de Django REST Framework
   */
  testDjangoEndpoints(): {
    playlists: Observable<any>;
    songs: Observable<any>;
    artists: Observable<any>;
    auth: Observable<any>;
  } {
    return {
      playlists: this.apiService.get("/playlists/"),
      songs: this.apiService.get("/songs/"),
      artists: this.apiService.get("/artists/"),
      auth: this.apiService.get("/auth/user/"),
    };
  }

  /**
   * Verificar si Django está corriendo
   */
  checkDjangoServer(): Promise<boolean> {
    return new Promise((resolve) => {
      // Primero probar la raíz de la API
      this.apiService.get("/").subscribe({
        next: (response) => {
          console.log("✅ Django backend conectado:", response);
          resolve(true);
        },
        error: (error) => {
          console.error("❌ Error conectando a Django:", error.message);

          // Si falla, probar directamente el backend sin /api
          this.testDirectBackend().then(resolve);
        },
      });
    });
  }

  private testDirectBackend(): Promise<boolean> {
    return new Promise((resolve) => {
      // Probar directamente http://localhost:8000
      fetch("http://localhost:8000")
        .then((response) => {
          if (response.ok) {
            console.log("✅ Django servidor corriendo en puerto 8000");
            resolve(true);
          } else {
            console.log("⚠️ Django responde pero con error:", response.status);
            resolve(false);
          }
        })
        .catch((error) => {
          console.error(
            "❌ Django no está corriendo o hay problemas de CORS:",
            error,
          );
          resolve(false);
        });
    });
  }

  /**
   * Guía de configuración para el desarrollador
   */
  showDjangoSetupGuide(): void {
    console.log(`
🚀 GUÍA DE CONFIGURACIÓN DJANGO + ANGULAR

1. **Verificar que Django esté corriendo:**
   python manage.py runserver 8000

2. **Configurar CORS en Django (settings.py):**
   INSTALLED_APPS = [
     ...
     'corsheaders',
   ]
   
   MIDDLEWARE = [
     'corsheaders.middleware.CorsMiddleware',
     'django.middleware.common.CommonMiddleware',
     ...
   ]
   
   CORS_ALLOWED_ORIGINS = [
     "http://localhost:4200",
     "http://localhost:4201",
   ]
   
   CORS_ALLOW_CREDENTIALS = True

3. **URLs típicas de Django REST Framework:**
   - GET  /api/playlists/
   - GET  /api/playlists/{id}/
   - POST /api/playlists/
   - GET  /api/songs/
   - GET  /api/artists/
   - POST /api/auth/login/
   - POST /api/auth/register/

4. **Verificar endpoints disponibles:**
   - Visita: http://localhost:8000/api/ (Django REST Framework browser)
   - O: http://localhost:8000/swagger/ (si tienes drf-yasg configurado)
    `);
  }

  /**
   * Datos mock mientras configuras el backend
   */
  getDjangoMockData(type: "playlists" | "songs" | "artists"): Observable<any> {
    const mockData = {
      playlists: {
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            name: "Mi Playlist Favorita",
            description: "Las mejores canciones para relajarse",
            cover_image: "https://picsum.photos/300/300?random=1",
            is_public: true,
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
            owner: 1,
            songs_count: 15,
          },
          {
            id: 2,
            name: "Música para Trabajar",
            description: "Concentración y productividad",
            cover_image: "https://picsum.photos/300/300?random=2",
            is_public: true,
            created_at: "2024-01-10T10:00:00Z",
            updated_at: "2024-01-10T10:00:00Z",
            owner: 1,
            songs_count: 25,
          },
        ],
      },
      songs: {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Bohemian Rhapsody",
            artist: 1,
            artist_name: "Queen",
            duration: 355,
            file_url: "https://example.com/song1.mp3",
            plays_count: 1000000,
            likes_count: 50000,
            created_at: "2024-01-01T10:00:00Z",
          },
        ],
      },
      artists: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            name: "Queen",
            image: "https://picsum.photos/300/300?random=10",
            followers_count: 2400000,
            is_verified: true,
            genres: ["Rock", "Classic Rock"],
            created_at: "2024-01-01T10:00:00Z",
          },
        ],
      },
    };

    return of(mockData[type]);
  }
}
