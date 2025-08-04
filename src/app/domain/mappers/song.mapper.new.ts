import { Song, SongListItem } from '../entities/song.entity';
import { SongDto, SongListDto } from '../dtos/song.dto';

// Mappers de DTO a Entity
export function mapSongDtoToEntity(dto: SongDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist_id: dto.artist_id,
    artist_name: dto.artist_name,
    album_id: dto.album_id,
    album_name: dto.album_name,
    duration_formatted: dto.duration_formatted,
    genre_names_display: dto.genre_names_display,
    file_url: dto.file_url,
    thumbnail_url: dto.thumbnail_url,
    youtube_url: dto.youtube_url,
    youtube_id: dto.youtube_id,
    play_count: dto.play_count,
    youtube_view_count: dto.youtube_view_count,
    youtube_like_count: dto.youtube_like_count,
    is_explicit: dto.is_explicit,
    audio_downloaded: dto.audio_downloaded,
    created_at: dto.created_at ? new Date(dto.created_at) : undefined,
    updated_at: dto.updated_at ? new Date(dto.updated_at) : undefined,
    published_at: dto.published_at ? new Date(dto.published_at) : undefined,
    // Compatibility aliases
    albumCover: dto.thumbnail_url,
    audioUrl: dto.file_url
  };
}

export function mapSongListDtoToEntity(dto: SongListDto): SongListItem {
  return {
    id: dto.id,
    title: dto.title,
    artist_name: dto.artist_name,
    duration_formatted: dto.duration_formatted,
    genre_names_display: dto.genre_names_display,
    thumbnail_url: dto.thumbnail_url,
    play_count: dto.play_count
  };
}

// Convert SongListItem array to Songs array for compatibility
export function mapSongListToSongs(songList: SongListDto[]): Song[] {
  return songList.map(dto => ({
    id: dto.id,
    title: dto.title,
    artist_id: '', // No disponible en SongListDto
    artist_name: dto.artist_name,
    duration_formatted: dto.duration_formatted,
    genre_names_display: dto.genre_names_display,
    file_url: undefined,
    thumbnail_url: dto.thumbnail_url,
    youtube_url: undefined,
    youtube_id: undefined,
    play_count: dto.play_count,
    youtube_view_count: undefined,
    youtube_like_count: undefined,
    is_explicit: undefined,
    audio_downloaded: undefined,
    created_at: undefined,
    updated_at: undefined,
    published_at: undefined,
    albumCover: dto.thumbnail_url,
    audioUrl: undefined
  }));
}

// Helper function to calculate duration in seconds from MM:SS format
export function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  }
  return 0;
}
