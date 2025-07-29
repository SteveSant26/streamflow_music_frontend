# 🔧 Configuración Django Backend para StreamFlow Music

## 📋 Requisitos Previos

Antes de conectar el frontend con Django, asegúrate de que:

1. **Django esté corriendo** en `http://localhost:8000`
2. **CORS esté configurado** correctamente
3. **PostgreSQL o SQLite** funcionando
4. **Migraciones aplicadas**

## 🚀 Configuración Paso a Paso

### 1. Configurar CORS en Django

En tu archivo `settings.py`:

```python
# settings.py

INSTALLED_APPS = [
    # ... otras apps
    'corsheaders',
    'rest_framework',
    # tus apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... otros middlewares
]

# Configuración CORS para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Angular dev server
    "http://127.0.0.1:4200",
]

# Para desarrollo, puedes usar:
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo!

# Configuración REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### 2. URLs principales en Django

En tu `urls.py` principal:

```python
# urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('your_music_app.urls')),  # Ajusta según tu app
    path('api/auth/', include('your_auth_app.urls')),  # Para autenticación
]
```

### 3. URLs de la app de música

```python
# your_music_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'playlists', views.PlaylistViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'artists', views.ArtistViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchView.as_view(), name='search'),
]
```

### 4. Modelos esperados por el frontend

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class Artist(models.Model):
    name = models.CharField(max_length=200)
    image = models.URLField(blank=True, null=True)
    followers = models.IntegerField(default=0)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    duration = models.IntegerField()  # en segundos
    audio_url = models.URLField()
    cover_image = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True)
    is_explicit = models.BooleanField(default=False)
    play_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Playlist(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, blank=True)
    cover_image = models.URLField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def songs_count(self):
        return self.songs.count()

    @property
    def total_duration(self):
        return sum(song.duration for song in self.songs.all())
```

### 5. Serializers para la API

```python
# serializers.py
from rest_framework import serializers
from .models import Playlist, Song, Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class SongSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Song
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    songs_count = serializers.ReadOnlyField()
    total_duration = serializers.ReadOnlyField()

    class Meta:
        model = Playlist
        fields = '__all__'
```

### 6. ViewSets para la API

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Playlist, Song, Artist
from .serializers import PlaylistSerializer, SongSerializer, ArtistSerializer

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        queryset = Playlist.objects.all()
        if self.action == 'list':
            queryset = queryset.filter(is_public=True)
        return queryset

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
```

## 🧪 Comandos para Probar

### Iniciar Django:

```bash
python manage.py runserver 8000
```

### Probar endpoints manualmente:

```bash
curl http://localhost:8000/api/playlists/
curl http://localhost:8000/api/songs/
curl http://localhost:8000/api/artists/
```

## 🔍 Verificación

1. **Django corriendo**: `http://localhost:8000/admin`
2. **API funcionando**: `http://localhost:8000/api/playlists/`
3. **CORS configurado**: No hay errores en la consola del navegador
4. **Frontend conectado**: Ve a `http://localhost:4200/test-connection`

## ⚡ Datos de Prueba

Para tener datos de prueba, puedes crear un management command:

```python
# management/commands/load_sample_data.py
from django.core.management.base import BaseCommand
from your_app.models import Artist, Song, Playlist
from django.contrib.auth.models import User

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Crear datos de ejemplo
        artist = Artist.objects.create(
            name="Bad Bunny",
            image="https://example.com/badbunny.jpg",
            verified=True
        )

        song = Song.objects.create(
            title="Un Verano Sin Ti",
            artist=artist,
            duration=180,
            audio_url="https://example.com/song.mp3"
        )

        user = User.objects.first() or User.objects.create_user('admin', 'admin@test.com', 'admin')

        playlist = Playlist.objects.create(
            name="Reggaeton 2024",
            description="Los mejores hits",
            owner=user
        )
        playlist.songs.add(song)
```

Ejecutar: `python manage.py load_sample_data`

## 🎯 Next Steps

1. ✅ Configura Django con CORS
2. ✅ Aplica migraciones
3. ✅ Carga datos de prueba
4. ✅ Inicia Django en puerto 8000
5. ✅ Ve a `/test-connection` en Angular
6. ✅ ¡Empieza a probar la integración!
