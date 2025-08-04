import { 
  Playlist, 
  PlaylistWithSongs, 
  PlaylistSong 
} from '../entities/playlist.entity';
import { 
  PlaylistDto, 
  PlaylistWithSongsDto,
  PlaylistSongDto,
  PaginatedPlaylistResponse 
} from '../dtos/playlist.dto';

export function mapPlaylistDtoToEntity(dto: PlaylistDto): Playlist {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    user_id: dto.user_id,
    is_default: dto.is_default,
    is_public: dto.is_public,
    total_songs: dto.total_songs,
    created_at: dto.created_at,
    updated_at: dto.updated_at
  };
}

export function mapPlaylistSongDtoToEntity(dto: PlaylistSongDto): PlaylistSong {
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

export function mapPlaylistWithSongsDtoToEntity(dto: PlaylistWithSongsDto): PlaylistWithSongs {
  return {
    ...mapPlaylistDtoToEntity(dto),
    songs: dto.songs.map(mapPlaylistSongDtoToEntity)
  };
}

export function mapPaginatedPlaylistResponse(response: PaginatedPlaylistResponse): Playlist[] {
  return response.results.map(mapPlaylistDtoToEntity);
}
