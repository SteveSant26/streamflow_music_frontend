import { ChangeDetectionStrategy, Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStateService } from '../../../../shared/services/state/auth-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-greeting',
  imports: [TranslateModule, CommonModule],
  templateUrl: './greeting.html',
  styleUrl: './greeting.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting implements OnInit {
  private readonly authStateService = inject(AuthStateService);
  private readonly cdr = inject(ChangeDetectorRef);

  greetingKey = '';
  greetingParams = { name: 'Usuario' }; // Valor por defecto

  ngOnInit(): void {
    this.setGreeting();
    this.loadUserName();
  }

  private setGreeting(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      this.greetingKey = 'GREETING.GOOD_MORNING';
    } else if (currentHour < 18) {
      this.greetingKey = 'GREETING.GOOD_AFTERNOON';
    } else {
      this.greetingKey = 'GREETING.GOOD_EVENING';
    }
  }

  private loadUserName(): void {
    // Obtener el usuario actual desde el AuthStateService
    const currentUser = this.authStateService.user();
    
    if (currentUser) {
      // Usar el nombre del usuario, o el primer parte del email si no hay nombre
      const userName = currentUser.name || 
                      currentUser.email?.split('@')[0] || 
                      'Usuario';
      
      this.greetingParams = { name: userName };
      this.cdr.detectChanges(); // Forzar detección de cambios
    } else {
      console.warn('No hay usuario autenticado para mostrar en el saludo');
      // Mantener el valor por defecto 'Usuario'
    }
  }
}
