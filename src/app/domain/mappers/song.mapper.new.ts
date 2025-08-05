import { SongDto, SongListDto } from '../dtos/song.dto';
import { Song, SongListItem } from '../entities/song.entity';

/**
 * Map SongDto to Song entity
 */
export function mapSongDtoToEntity(dto: SongDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist_id: dto.artist_id || '',
    artist_name: dto.artist_name,
    album_id: dto.album_id,
    album_name: dto.album_name,
    album_title: dto.album_title, // Backend field
    duration_formatted: dto.duration_formatted || '0:00',
    genre_names_display: dto.genre_names_display || '',
    file_url: dto.file_url,       // ✅ Backend audio URL
    thumbnail_url: dto.thumbnail_url,
    source_type: dto.source_type, // ✅ Backend field
    source_id: dto.source_id,     // ✅ Backend field (YouTube ID)
    source_url: dto.source_url,   // ✅ Backend field (YouTube URL)
    youtube_url: dto.youtube_url, // Legacy field
    youtube_id: dto.youtube_id,   // Legacy field
    play_count: dto.play_count,
    youtube_view_count: dto.youtube_view_count,
    youtube_like_count: dto.youtube_like_count,
    is_explicit: dto.is_explicit,
    audio_downloaded: dto.audio_downloaded,
    created_at: dto.created_at ? new Date(dto.created_at) : undefined,
    updated_at: dto.updated_at ? new Date(dto.updated_at) : undefined,
    published_at: dto.published_at ? new Date(dto.published_at) : undefined,
    // Calculated fields for compatibility
    duration_seconds: convertFormattedDurationToSeconds(dto.duration_formatted || '0:00'),
    albumCover: dto.thumbnail_url, // Alias for compatibility
    audioUrl: dto.file_url, // Alias for compatibility
    // TODO: Add artist and album full objects when backend provides them
    artist: dto.artist_id ? {
      id: dto.artist_id,
      name: dto.artist_name || 'Unknown Artist',
      biography: '',
      country: '',
      image_url: dto.thumbnail_url,
      followers_count: 0,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    } : undefined,
    album: dto.album_id ? {
      id: dto.album_id,
      title: dto.album_name || dto.album_title || 'Unknown Album',
      artist_name: dto.artist_name || 'Unknown Artist',
      artist_id: dto.artist_id || '',
      release_date: dto.published_at ? new Date(dto.published_at) : new Date(),
      cover_url: dto.thumbnail_url,
      genre: dto.genre_names_display || '',
      total_tracks: 1,
      duration_formatted: dto.duration_formatted || '0:00',
      created_at: new Date(),
      updated_at: new Date()
    } : undefined
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
    duration_formatted: dto.duration_formatted || '0:00',
    genre_names_display: dto.genre_names_display || '',
    thumbnail_url: dto.thumbnail_url,
    play_count: dto.play_count,
    // ✅ Map backend fields that were missing
    file_url: dto.file_url,       // Backend audio URL - THIS WAS MISSING!
    source_type: dto.source_type, // Backend field
    source_id: dto.source_id,     // Backend field (YouTube ID)
    source_url: dto.source_url,   // Backend field (YouTube URL)
    album_title: dto.album_title, // Backend field
    // Legacy fields for compatibility
    youtube_url: dto.youtube_url,
    youtube_id: dto.youtube_id,
    album_name: dto.album_name,
    // Set default values for required fields not in SongListDto
    artist_id: dto.artist_id || '', // Will be populated from full song data if needed
    // Calculated fields
    duration_seconds: convertFormattedDurationToSeconds(dto.duration_formatted || '0:00'),
    audioUrl: dto.file_url, // Alias for compatibility
    albumCover: dto.thumbnail_url // Alias for compatibility
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
