import { AlbumDto } from '../dtos/album.dto';
import { Album, AlbumListItem } from '../entities/album.entity';

export class AlbumMapper {
  static mapAlbumDtoToEntity(dto: AlbumDto): Album {
    return {
      id: dto.id,
      title: dto.title,
      artist_name: dto.artist_name,
      artist_id: dto.artist_id,
      release_date: new Date(dto.release_date),
      cover_url: dto.cover_url,
      genre: dto.description, // Using description as genre fallback
      total_tracks: dto.total_tracks,
      duration_formatted: dto.duration_formatted,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at)
    };
  }

  static mapAlbumListToAlbums(dtos: AlbumDto[]): AlbumListItem[] {
    return dtos.map(dto => ({
      id: dto.id,
      title: dto.title,
      artist_name: dto.artist_name,
      artist_id: dto.artist_id,
      cover_url: dto.cover_url,
      release_date: new Date(dto.release_date),
      total_tracks: dto.total_tracks
    }));
  }
}
