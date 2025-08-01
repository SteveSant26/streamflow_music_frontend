import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';

@Injectable({ providedIn: 'root' })
export class CancelSubscriptionUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService
  ) {}

  execute(subscriptionId: string): Observable<void> {
    console.log('🎯 CancelSubscriptionUseCase: Cancelando suscripción:', subscriptionId);
    
    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.cancelSubscription(subscriptionId).pipe(
      tap(() => {
        console.log('✅ CancelSubscriptionUseCase: Suscripción cancelada');
        // Actualizar el estado local - la suscripción seguirá activa hasta el final del período
        const currentSubscription = this.paymentStateService.subscription();
        if (currentSubscription) {
          const updatedSubscription = {
            ...currentSubscription,
            canceledAt: new Date()
          };
          this.paymentStateService.setSubscription(updatedSubscription);
        }
        this.paymentStateService.setLoading(false);
      }),
      catchError(error => {
        console.error('❌ CancelSubscriptionUseCase: Error:', error);
        this.paymentStateService.setError('Error al cancelar suscripción');
        this.paymentStateService.setLoading(false);
        return of();
      })
    );
  }
}
