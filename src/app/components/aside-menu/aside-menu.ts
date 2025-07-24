import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';

@Component({
  selector: 'app-aside-menu',
  imports: [SideMenuItem, SideMenuCard],
  templateUrl: './aside-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideMenu {
  // Mock data para las playlists
  playlists = [
    { id: 1, name: 'Liked Songs', cover: '/assets/playlists/playlist1.jpg' },
    { id: 2, name: 'Daily Mix 1', cover: '/assets/playlists/playlist2.webp' },
    { id: 3, name: 'Rock Classics', cover: '/assets/playlists/playlist3.jpg' },
    { id: 4, name: 'Chill Hits', cover: '/assets/playlists/playlist4.jpg' }
  ];
}
