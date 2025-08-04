import { ArtistDto } from '../dtos/artist.dto';
import { Artist, ArtistListItem } from '../entities/artist.entity';

export class ArtistMapper {
  static mapArtistDtoToEntity(dto: ArtistDto): Artist {
    return {
      id: dto.id,
      name: dto.name,
      biography: dto.biography,
      country: dto.country,
      image_url: dto.image_url,
      followers_count: dto.followers_count,
      is_verified: dto.is_verified,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at)
    };
  }

  static mapArtistListToArtists(dtos: ArtistDto[]): ArtistListItem[] {
    return dtos.map(dto => ({
      id: dto.id,
      name: dto.name,
      country: dto.country,
      image_url: dto.image_url,
      followers_count: dto.followers_count,
      is_verified: dto.is_verified
    }));
  }
}
