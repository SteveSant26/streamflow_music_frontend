import { SongDto, SongListDto } from '../dtos/song.dto';
import { Song, SongListItem } from '../entities/song.entity';

/**
 * Map SongDto to Song entity
 */
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
    // Calculated fields for compatibility
    duration_seconds: convertFormattedDurationToSeconds(dto.duration_formatted)
  };
}

/**
 * Map SongListDto to SongListItem entity
 */
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

/**
 * Map array of SongListDto to array of Song entities
 */
export function mapSongListToSongs(dtos: SongListDto[]): Song[] {
  return dtos.map(dto => ({
    id: dto.id,
    title: dto.title,
    artist_name: dto.artist_name,
    duration_formatted: dto.duration_formatted,
    genre_names_display: dto.genre_names_display,
    thumbnail_url: dto.thumbnail_url,
    play_count: dto.play_count,
    // Set default values for required fields not in SongListDto
    artist_id: '', // Will be populated from full song data if needed
    // Calculated fields
    duration_seconds: convertFormattedDurationToSeconds(dto.duration_formatted)
  } as Song));
}

/**
 * Convert MM:SS formatted duration to seconds
 */
function convertFormattedDurationToSeconds(formatted: string): number {
  if (!formatted) return 0;
  
  const parts = formatted.split(':');
  if (parts.length !== 2) return 0;
  
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  
  return minutes * 60 + seconds;
}
