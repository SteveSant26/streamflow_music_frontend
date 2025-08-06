import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_AUTH, ROUTES_CONFIG_SUBSCRIPTION } from '@app/config';

interface Plan {
  id: string;
  nameKey: string;
  name: string;
  price: number;
  periodKey: string;
  period: string;
  featuresKeys: string[];
  features: string[];
  popular: boolean;
  buttonTextKey: string;
  buttonText: string;
  buttonClass: string;
}

@Component({
  selector: 'app-subscription-plans-main',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './subscription-plans.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./subscription-plans.css'],
})
export class SubscriptionPlansMainComponent {
  plans: Plan[] = [
    {
      id: 'free',
      nameKey: 'PLANS.FREE.NAME',
      name: 'Plan Gratuito',
      price: 0,
      periodKey: 'PLANS.FREE.PERIOD',
      period: 'siempre',
      featuresKeys: [
        'PLANS.FREE.FEATURE_1',
        'PLANS.FREE.FEATURE_2',
        'PLANS.FREE.FEATURE_3',
        'PLANS.FREE.FEATURE_4',
        'PLANS.FREE.FEATURE_5',
      ],
      features: [
        'Reprodución con anuncios',
        'Calidad estándar',
        'Acceso a la biblioteca básica',
        'Sin descargas offline',
        'Sesión en 1 dispositivo',
      ],
      popular: false,
      buttonTextKey: 'PLANS.FREE.BUTTON',
      buttonText: 'Comenzar Gratis',
      buttonClass: 'btn-outline',
    },
    {
      id: 'monthly',
      nameKey: 'PLANS.MONTHLY.NAME',
      name: 'Plan Mensual',
      price: 9.99,
      periodKey: 'PLANS.MONTHLY.PERIOD',
      period: 'mes',
      featuresKeys: [
        'PLANS.MONTHLY.FEATURE_1',
        'PLANS.MONTHLY.FEATURE_2',
        'PLANS.MONTHLY.FEATURE_3',
        'PLANS.MONTHLY.FEATURE_4',
        'PLANS.MONTHLY.FEATURE_5',
        'PLANS.MONTHLY.FEATURE_6',
      ],
      features: [
        'Sin anuncios',
        'Calidad de audio alta',
        'Biblioteca completa',
        'Descargas offline ilimitadas',
        'Sesión en hasta 5 dispositivos',
        'Playlists personalizadas',
      ],
      popular: true,
      buttonTextKey: 'PLANS.MONTHLY.BUTTON',
      buttonText: 'Suscribirse Mensual',
      buttonClass: 'btn-primary',
    },
    {
      id: 'annual',
      nameKey: 'PLANS.ANNUAL.NAME',
      name: 'Plan Anual',
      price: 99.99,
      periodKey: 'PLANS.ANNUAL.PERIOD',
      period: 'año',
      featuresKeys: [
        'PLANS.ANNUAL.FEATURE_1',
        'PLANS.ANNUAL.FEATURE_2',
        'PLANS.ANNUAL.FEATURE_3',
        'PLANS.ANNUAL.FEATURE_4',
        'PLANS.ANNUAL.FEATURE_5',
        'PLANS.ANNUAL.FEATURE_6',
      ],
      features: [
        'Todo del plan mensual',
        '2 meses gratis (ahorra $20)',
        'Calidad de audio premium',
        'Acceso anticipado a nuevas funciones',
        'Soporte prioritario',
        'Sesión en dispositivos ilimitados',
      ],
      popular: false,
      buttonTextKey: 'PLANS.ANNUAL.BUTTON',
      buttonText: 'Suscribirse Anual',
      buttonClass: 'btn-success',
    },
  ];

  constructor(private readonly router: Router) {}

  selectPlan(planId: string): void {
    console.log(`Plan seleccionado: ${planId}`);

    switch (planId) {
      case 'free':
        // Redirigir al registro gratuito
        this.router.navigate([ROUTES_CONFIG_AUTH.REGISTER.link]);
        break;
      case 'monthly':
        // Redirigir al proceso de pago mensual
        this.router.navigate([ROUTES_CONFIG_SUBSCRIPTION.PAYMENT.link], {
          queryParams: { plan: 'monthly' },
        });
        break;
      case 'annual':
        // Redirigir al proceso de pago anual
        this.router.navigate([ROUTES_CONFIG_SUBSCRIPTION.PAYMENT.link], { queryParams: { plan: 'annual' } });
        break;
      default:
        console.error('Plan no reconocido');
    }
  }

  getMonthlyPrice(plan: Plan): number {
    if (plan.id === 'annual') {
      return plan.price / 12;
    }
    return plan.price;
  }

  getSavingsText(plan: Plan): string {
    if (plan.id === 'annual') {
      const monthlyTotal = 9.99 * 12;
      const savings = monthlyTotal - plan.price;
      return `Ahorra $${savings.toFixed(2)} al año`;
    }
    return '';
  }
}
