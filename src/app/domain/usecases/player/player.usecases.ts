import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Song } from '../../entities/song.entity';

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number; // Will convert from string to number
  progress: number; // 0 to 100 percentage
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffleEnabled: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerUseCase {
  private readonly currentSong$ = new BehaviorSubject<Song | null>(null);
  private readonly playbackState$ = new BehaviorSubject<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    volume: 1,
    isMuted: false,
    repeatMode: 'none',
    isShuffleEnabled: false,
    isLoading: false
  });

  // Audio element reference - will be set by GlobalPlayerStateService
  private audioElement: HTMLAudioElement | null = null;

  getCurrentSong(): Observable<Song | null> {
    return this.currentSong$.asObservable();
  }

  getPlaybackState(): Observable<PlaybackState> {
    return this.playbackState$.asObservable();
  }

  playSong(song: Song): void {
    console.log(`🎵 PlayerUseCase.playSong() recibida:`, song);
    
    // Determinar la URL de audio a usar
    const audioUrl = this.getAudioUrl(song);
    console.log(`🎵 URL de audio determinada: ${audioUrl}`);
    
    if (!audioUrl) {
      console.error(`❌ PlayerUseCase: No se puede reproducir - Sin URL de audio válida`);
      console.error(`❌ Datos de la canción:`, song);
      this.updatePlaybackState({ 
        isLoading: false,
        isPlaying: false 
      });
      return;
    }

    // Mostrar información sobre la fuente de audio
    if (audioUrl.includes('youtube.com')) {
      console.log('[Player UseCase] 🎬 USANDO: YouTube (evitando problemas de Supabase)');
      console.log('[Player UseCase] ✅ Esta fuente es más confiable');
    } else if (audioUrl.includes('supabase.co')) {
      console.log('[Player UseCase] 📦 USANDO: Supabase Storage');
      console.log('[Player UseCase] ⚠️ Si no funciona, revisa la configuración de Supabase');
    } else {
      console.log('[Player UseCase] � USANDO: Fuente externa:', audioUrl);
    }

    console.log(`🎵 PlayerUseCase: Iniciando reproducción con URL: ${audioUrl}`);
    
    // ✅ REPRODUCIR AUDIO REALMENTE
    this.playAudioUrl(audioUrl);
    
    this.currentSong$.next(song);
    this.updatePlaybackState({ 
      currentSong: song,
      isPlaying: true, 
      duration: song.duration_seconds || 0, 
      currentTime: 0,
      isLoading: false
    });
  }

  private playAudioUrl(audioUrl: string): void {
    if (!this.audioElement) {
      console.error('[Player UseCase] ❌ Audio element not available');
      return;
    }

    try {
      console.log('[Player UseCase] 🎧 Setting audio source:', audioUrl);
      this.audioElement.src = audioUrl;
      
      console.log('[Player UseCase] ▶️ Starting audio playback...');
      this.audioElement.play().then(() => {
        console.log('[Player UseCase] ✅ Audio playback started successfully');
      }).catch((error) => {
        console.error('[Player UseCase] ❌ Audio playback failed:', error);
      });
    } catch (error) {
      console.error('[Player UseCase] ❌ Error setting audio source:', error);
    }
  }

  private getAudioUrl(song: Song): string | null {
    console.log('[Player UseCase] Getting audio URL for song:', song.title);
    console.log('[Player UseCase] Song object details:', {
      file_url: song.file_url,
      source_url: song.source_url,   // Backend field
      youtube_url: song.youtube_url, // Legacy field
      source_id: song.source_id,     // Backend field (YouTube ID)
      youtube_id: song.youtube_id,   // Legacy field
      thumbnail_url: song.thumbnail_url
    });

    // 🔄 NUEVA ESTRATEGIA: Si Supabase está disponible, intentarlo, pero tener YouTube listo
    
    // Priority 1: Verificar si tenemos YouTube como fallback antes de usar Supabase
    const hasYouTubeFallback = song.source_id || song.source_url || song.youtube_id || song.youtube_url;
    
    if (song.file_url && hasYouTubeFallback) {
      console.log('[Player UseCase] 🎯 ESTRATEGIA DUAL: Supabase + YouTube fallback disponible');
      console.log('[Player UseCase] 📦 Supabase URL:', song.file_url);
      
      // Construir YouTube fallback
      let youtubeUrl = '';
      if (song.source_url) {
        youtubeUrl = song.source_url;
      } else if (song.source_id) {
        youtubeUrl = `https://www.youtube.com/watch?v=${song.source_id}`;
      } else if (song.youtube_url) {
        youtubeUrl = song.youtube_url;
      } else if (song.youtube_id) {
        youtubeUrl = `https://www.youtube.com/watch?v=${song.youtube_id}`;
      }
      
      console.log('[Player UseCase] 🎬 YouTube fallback URL:', youtubeUrl);
      console.log('[Player UseCase] 💡 DECISIÓN: Usar YouTube directamente por problemas de Supabase');
      
      // ⚡ USAR YOUTUBE DIRECTAMENTE para evitar problemas de Supabase
      return youtubeUrl;
    }

    // Priority 2: file_url (solo si no hay YouTube fallback)
    if (song.file_url) {
      console.log('[Player UseCase] ⚠️ Usando Supabase sin fallback YouTube disponible:', song.file_url);
      console.log('[Player UseCase] 📄 This is a direct MP3 file from Supabase Storage');
      return song.file_url;
    }

    // Priority 3: source_url (YouTube URL from backend)
    if (song.source_url) {
      console.log('[Player UseCase] Using source_url:', song.source_url);
      return song.source_url;
    }

    // Priority 4: Legacy audioUrl field
    if (song.audioUrl) {
      console.log('[Player UseCase] Using legacy audioUrl:', song.audioUrl);
      return song.audioUrl;
    }

    // Priority 5: Legacy youtube_url field
    if (song.youtube_url) {
      console.log('[Player UseCase] Using legacy youtube_url:', song.youtube_url);
      return song.youtube_url;
    }

    // Priority 6: Build YouTube URL from source_id (backend field)
    if (song.source_id) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${song.source_id}`;
      console.log('[Player UseCase] Built YouTube URL from source_id:', youtubeUrl);
      return youtubeUrl;
    }

    // Priority 7: Build YouTube URL from legacy youtube_id
    if (song.youtube_id) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtube_id}`;
      console.log('[Player UseCase] Built YouTube URL from legacy youtube_id:', youtubeUrl);
      return youtubeUrl;
    }

    // Priority 8: Extract YouTube ID from thumbnail as fallback
    if (song.thumbnail_url) {
      console.log('[Player UseCase] Attempting to extract YouTube ID from thumbnail:', song.thumbnail_url);
      const extractedId = this.extractYouTubeIdFromThumbnail(song.thumbnail_url);
      if (extractedId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${extractedId}`;
        console.log('[Player UseCase] Extracted YouTube URL from thumbnail:', youtubeUrl);
        return youtubeUrl;
      }
    }
    
    console.error(`❌ No se encontró ninguna URL de audio válida para: ${song.title}`);
    return null;
  }

  private extractYouTubeIdFromThumbnail(thumbnailUrl: string): string | null {
    try {
      console.log(`🔍 Analizando thumbnail_url: ${thumbnailUrl}`);
      
      // Patrón para extraer ID de URLs como:
      // https://...supabase.co/storage/v1/object/public/music-files/thumbnails/lyMPVoKKciw_1fadeeae.jpg?
      // https://...supabase.co/storage/v1/object/public/music-files/thumbnails/RFE6v8FpfWs_b280f592.jpg?
      const match = thumbnailUrl.match(/thumbnails\/([a-zA-Z0-9_-]+)_[a-fA-F0-9]+\.jpg/);
      
      if (match && match[1]) {
        const extractedId = match[1];
        console.log(`✅ YouTube ID extraído: ${extractedId}`);
        return extractedId;
      }
      
      console.log(`❌ No se pudo extraer YouTube ID del thumbnail`);
      return null;
    } catch (error) {
      console.error(`❌ Error extrayendo YouTube ID:`, error);
      return null;
    }
  }

  pauseSong(): void {
    this.updatePlaybackState({ isPlaying: false });
  }

  resumeSong(): void {
    this.updatePlaybackState({ isPlaying: true });
  }

  seekTo(time: number): void {
    this.updatePlaybackState({ currentTime: time });
  }

  setVolume(volume: number): void {
    this.updatePlaybackState({ volume: Math.max(0, Math.min(1, volume)) });
  }

  toggleMute(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isMuted: !currentState.isMuted });
  }

  setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.updatePlaybackState({ repeatMode: mode });
  }

  toggleShuffle(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isShuffleEnabled: !currentState.isShuffleEnabled });
  }

  updateCurrentTime(time: number): void {
    this.updatePlaybackState({ currentTime: time });
  }

  private updatePlaybackState(updates: Partial<PlaybackState>): void {
    const currentState = this.playbackState$.value;
    this.playbackState$.next({ ...currentState, ...updates });
  }

  // Audio element management
  setAudioElement(audioElement: HTMLAudioElement): void {
    console.log('[Player UseCase] 🎧 Setting audio element:', audioElement);
    this.audioElement = audioElement;
    console.log('[Player UseCase] ✅ Audio element set successfully');
  }

  // Event observables for component subscriptions
  onSongEnd(): Observable<void> {
    // Implementation for song end events
    return new Observable(observer => {
      // Placeholder implementation
      observer.next();
    });
  }

  onError(): Observable<any> {
    // Implementation for error events
    return new Observable(observer => {
      // Placeholder implementation - would emit errors from audio playback
      observer.error('Audio playback error');
    });
  }

  // Additional methods needed by services
  getPlayerState(): Observable<PlaybackState> {
    return this.playbackState$.asObservable();
  }

  getCurrentPlayerState(): PlaybackState {
    return this.playbackState$.value;
  }

  loadPlaylist(playlist: Song[]): void {
    // Implementation for loading playlist
    console.log('Loading playlist:', playlist);
  }

  forceStateSync(): void {
    // Implementation for forcing state synchronization
    console.log('Forcing state sync');
  }

  emergencyStateRecovery(): void {
    // Implementation for emergency state recovery
    console.log('Emergency state recovery');
  }

  preserveCurrentState(): void {
    // Implementation for preserving current state
    console.log('Preserving current state');
  }

  // Player control methods needed by components
  togglePlayPause(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isPlaying: !currentState.isPlaying });
  }

  async playPrevious(): Promise<void> {
    // Implementation for playing previous song
    console.log('Playing previous song');
  }

  async playNext(): Promise<void> {
    // Implementation for playing next song
    console.log('Playing next song');
  }

  seekToPercentage(percentage: number): void {
    const currentState = this.playbackState$.value;
    const newTime = (percentage / 100) * currentState.duration;
    this.updatePlaybackState({ currentTime: newTime });
  }
}
