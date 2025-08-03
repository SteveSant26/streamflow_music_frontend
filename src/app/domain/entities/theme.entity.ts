export interface Theme {
  isDark: boolean;
  name: string;
}

export class ThemeEntity implements Theme {
  constructor(
    public readonly isDark: boolean,
    public readonly name: string = isDark ? 'dark' : 'light',
  ) {}

  toggle(): ThemeEntity {
    return new ThemeEntity(!this.isDark);
  }

  static createLight(): ThemeEntity {
    return new ThemeEntity(false);
  }

  static createDark(): ThemeEntity {
    return new ThemeEntity(true);
  }
}
