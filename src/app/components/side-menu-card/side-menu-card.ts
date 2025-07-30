import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Router } from "@angular/router";

interface Playlist {
  id: number;
  name: string;
  cover: string;
}

@Component({
  selector: "app-side-menu-card",
  imports: [],
  templateUrl: "./side-menu-card.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuCard {
  @Input() playlist!: Playlist;

  constructor(private readonly router: Router) {}

  onImageError(event: any) {
    // Fallback a una imagen placeholder si la imagen original falla
    event.target.src = "/assets/playlists/placeholder.jpg";
  }

  navigateToPlaylist() {
    this.router.navigate(["/playlist", this.playlist.id]);
  }
}
