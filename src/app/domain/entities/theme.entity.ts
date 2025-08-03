export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface Theme {
  type: ThemeType;
  isDark: boolean;
  name: string;
}

export class ThemeEntity implements Theme {
  constructor(
    public readonly type: ThemeType,
    public readonly isDark: boolean,
    public readonly name: string = type
  ) {}

  toggle(): ThemeEntity {
    const newType = this.type === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK;
    return new ThemeEntity(newType, newType === ThemeType.DARK, newType);
  }

  static createLight(): ThemeEntity {
    return new ThemeEntity(ThemeType.LIGHT, false, ThemeType.LIGHT);
  }

  static createDark(): ThemeEntity {
    return new ThemeEntity(ThemeType.DARK, true, ThemeType.DARK);
  }

  static createSystem(): ThemeEntity {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return new ThemeEntity(ThemeType.SYSTEM, prefersDark, ThemeType.SYSTEM);
  }

  static fromSystemPreference(): ThemeEntity {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return new ThemeEntity(ThemeType.SYSTEM, prefersDark, ThemeType.SYSTEM);
  }

  isSystemTheme(): boolean {
    return this.type === ThemeType.SYSTEM;
  }

  equals(other: ThemeEntity): boolean {
    return this.type === other.type && this.isDark === other.isDark;
  }
}
