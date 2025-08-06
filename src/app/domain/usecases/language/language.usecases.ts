import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentLanguageUseCase {
  constructor(
    private readonly translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  execute(): Observable<string> {
    let currentLang = 'en'; // Default language
    
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      currentLang = localStorage.getItem('streamflow_language') || 'en';
    }
    
    // Asegurar que el TranslateService use el idioma correcto
    this.translateService.use(currentLang).subscribe();
    
    return of(currentLang);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAvailableLanguagesUseCase {
  execute(): Observable<{ code: Language; name: string }[]> {
    return of([
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageUseCase {
  constructor(
    private readonly translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  execute(language: Language): Observable<void> {
    return new Observable(observer => {
      this.translateService.use(language).subscribe({
        next: () => {
          // Only access localStorage in browser environment
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('streamflow_language', language);
          }
          observer.next();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
