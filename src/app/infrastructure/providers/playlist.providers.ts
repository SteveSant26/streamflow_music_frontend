import { Provider } from '@angular/core';
import { PlaylistRepositoryImpl } from '../repositories/playlist.repository.impl';
import { PLAYLIST_REPOSITORY_TOKEN, PLAYLIST_CONFIG_TOKEN, PlaylistConfig } from '../tokens/playlist.tokens';

// Default playlist configuration
export const DEFAULT_PLAYLIST_CONFIG: PlaylistConfig = {
  defaultPageSize: 10,
  maxPlaylistNameLength: 255,
  maxPlaylistDescriptionLength: 1000,
  allowDuplicateSongs: false,
  autoSaveEnabled: true,
  cacheEnabled: true,
  cacheTtl: 300 // 5 minutes
};

// Playlist repository provider
export const playlistRepositoryProvider: Provider = {
  provide: PLAYLIST_REPOSITORY_TOKEN,
  useClass: PlaylistRepositoryImpl
};

// Playlist configuration provider
export const playlistConfigProvider: Provider = {
  provide: PLAYLIST_CONFIG_TOKEN,
  useValue: DEFAULT_PLAYLIST_CONFIG
};

// All playlist providers
export const playlistProviders: Provider[] = [
  playlistRepositoryProvider,
  playlistConfigProvider,
  PlaylistRepositoryImpl
];

// Feature-specific providers for lazy loading
export const corePlaylistProviders: Provider[] = [
  playlistRepositoryProvider,
  playlistConfigProvider
];

export const extendedPlaylistProviders: Provider[] = [
  ...corePlaylistProviders,
  // Add additional providers for extended functionality
];

// Testing providers
export const mockPlaylistProviders: Provider[] = [
  {
    provide: PLAYLIST_REPOSITORY_TOKEN,
    useValue: {
      // Mock implementation for testing
      getPlaylists: () => ({ subscribe: () => {} }),
      getPlaylist: () => ({ subscribe: () => {} }),
      createPlaylist: () => ({ subscribe: () => {} }),
      updatePlaylist: () => ({ subscribe: () => {} }),
      deletePlaylist: () => ({ subscribe: () => {} }),
      getPlaylistSongs: () => ({ subscribe: () => {} }),
      addSongToPlaylist: () => ({ subscribe: () => {} }),
      removeSongFromPlaylist: () => ({ subscribe: () => {} }),
      getUserPlaylists: () => ({ subscribe: () => {} }),
      getUserPlaylist: () => ({ subscribe: () => {} })
    }
  },
  playlistConfigProvider
];
