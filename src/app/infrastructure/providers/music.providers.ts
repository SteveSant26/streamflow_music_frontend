// Providers for music-related use cases
import { Provider } from '@angular/core';

// Album use cases
import { GetAllAlbumsUseCase, GetAlbumByIdUseCase, GetPopularAlbumsUseCase, GetAlbumsByArtistUseCase } from '../../domain/usecases/album.usecases';

// Artist use cases 
import { GetAllArtistsUseCase, GetArtistByIdUseCase, GetPopularArtistsUseCase } from '../../domain/usecases/artist.usecases';

// Genre use cases
import { GetAllGenresUseCase, GetGenreByIdUseCase, GetPopularGenresUseCase } from '../../domain/usecases/genre.usecases';

export const musicProviders: Provider[] = [
  // Album providers
  GetAllAlbumsUseCase,
  GetAlbumByIdUseCase,
  GetPopularAlbumsUseCase,
  GetAlbumsByArtistUseCase,
  
  // Artist providers
  GetAllArtistsUseCase,
  GetArtistByIdUseCase,
  GetPopularArtistsUseCase,
  
  // Genre providers
  GetAllGenresUseCase,
  GetGenreByIdUseCase,
  GetPopularGenresUseCase
];
