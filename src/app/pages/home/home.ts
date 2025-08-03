import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { Greeting } from '../../components/greeting/greeting';
import { MusicsTable } from '../../components/musics-table/musics-table';
import { PlayListItemCard } from '../../components/play-list-item-card/play-list-item-card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    Greeting,
    MusicsTable,
    PlayListItemCard,
    MatIcon,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  // Datos mock para las playlists
  featuredPlaylists = [
    {
      id: 1,
      title: 'Hits del Rock',
      cover: '/assets/playlists/playlist1.jpg',
      artists: ['Queen', 'Led Zeppelin', 'The Beatles'],
    },
    {
      id: 2,
      title: 'Pop Latino',
      cover: '/assets/playlists/playlist2.webp',
      artists: ['Shakira', 'Jesse & Joy', 'Manu Chao'],
    },
    {
      id: 3,
      title: 'Jazz Clásico',
      cover: '/assets/playlists/playlist3.jpg',
      artists: ['Miles Davis', 'John Coltrane', 'Bill Evans'],
    },
    {
      id: 4,
      title: 'Chill Vibes',
      cover: '/assets/playlists/playlist4.jpg',
      artists: ['Bon Iver', 'The Paper Kites', 'Iron & Wine'],
    },
  ];

  constructor() {}
}
