import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPlaylistModalService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  public isVisible$ = this.isVisibleSubject.asObservable();

  show(): void {
    console.log('🎵 GlobalPlaylistModalService: Mostrando modal');
    this.isVisibleSubject.next(true);
  }

  hide(): void {
    console.log('🎵 GlobalPlaylistModalService: Ocultando modal');
    this.isVisibleSubject.next(false);
  }

  toggle(): void {
    const currentValue = this.isVisibleSubject.value;
    console.log('🎵 GlobalPlaylistModalService: Toggle modal from', currentValue, 'to', !currentValue);
    this.isVisibleSubject.next(!currentValue);
  }

  get isVisible(): boolean {
    return this.isVisibleSubject.value;
  }
}
