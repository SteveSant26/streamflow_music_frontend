import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { StripeCheckoutSessionDto } from '../entities/payment-dtos';

@Injectable({ providedIn: 'root' })
export class CreateCheckoutSessionUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService,
  ) {}

  execute(
    dto: StripeCheckoutSessionDto,
  ): Observable<{ url: string; sessionId: string }> {
    console.log(
      '🎯 CreateCheckoutSessionUseCase: Creando sesión de checkout:',
      dto,
    );

    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.createCheckoutSession(dto).pipe(
      tap((result) => {
        console.log(
          '✅ CreateCheckoutSessionUseCase: Sesión de checkout creada:',
          result,
        );
        this.paymentStateService.setLoading(false);
      }),
      catchError((error) => {
        console.error('❌ CreateCheckoutSessionUseCase: Error:', error);
        this.paymentStateService.setError('Error al crear sesión de checkout');
        this.paymentStateService.setLoading(false);
        throw error;
      }),
    );
  }
}
