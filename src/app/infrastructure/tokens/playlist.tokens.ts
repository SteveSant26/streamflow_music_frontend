import { InjectionToken } from '@angular/core';
import { IPlaylistRepository } from '../../domain/repositories/i-playlist.repository';

// Injection tokens for playlist dependencies
export const PLAYLIST_REPOSITORY_TOKEN = new InjectionToken<IPlaylistRepository>('PLAYLIST_REPOSITORY_TOKEN');

// Configuration tokens
export const PLAYLIST_CONFIG_TOKEN = new InjectionToken<PlaylistConfig>('PLAYLIST_CONFIG_TOKEN');

export interface PlaylistConfig {
  defaultPageSize: number;
  maxPlaylistNameLength: number;
  maxPlaylistDescriptionLength: number;
  allowDuplicateSongs: boolean;
  autoSaveEnabled: boolean;
  cacheEnabled: boolean;
  cacheTtl: number; // Cache TTL in seconds
}
