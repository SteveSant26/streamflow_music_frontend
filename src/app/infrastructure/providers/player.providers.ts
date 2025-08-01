import { Provider } from '@angular/core';
import { IPlayerRepository } from '../../domain/repositories/player.repository.interface';
import { HtmlAudioPlayerRepository } from '../repositories/html-audio-player.repository';

export const playerProviders: Provider[] = [
  {
    provide: 'IPlayerRepository',
    useClass: HtmlAudioPlayerRepository
  }
];
