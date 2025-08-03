import { Playlist } from '../entities/playlist.entity';
import { PlaylistDto, PaginatedPlaylistResponse } from '../dtos/playlist.dto';
import { mapSongDtoToEntity } from './song.mapper';

export function mapPlaylistDtoToEntity(dto: PlaylistDto): Playlist {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    coverImage: dto.coverImage,
    isPublic: dto.isPublic,
    createdDate: dto.createdDate,
    songs: dto.songs.map(mapSongDtoToEntity),
    songCount: dto.songCount,
    duration: dto.duration,
    owner: dto.owner
  };
}

export function mapPaginatedPlaylistResponse(response: PaginatedPlaylistResponse): Playlist[] {
  return response.results.map(mapPlaylistDtoToEntity);
}
