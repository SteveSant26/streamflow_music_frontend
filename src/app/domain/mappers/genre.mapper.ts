import { GenreDto } from '../dtos/genre.dto';
import { Genre, GenreListItem } from '../entities/genre.entity';

export class GenreMapper {
  static mapGenreDtoToEntity(dto: GenreDto): Genre {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description ?? undefined,
      color: dto.color_hex ?? '',
      image_url: dto.image_url ?? undefined,
      popularity_score: dto.popularity_score,
      created_at: new Date(dto.created_at),
      updated_at: new Date(dto.updated_at)
    };
  }

  static mapGenreListToGenres(dtos: GenreDto[]): GenreListItem[] {
    return dtos.map(dto => ({
      id: dto.id,
      name: dto.name,
      description: dto.description ?? undefined,
      color: dto.color_hex ?? '',
      image_url: dto.image_url ?? undefined,
      popularity_score: dto.popularity_score
    }));
  }
}
