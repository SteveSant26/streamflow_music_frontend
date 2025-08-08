import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AsideMenu } from '@app/presentation/components/navigation';
import { Player } from '@app/presentation/components/player';
import { GlobalPlaylistModalComponent } from '@app/shared/components/global-playlist-modal/global-playlist-modal';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeDirective } from '@app/shared/directives/theme.directive';

@Component({
  selector: 'app-global-loyout',
  imports: [
    RouterOutlet,
    RouterModule,
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
export class GlobalLoyout {}
