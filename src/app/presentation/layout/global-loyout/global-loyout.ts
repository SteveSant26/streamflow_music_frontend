import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideMenu } from '@app/presentation/components/navigation';
import { Player } from '@app/presentation/components/player';
import { GlobalPlaylistModalComponent } from '@app/shared/components/global-playlist-modal/global-playlist-modal';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-global-loyout',
  imports: [
    RouterOutlet,
    AsideMenu,
    Player,
    GlobalPlaylistModalComponent,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './global-loyout.html',
  styleUrl: './global-loyout.css',
})
export class GlobalLoyout {}
