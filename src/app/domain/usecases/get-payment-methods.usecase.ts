import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { PaymentMethod } from '../entities/payment.entity';

@Injectable({ providedIn: 'root' })
export class GetPaymentMethodsUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService,
  ) {}

  execute(userId: string): Observable<PaymentMethod[]> {
    console.log(
      '🎯 GetPaymentMethodsUseCase: Obteniendo métodos de pago para usuario:',
      userId,
    );

    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.getPaymentMethods(userId).pipe(
      tap((paymentMethods) => {
        console.log(
          '✅ GetPaymentMethodsUseCase: Métodos de pago obtenidos:',
          paymentMethods,
        );
        this.paymentStateService.setPaymentMethods(paymentMethods);
        this.paymentStateService.setLoading(false);
      }),
      catchError((error) => {
        console.error('❌ GetPaymentMethodsUseCase: Error:', error);
        this.paymentStateService.setError('Error al cargar métodos de pago');
        this.paymentStateService.setLoading(false);
        return of([]);
      }),
    );
  }
}
