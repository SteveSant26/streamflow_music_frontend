import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentLanguageUseCase {
  constructor(private readonly translateService: TranslateService) {}

  execute(): Observable<string> {
    const currentLang = localStorage.getItem('streamflow_language') || 'en';
    return of(currentLang);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAvailableLanguagesUseCase {
  execute(): Observable<Array<{ code: Language; name: string }>> {
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
  constructor(private readonly translateService: TranslateService) {}

  execute(language: Language): Observable<void> {
    return new Observable(observer => {
      this.translateService.use(language).subscribe({
        next: () => {
          localStorage.setItem('streamflow_language', language);
          observer.next();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
