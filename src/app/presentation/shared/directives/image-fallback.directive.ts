import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() appImageFallback = 'assets/images/default-album.svg';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {
    this.setupErrorHandler();
  }

  private setupErrorHandler(): void {
    const img = this.el.nativeElement;
    
    this.renderer.listen(img, 'error', () => {
      if (img.src !== this.appImageFallback) {
        img.src = this.appImageFallback;
      }
    });

    // También manejar el caso donde la imagen está vacía
    this.renderer.listen(img, 'load', () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        img.src = this.appImageFallback;
      }
    });
  }
}
