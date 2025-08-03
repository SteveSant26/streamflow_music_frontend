import { Song } from '../entities/song.entity';
import { SongDto, SongSearchDto } from '../dtos/song.dto';

// Mappers de DTO a Entity
export function mapSongDtoToEntity(dto: SongDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist_name,
    album: dto.album_title,
    genre: dto.genre_name,
    duration: dto.duration_formatted,
    durationSeconds: dto.duration_seconds,
    fileUrl: dto.file_url,
    thumbnailUrl: dto.thumbnail_url,
    youtubeUrl: dto.youtube_url,
    tags: dto.tags,
    playCount: dto.play_count,
    youtubeViewCount: dto.youtube_view_count,
    youtubeLikeCount: dto.youtube_like_count,
    isExplicit: dto.is_explicit,
    audioDownloaded: dto.audio_downloaded,
    createdAt: new Date(dto.created_at),
    publishedAt: new Date(dto.published_at)
  };
}

export function mapSongSearchDtoToEntity(dto: SongSearchDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist_name,
    album: dto.album_title,
    genre: '', // No disponible en search DTO
    duration: dto.duration_formatted,
    durationSeconds: 0, // No disponible en search DTO
    fileUrl: dto.file_url,
    thumbnailUrl: dto.thumbnail_url,
    youtubeUrl: '',
    tags: [],
    playCount: dto.play_count,
    youtubeViewCount: 0,
    youtubeLikeCount: 0,
    isExplicit: false,
    audioDownloaded: dto.audio_downloaded,
    createdAt: new Date(),
    publishedAt: new Date()
  };
}
