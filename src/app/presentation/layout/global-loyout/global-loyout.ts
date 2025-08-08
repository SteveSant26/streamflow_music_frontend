import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AsideMenu } from '@app/presentation/components/navigation';
import { Player } from '@app/presentation/components/player';
import { GlobalPlaylistModalComponent } from '@app/shared/components/global-playlist-modal/global-playlist-modal';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeDirective } from '@app/shared/directives/theme.directive';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-global-loyout',
  imports: [
    RouterOutlet,
    RouterLink,
    AsideMenu,
    Player,
    GlobalPlaylistModalComponent,
    CommonModule,
    TranslateModule,
    MatIconModule,
    ThemeDirective,
  ],
  templateUrl: './global-loyout.html',
  styleUrl: './global-loyout.css',
})
export class GlobalLoyout implements OnInit, OnDestroy {
  isCurrentSong = false;
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar la ruta inicial
    this.checkCurrentRoute();
    
    // Suscribirse a cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private checkCurrentRoute() {
    this.isCurrentSong = this.router.url.includes('/currentsong') || this.router.url.includes('/current-song');
  }

  isCurrentSongPage(): boolean {
    return this.isCurrentSong;
  }
}
