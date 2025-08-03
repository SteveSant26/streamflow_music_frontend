import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;

  isDarkMode(): boolean {
    return this.darkMode;
  }

  setDarkMode(value: boolean) {
    this.darkMode = value;
    document.body.classList.toggle('dark', value);
  }
}
