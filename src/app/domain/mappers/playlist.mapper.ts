import { 
  Playlist, 
  PlaylistSong, 
  PlaylistWithSongs, 
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  LegacyPlaylist
} from '../entities/playlist.entity';

import {
  PlaylistDto,
  PlaylistSongDto,
  PlaylistWithSongsDto,
  PaginatedPlaylistResponseDto,
  PaginatedPlaylistSongResponseDto,
  CreatePlaylistRequestDto,
  UpdatePlaylistRequestDto,
  AddSongToPlaylistRequestDto
} from '../dtos/playlist.dto';

import { Song } from '../entities/song.entity';

export class PlaylistMapper {
  // DTO to Entity mappings
  static dtoToEntity(dto: PlaylistDto): Playlist {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      user_id: dto.user_id,
      is_default: dto.is_default,
      is_public: dto.is_public,
      total_songs: dto.song_count, // Mapear song_count del DTO a total_songs de la entidad
      playlist_img: dto.playlist_img, // Incluir la imagen de la playlist
      created_at: dto.created_at,
      updated_at: dto.updated_at
    };
  }

  static songDtoToEntity(dto: PlaylistSongDto): PlaylistSong {
    return {
      id: dto.id,
      title: dto.title,
      artist_name: dto.artist_name,
      album_name: dto.album_name,
      duration_seconds: dto.duration_seconds,
      thumbnail_url: dto.thumbnail_url,
      position: dto.position,
      added_at: dto.added_at
    };
  }

  static withSongsDtoToEntity(dto: PlaylistWithSongsDto): PlaylistWithSongs {
    return {
      ...this.dtoToEntity(dto),
      songs: dto.songs ? dto.songs.map(song => this.songDtoToEntity(song)) : []
    };
  }

  static paginatedDtoToEntity(dto: PaginatedPlaylistResponseDto): PaginatedPlaylistResponse {
    return {
      count: dto.count,
      next: dto.next,
      previous: dto.previous,
      results: dto.results.map(playlist => this.dtoToEntity(playlist))
    };
  }

  static paginatedSongDtoToEntity(dto: PaginatedPlaylistSongResponseDto): PaginatedPlaylistSongResponse {
    return {
      count: dto.count,
      next: dto.next,
      previous: dto.previous,
      results: dto.results.map(song => this.songDtoToEntity(song))
    };
  }

  // Entity to DTO mappings (for requests)
  static createDtoFromEntity(entity: CreatePlaylistDto): CreatePlaylistRequestDto {
    return {
      name: entity.name,
      description: entity.description,
      is_public: entity.is_public
    };
  }

  static updateDtoFromEntity(entity: UpdatePlaylistDto): UpdatePlaylistRequestDto {
    const result: UpdatePlaylistRequestDto = {};
    
    if (entity.name !== undefined) {
      result.name = entity.name;
    }
    if (entity.description !== undefined) {
      result.description = entity.description;
    }
    if (entity.is_public !== undefined) {
      result.is_public = entity.is_public;
    }
    
    return result;
  }

  static addSongDtoFromEntity(entity: AddSongToPlaylistDto): AddSongToPlaylistRequestDto {
    return {
      song_id: entity.song_id,
      position: entity.position
    };
  }

  // Legacy mappings (for backward compatibility)
  static toLegacyPlaylist(playlist: PlaylistWithSongs): LegacyPlaylist {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverImage: playlist.playlist_img || this.generateCoverImage(playlist.id), // Usar imagen de DB o fallback
      isPublic: playlist.is_public,
      createdDate: playlist.created_at,
      songCount: playlist.total_songs,
      duration: playlist.songs.reduce((total, song) => total + song.duration_seconds, 0),
      owner: {
        id: playlist.user_id,
        username: 'Usuario'
      },
      songs: playlist.songs.map(song => this.playlistSongToSong(song))
    };
  }

  static playlistSongToSong(playlistSong: PlaylistSong): Song {
    return {
      id: playlistSong.id,
      title: playlistSong.title,
      artist_id: playlistSong.artist_name ? `artist_${playlistSong.id}` : '',
      artist_name: playlistSong.artist_name || 'Artista Desconocido',
      album_id: playlistSong.album_name ? `album_${playlistSong.id}` : '',
      album_name: playlistSong.album_name || 'Álbum Desconocido',
      duration_formatted: this.formatDuration(playlistSong.duration_seconds),
      duration_seconds: playlistSong.duration_seconds,
      file_url: undefined, // Will be set by song service
      thumbnail_url: playlistSong.thumbnail_url || this.generateThumbnail(playlistSong.id),
      youtube_url: undefined, // Will be set by song service
      genre_names_display: 'Sin género', // Will be set by song service
      play_count: 0, // Will be set by song service
      youtube_view_count: 0,
      youtube_like_count: 0,
      is_explicit: false,
      audio_downloaded: true,
      created_at: new Date(playlistSong.added_at),
      published_at: new Date(playlistSong.added_at)
    };
  }

  // Utility methods
  private static formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private static generateCoverImage(playlistId: string): string {
    return `https://picsum.photos/300/300?random=${playlistId}`;
  }

  private static generateThumbnail(songId: string): string {
    return `https://picsum.photos/64/64?random=${songId}`;
  }

  // Validation methods
  static validateCreatePlaylist(data: CreatePlaylistDto): string[] {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('El nombre de la playlist es requerido');
    }
    
    if (data.name && data.name.length > 255) {
      errors.push('El nombre de la playlist no puede exceder 255 caracteres');
    }
    
    return errors;
  }

  static validateUpdatePlaylist(data: UpdatePlaylistDto): string[] {
    const errors: string[] = [];
    
    if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
      errors.push('El nombre de la playlist no puede estar vacío');
    }
    
    if (data.name && data.name.length > 255) {
      errors.push('El nombre de la playlist no puede exceder 255 caracteres');
    }
    
    return errors;
  }

  static validateAddSongToPlaylist(data: AddSongToPlaylistDto): string[] {
    const errors: string[] = [];
    
    if (!data.song_id || data.song_id.trim().length === 0) {
      errors.push('El ID de la canción es requerido');
    }
    
    if (data.position !== undefined && data.position < 1) {
      errors.push('La posición debe ser mayor a 0');
    }
    
    return errors;
  }

  // Métodos adicionales para los servicios HTTP

  // Alias para compatibilidad
  static readonly fromPlaylistDto = PlaylistMapper.dtoToEntity;
  static readonly fromPlaylistSongDto = PlaylistMapper.songDtoToEntity;
  static readonly fromPlaylistWithSongsDto = PlaylistMapper.withSongsDtoToEntity;

  // Mappers para respuestas paginadas
  static fromPaginatedDto(response: PaginatedPlaylistResponseDto): PaginatedPlaylistResponse {
    // Validar que la respuesta tenga la estructura esperada
    if (!response) {
      throw new Error('Respuesta de playlists vacía o inválida');
    }

    if (!response.results || !Array.isArray(response.results)) {
      console.warn('Respuesta de playlists sin resultados válidos:', response);
      return {
        count: response.count || 0,
        next: response.next || null,
        previous: response.previous || null,
        results: []
      };
    }

    return {
      count: response.count || 0,
      next: response.next || null,
      previous: response.previous || null,
      results: response.results.map(PlaylistMapper.dtoToEntity)
    };
  }

  static readonly fromPaginatedPlaylistResponseDto = PlaylistMapper.fromPaginatedDto;

  static fromPaginatedSongDto(response: PaginatedPlaylistSongResponseDto): PaginatedPlaylistSongResponse {
    return {
      count: response.count,
      next: response.next,
      previous: response.previous,
      results: response.results.map(PlaylistMapper.songDtoToEntity)
    };
  }

  static readonly fromPaginatedPlaylistSongResponseDto = PlaylistMapper.fromPaginatedSongDto;

  // Mappers para requests
  static toCreatePlaylistRequestDto(data: CreatePlaylistDto): CreatePlaylistRequestDto {
    return {
      name: data.name,
      description: data.description,
      is_public: data.is_public
    };
  }

  static toUpdatePlaylistRequestDto(data: UpdatePlaylistDto): UpdatePlaylistRequestDto {
    const result: UpdatePlaylistRequestDto = {};
    
    if (data.name !== undefined) result.name = data.name;
    if (data.description !== undefined) result.description = data.description;
    if (data.is_public !== undefined) result.is_public = data.is_public;
    
    return result;
  }

  static toAddSongToPlaylistRequestDto(data: AddSongToPlaylistDto): AddSongToPlaylistRequestDto {
    return {
      song_id: data.song_id,
      position: data.position
    };
  }
}

// Funciones de compatibilidad con la implementación anterior
export function mapPlaylistDtoToEntity(dto: PlaylistDto): Playlist {
  return PlaylistMapper.dtoToEntity(dto);
}

export function mapPlaylistSongDtoToEntity(dto: PlaylistSongDto): PlaylistSong {
  return PlaylistMapper.songDtoToEntity(dto);
}

export function mapPlaylistWithSongsDtoToEntity(dto: PlaylistWithSongsDto): PlaylistWithSongs {
  return PlaylistMapper.withSongsDtoToEntity(dto);
}

export function mapPaginatedPlaylistResponse(response: PaginatedPlaylistResponseDto): Playlist[] {
  return response.results.map(PlaylistMapper.dtoToEntity);
}
