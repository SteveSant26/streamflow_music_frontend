import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthSessionUseCase } from '@app/domain/usecases/auth-session.usecase';
import { AsideMenu } from './components/aside-menu/aside-menu';
import { Player } from './components/player/player';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsideMenu, Player, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showLayout = true;

  constructor(
    private readonly router: Router,
    private readonly authSessionUseCase: AuthSessionUseCase
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide layout for login, register and current song pages
        this.showLayout =
          !event.url.includes('/login') &&
          !event.url.includes('/register') &&
          !event.url.includes('/currentSong');
      });
  }

  ngOnInit() {
    this.authSessionUseCase.initSession();
  }
}
