import { Directive, ElementRef, inject, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MaterialThemeService } from '../services/material-theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Directiva que aplica automáticamente las clases de tema a cualquier elemento
 * Se puede usar como `<div appTheme>` para aplicar clases de tema automáticamente
 */
@Directive({
  selector: '[appTheme]',
  standalone: true
})
export class ThemeDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(MaterialThemeService);

  ngOnInit() {
    // Aplicar tema inicial
    this.applyTheme(this.themeService.effectiveTheme());
    
    // Suscribirse a cambios de tema
    this.themeService.getCurrentTheme()
      .pipe(takeUntilDestroyed())
      .subscribe(theme => {
        this.applyTheme(theme);
      });
  }

  ngOnDestroy() {
    // Cleanup automático por takeUntilDestroyed
  }

  private applyTheme(theme: string) {
    const element = this.elementRef.nativeElement;
    
    // Remover clases de tema previas
    this.renderer.removeClass(element, 'light-theme');
    this.renderer.removeClass(element, 'dark-theme');
    this.renderer.removeClass(element, 'light');
    this.renderer.removeClass(element, 'dark');
    
    // Agregar nuevas clases de tema
    this.renderer.addClass(element, `${theme}-theme`);
    this.renderer.addClass(element, theme);
    
    // Agregar atributo data-theme para CSS específicos
    this.renderer.setAttribute(element, 'data-theme', theme);
  }
}
