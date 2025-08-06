import { AlbumDto } from '../dtos/album.dto';
import { Album, AlbumListItem } from '../entities/album.entity';

export class AlbumMapper {
  static mapAlbumDtoToEntity(dto: AlbumDto): Album {
    return {
      id: dto.id,
      title: dto.title,
      artist_name: dto.artist_name,
      artist_id: dto.artist_id,
      release_date: dto.release_date ? new Date(dto.release_date) : null,
      cover_url: dto.cover_image_url || '',
      genre: dto.description || '', // Using description as genre fallback
      total_tracks: dto.total_tracks,
      duration_formatted: '', // This field doesn't exist in API response, calculate separately
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
      cover_url: dto.cover_image_url || '',
      release_date: dto.release_date ? new Date(dto.release_date) : null,
      total_tracks: dto.total_tracks
    }));
  }
}
