import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { PlayerUseCase } from '@app/domain/usecases/player/player.usecases';
import { GlobalPlaylistModalService } from '@app/shared/services/global-playlist-modal.service';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { Playlist } from '@app/domain/entities/song.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-global-playlist-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './global-playlist-modal.html',
  styleUrls: ['./global-playlist-modal.css'],
})
export class GlobalPlaylistModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  currentPlaylist: Playlist | null = null;
  currentSong: any = null;
  
  // Nuevas propiedades para ordenamiento y drag & drop
  sortBy: 'none' | 'name' | 'artist' | 'duration' = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortedPlaylist: any[] = [];
  draggedIndex: number | null = null;
  
  private readonly destroy$ = new Subject<void>();

  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly playlistService = inject(PlaylistService);
  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly modalService = inject(GlobalPlaylistModalService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Suscribirse al estado de visibilidad del modal
    this.modalService.isVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isVisible) => {
        this.isVisible = isVisible;
        this.cdr.detectChanges();
      });

    // Suscribirse al estado del player para obtener la canción actual
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playerState: PlayerState) => {
          if (playerState.currentSong) {
            this.currentSong = {
              id: playerState.currentSong.id,
              title: playerState.currentSong.title,
              artist: playerState.currentSong.artist_name || 'Unknown Artist',
              isPlaying: playerState.isPlaying,
            };
          } else {
            this.currentSong = null;
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in player state subscription:', error);
        }
      });

    // Suscribirse a la playlist actual
    this.playlistService.currentPlaylist$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playlist: Playlist | null) => {
          this.currentPlaylist = playlist;
          this.updateSortedPlaylist();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in playlist subscription:', error);
        }
      });
  }

  private updateSortedPlaylist(): void {
    if (!this.currentPlaylist?.items) {
      this.sortedPlaylist = [];
      return;
    }

    let items = [...this.currentPlaylist.items];

    // Aplicar ordenamiento si está configurado
    if (this.sortBy !== 'none') {
      items = this.sortPlaylistItems(items);
    }

    this.sortedPlaylist = items;
  }

  private sortPlaylistItems(items: any[]): any[] {
    return items.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'name':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'artist': {
          const artistA = a.artist_name || 'Unknown';
          const artistB = b.artist_name || 'Unknown';
          compareValue = artistA.localeCompare(artistB);
          break;
        }
        case 'duration': {
          const durationA = this.parseDuration(a.duration_formatted || '0:00');
          const durationB = this.parseDuration(b.duration_formatted || '0:00');
          compareValue = durationA - durationB;
          break;
        }
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  private parseDuration(duration: string): number {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0] || '0', 10);
    const seconds = parseInt(parts[1] || '0', 10);
    return minutes * 60 + seconds;
  }

  show(): void {
    this.modalService.show();
  }

  hide(): void {
    this.modalService.hide();
  }

  toggle(): void {
    this.modalService.toggle();
  }

  selectSongFromPlaylist(index: number): void {
    console.log('🎵 Seleccionando canción desde playlist global:', index);
    
    // Si está ordenado, encontrar el índice original
    const originalIndex = this.sortBy === 'none' ? index : this.getOriginalIndex(index);
    
    this.playlistService.selectSong(originalIndex);
    
    // Iniciar reproducción después de seleccionar
    setTimeout(() => {
      this.playlistService.togglePlayback();
    }, 100);
  }

  getOriginalIndex(sortedIndex: number): number {
    if (!this.currentPlaylist?.items || this.sortBy === 'none') {
      return sortedIndex;
    }

    const sortedItem = this.sortedPlaylist[sortedIndex];
    return this.currentPlaylist.items.findIndex(item => 
      item.id === sortedItem.id && item.title === sortedItem.title
    );
  }

  // Métodos de ordenamiento
  setSortBy(sortBy: 'none' | 'name' | 'artist' | 'duration'): void {
    if (this.sortBy === sortBy) {
      // Si ya está ordenado por este campo, cambiar orden
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    
    this.updateSortedPlaylist();
    console.log('📊 Ordenamiento cambiado:', { sortBy: this.sortBy, sortOrder: this.sortOrder });
  }

  // Métodos de Drag & Drop
  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', index.toString());
    }
    
    // Add dragging class for visual feedback
    const target = event.target as HTMLElement;
    const songItem = target.closest('.playlist-song-item') as HTMLElement;
    if (songItem) {
      songItem.classList.add('dragging');
    }
    
    // Agregar clase al elemento para animación
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
    
    console.log('🫳 Drag iniciado en índice:', index);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex === null || this.draggedIndex === targetIndex) {
      this.draggedIndex = null;
      return;
    }

    console.log('🫴 Drop detectado desde', this.draggedIndex, 'hacia', targetIndex);

    // Solo permitir reordenamiento manual si no hay ordenamiento aplicado
    if (this.sortBy !== 'none') {
      console.warn('⚠️ No se puede reordenar manualmente con ordenamiento activo');
      this.draggedIndex = null;
      return;
    }

    // Reordenar la playlist
    this.reorderPlaylist(this.draggedIndex, targetIndex);
    this.draggedIndex = null;
    
    // Forzar actualización visual
    this.cdr.detectChanges();
  }

  onDragEnd(event: DragEvent): void {
    // Remove dragging class from all elements
    const draggingElements = document.querySelectorAll('.playlist-song-item.dragging');
    draggingElements.forEach(el => el.classList.remove('dragging'));
    
    this.draggedIndex = null;
    this.cdr.detectChanges();
    
    console.log('🏁 Drag ended - cleaning up visual states');
  }

  private reorderPlaylist(fromIndex: number, toIndex: number): void {
    if (!this.currentPlaylist?.items) return;

    // Crear nueva lista reordenada
    const items = [...this.sortedPlaylist];
    const draggedItem = items.splice(fromIndex, 1)[0];
    items.splice(toIndex, 0, draggedItem);

    // Actualizar sortedPlaylist inmediatamente para reflejar el cambio visual
    this.sortedPlaylist = items;

    // Actualizar el índice actual si es necesario
    let newCurrentIndex = this.currentPlaylist.currentIndex;
    const originalFromIndex = this.getOriginalIndex(fromIndex);
    const originalToIndex = this.getOriginalIndex(toIndex);

    if (this.currentPlaylist.currentIndex === originalFromIndex) {
      newCurrentIndex = originalToIndex;
    } else if (originalFromIndex < this.currentPlaylist.currentIndex && originalToIndex >= this.currentPlaylist.currentIndex) {
      newCurrentIndex = this.currentPlaylist.currentIndex - 1;
    } else if (originalFromIndex > this.currentPlaylist.currentIndex && originalToIndex <= this.currentPlaylist.currentIndex) {
      newCurrentIndex = this.currentPlaylist.currentIndex + 1;
    }

    // Crear la playlist actualizada
    const updatedPlaylist = {
      ...this.currentPlaylist,
      items: items,
      currentIndex: newCurrentIndex
    };

    // Actualizar el servicio - necesitamos crear este método
    this.updatePlaylistInService(updatedPlaylist);
    
    console.log('🔄 Playlist reordenada de', fromIndex, 'a', toIndex);
  }

  private updatePlaylistInService(playlist: Playlist): void {
    // Forzar actualización del servicio
    this.playlistService['currentPlaylist'].set(playlist);
    this.playlistService['currentPlaylistSubject'].next(playlist);
    console.log('🔄 Playlist actualizada en el servicio');
  }

  getPlaylistContextInfo(): string {
    if (!this.currentPlaylist) return '';
    
    switch (this.currentPlaylist.contextType) {
      case 'search':
        return `Búsqueda: ${this.currentPlaylist.searchQuery || 'Sin query'}`;
      case 'random':
        return 'Canciones Aleatorias';
      case 'popular':
        return 'Canciones Populares';
      case 'album':
        return `Álbum`;
      case 'artist':
        return `Artista`;
      case 'user_playlist':
        return 'Mi Playlist';
      default:
        return 'Playlist';
    }
  }

  canLoadMore(): boolean {
    return this.currentPlaylist?.canLoadMore === true;
  }

  trackByIndex(index: number): number {
    return index;
  }

  isCurrentSong(item: any, displayIndex: number): boolean {
    if (!this.currentPlaylist || !this.currentSong) {
      return false;
    }

    // Comparar por ID de la canción actual
    return item.id === this.currentSong.id;
  }

  // Método para agregar canción a la cola
  addToQueue(song: any): void {
    console.log('🎵 Agregando canción a la cola desde playlist modal:', song.title);
    
    try {
      // Usar el nuevo método addToQueue del PlayerUseCase
      this.playerUseCase.addToQueue(song);
      console.log('✅ Canción agregada a la cola desde modal');
    } catch (error) {
      console.error('❌ Error agregando canción a la cola desde modal:', error);
    }
  }
}
