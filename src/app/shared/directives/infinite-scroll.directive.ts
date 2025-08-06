import { 
  Directive, 
  ElementRef, 
  EventEmitter, 
  Input, 
  Output, 
  OnInit, 
  OnDestroy, 
  inject 
} from '@angular/core';
import { Subject, fromEvent, takeUntil, throttleTime, filter } from 'rxjs';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() threshold = 100; // Píxeles antes del final para disparar
  @Input() isLoading = false; // Evita múltiples cargas
  @Input() hasMore = true; // Si hay más contenido para cargar
  @Output() loadMore = new EventEmitter<void>();

  private readonly element = inject(ElementRef);
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    fromEvent(this.element.nativeElement, 'scroll')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(100), // Throttle para rendimiento
        filter(() => !this.isLoading && this.hasMore)
      )
      .subscribe(() => {
        this.checkScrollPosition();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScrollPosition() {
    const element = this.element.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Verificar si estamos cerca del final
    if (scrollTop + clientHeight >= scrollHeight - this.threshold) {
      this.loadMore.emit();
    }
  }
}
