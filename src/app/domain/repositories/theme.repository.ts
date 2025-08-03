import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';

export abstract class ThemeRepository {
  abstract getCurrentTheme(): Observable<ThemeEntity>;
  abstract setTheme(theme: ThemeEntity): Observable<void>;
  abstract getStoredTheme(): ThemeEntity | null;
  abstract saveTheme(theme: ThemeEntity): void;
}
