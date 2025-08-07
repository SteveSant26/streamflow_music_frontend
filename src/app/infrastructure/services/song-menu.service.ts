import { Injectable, inject } from '@angular/core';
import { Song } from '../../domain/entities/song.entity';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DownloadSongUseCase } from '../../domain/usecases/download/download.usecases';
import { PlayerUseCase } from '../../domain/usecases/player/player.usecases';
import { AddSongToPlaylistDialogComponent } from '../../presentation/components/music/playlist/add-song-to-playlist-dialog/add-song-to-playlist-dialog.component';

export interface SongMenuOption {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SongMenuService {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly downloadUseCase = inject(DownloadSongUseCase);
  private readonly playerUseCase = inject(PlayerUseCase);

  getMenuOptions(song: Song): SongMenuOption[] {
    return [
      {
        id: 'play-next',
        label: 'Reproducir siguiente',
        icon: 'skip_next',
        action: () => this.playNext(song)
      },
      {
        id: 'add-to-playlist',
        label: 'Agregar a playlist',
        icon: 'playlist_add',
        action: () => this.addToPlaylist(song)
      },
      {
        id: 'go-to-artist',
        label: `Ir a ${song.artist_name}`,
        icon: 'person',
        action: () => this.goToArtist(song)
      },
      {
        id: 'go-to-album',
        label: `Ir a ${song.album_title || 'álbum'}`,
        icon: 'album',
        action: () => this.goToAlbum(song),
        disabled: !song.album_id
      },
      {
        id: 'download',
        label: 'Descargar',
        icon: 'download',
        action: () => this.downloadSong(song)
      },
      {
        id: 'share',
        label: 'Compartir',
        icon: 'share',
        action: () => this.shareSong(song)
      },
      {
        id: 'view-lyrics',
        label: 'Ver letra',
        icon: 'lyrics',
        action: () => this.viewLyrics(song),
        disabled: !song.lyrics
      }
    ];
  }

  private playNext(song: Song): void {
    console.log(`🎵 Playing next: ${song.title}`);
    // Agregar la canción a la cola para reproducir siguiente
    this.playerUseCase.addToQueue(song);
    console.log(`✅ "${song.title}" agregada para reproducir siguiente`);
  }

  private addToPlaylist(song: Song): void {
    console.log(`📋 Adding to playlist: ${song.title}`);
    
    const dialogRef = this.dialog.open(AddSongToPlaylistDialogComponent, {
      width: '400px',
      data: { song }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Song added to playlist successfully');
      }
    });
  }

  private goToArtist(song: Song): void {
    console.log(`👤 Navigating to artist: ${song.artist_name}`);
    this.router.navigate(['/artists', song.artist_id]);
  }

  private goToAlbum(song: Song): void {
    if (song.album_id) {
      console.log(`💿 Navigating to album: ${song.album_title}`);
      this.router.navigate(['/albums', song.album_id]);
    }
  }

  private downloadSong(song: Song): void {
    console.log(`📥 Downloading song: ${song.title}`);
    this.downloadUseCase.execute(song.id).subscribe({
      next: (downloadResponse) => {
        console.log('✅ Download URL obtained:', downloadResponse.download_url);
        // Trigger actual download
        const link = document.createElement('a');
        link.href = downloadResponse.download_url;
        link.download = `${song.artist_name} - ${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('❌ Error downloading song:', error);
      }
    });
  }

  private shareSong(song: Song): void {
    console.log(`🔗 Sharing song: ${song.title}`);
    
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Escucha "${song.title}" de ${song.artist_name}`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      const shareText = `🎵 Escucha "${song.title}" de ${song.artist_name} en StreamFlow Music`;
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('✅ Link copied to clipboard');
      }).catch(() => {
        console.log('❌ Could not copy to clipboard');
      });
    }
  }

  private viewLyrics(song: Song): void {
    console.log(`📝 Viewing lyrics for: ${song.title}`);
    this.router.navigate(['/song', song.id, 'lyrics']);
  }
}
