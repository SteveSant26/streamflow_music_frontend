import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AsideMenu } from '@app/components/aside-menu/aside-menu';
import { Player } from '@app/components/player/player';
import { LanguageService } from '@app/shared/services';
import { AuthSessionUseCase } from '@app/domain/usecases';
import { ThemeToggleComponent } from '@app/presentation/components/theme-toggle/theme-toggle';
import { ThemeService } from '@app/shared/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-global-loyout',
  imports: [
    RouterOutlet,
    AsideMenu,
    Player,
    CommonModule,
    TranslateModule,
    ThemeToggleComponent,
  ],
  templateUrl: './global-loyout.html',
  styleUrl: './global-loyout.css',
})
export class GlobalLoyout {}
