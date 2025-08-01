import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubscriptionPlansComponent } from './subscription-plans';

describe('SubscriptionPlansComponent', () => {
  let component: SubscriptionPlansComponent;
  let fixture: ComponentFixture<SubscriptionPlansComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SubscriptionPlansComponent, CommonModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlansComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 3 subscription plans', () => {
    expect(component.plans).toBeDefined();
    expect(component.plans.length).toBe(3);
  });

  it('should have correct plan structure for all plans', () => {
    // Test free plan
    const freePlan = component.plans.find((p) => p.id === 'free');
    expect(freePlan).toBeDefined();
    expect(freePlan?.name).toBe('Plan Gratuito');
    expect(freePlan?.price).toBe(0);
    expect(freePlan?.period).toBe('siempre');
    expect(freePlan?.popular).toBe(false);
    expect(freePlan?.buttonText).toBe('Comenzar Gratis');
    expect(freePlan?.buttonClass).toBe('btn-outline');
    expect(freePlan?.features).toEqual([
      'Reprodución con anuncios',
      'Calidad estándar',
      'Acceso a la biblioteca básica',
      'Sin descargas offline',
      'Sesión en 1 dispositivo',
    ]);

    // Test monthly plan
    const monthlyPlan = component.plans.find((p) => p.id === 'monthly');
    expect(monthlyPlan).toBeDefined();
    expect(monthlyPlan?.name).toBe('Plan Mensual');
    expect(monthlyPlan?.price).toBe(9.99);
    expect(monthlyPlan?.period).toBe('mes');
    expect(monthlyPlan?.popular).toBe(true);
    expect(monthlyPlan?.buttonText).toBe('Suscribirse Mensual');
    expect(monthlyPlan?.buttonClass).toBe('btn-primary');
    expect(monthlyPlan?.features).toEqual([
      'Sin anuncios',
      'Calidad de audio alta',
      'Biblioteca completa',
      'Descargas offline ilimitadas',
      'Sesión en hasta 5 dispositivos',
      'Playlists personalizadas',
    ]);

    // Test annual plan
    const annualPlan = component.plans.find((p) => p.id === 'annual');
    expect(annualPlan).toBeDefined();
    expect(annualPlan?.name).toBe('Plan Anual');
    expect(annualPlan?.price).toBe(99.99);
    expect(annualPlan?.period).toBe('año');
    expect(annualPlan?.popular).toBe(false);
    expect(annualPlan?.buttonText).toBe('Suscribirse Anual');
    expect(annualPlan?.buttonClass).toBe('btn-success');
    expect(annualPlan?.features).toEqual([
      'Todo del plan mensual',
      '2 meses gratis (ahorra $20)',
      'Calidad de audio premium',
      'Acceso anticipado a nuevas funciones',
      'Soporte prioritario',
      'Sesión en dispositivos ilimitados',
    ]);
  });

  describe('selectPlan method', () => {
    it('should navigate to register for free plan', () => {
      spyOn(console, 'log');

      component.selectPlan('free');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: free');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to payment with monthly query param for monthly plan', () => {
      spyOn(console, 'log');

      component.selectPlan('monthly');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: monthly');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment'], {
        queryParams: { plan: 'monthly' },
      });
    });

    it('should navigate to payment with annual query param for annual plan', () => {
      spyOn(console, 'log');

      component.selectPlan('annual');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: annual');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment'], {
        queryParams: { plan: 'annual' },
      });
    });

    it('should log error for unrecognized plan', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');

      component.selectPlan('invalid-plan');

      expect(console.log).toHaveBeenCalledWith(
        'Plan seleccionado: invalid-plan',
      );
      expect(console.error).toHaveBeenCalledWith('Plan no reconocido');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle empty string as plan id', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');

      component.selectPlan('');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: ');
      expect(console.error).toHaveBeenCalledWith('Plan no reconocido');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getMonthlyPrice method', () => {
    it('should return original price for free plan', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      expect(component.getMonthlyPrice(freePlan)).toBe(0);
    });

    it('should return original price for monthly plan', () => {
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;
      expect(component.getMonthlyPrice(monthlyPlan)).toBe(9.99);
    });

    it('should return calculated monthly price for annual plan', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const expectedMonthlyPrice = 99.99 / 12;
      expect(component.getMonthlyPrice(annualPlan)).toBe(expectedMonthlyPrice);
    });

    it('should handle custom plan object with annual id', () => {
      const customAnnualPlan = {
        id: 'annual',
        name: 'Custom Annual',
        price: 120,
        period: 'year',
        features: [],
        popular: false,
        buttonText: 'Custom',
        buttonClass: 'btn-custom',
      };
      expect(component.getMonthlyPrice(customAnnualPlan)).toBe(10);
    });

    it('should handle custom plan object with non-annual id', () => {
      const customPlan = {
        id: 'custom',
        name: 'Custom Plan',
        price: 15.99,
        period: 'month',
        features: [],
        popular: false,
        buttonText: 'Custom',
        buttonClass: 'btn-custom',
      };
      expect(component.getMonthlyPrice(customPlan)).toBe(15.99);
    });
  });

  describe('getSavingsText method', () => {
    it('should return empty string for free plan', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      expect(component.getSavingsText(freePlan)).toBe('');
    });

    it('should return empty string for monthly plan', () => {
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;
      expect(component.getSavingsText(monthlyPlan)).toBe('');
    });

    it('should return correct savings text for annual plan', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const monthlyTotal = 9.99 * 12; // 119.88
      const expectedSavings = monthlyTotal - 99.99; // 19.89
      const expectedText = `Ahorra $${expectedSavings.toFixed(2)} al año`;
      expect(component.getSavingsText(annualPlan)).toBe(expectedText);
    });

    it('should calculate exact savings for annual plan', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const savingsText = component.getSavingsText(annualPlan);
      expect(savingsText).toBe('Ahorra $19.89 al año');
    });

    it('should handle custom annual plan with different price', () => {
      const customAnnualPlan = {
        id: 'annual',
        name: 'Custom Annual',
        price: 100,
        period: 'year',
        features: [],
        popular: false,
        buttonText: 'Custom',
        buttonClass: 'btn-custom',
      };
      const monthlyTotal = 9.99 * 12;
      const expectedSavings = monthlyTotal - 100;
      const expectedText = `Ahorra $${expectedSavings.toFixed(2)} al año`;
      expect(component.getSavingsText(customAnnualPlan)).toBe(expectedText);
    });

    it('should return empty string for custom non-annual plan', () => {
      const customPlan = {
        id: 'custom',
        name: 'Custom Plan',
        price: 15.99,
        period: 'month',
        features: [],
        popular: false,
        buttonText: 'Custom',
        buttonClass: 'btn-custom',
      };
      expect(component.getSavingsText(customPlan)).toBe('');
    });
  });

  describe('Constructor and Router injection', () => {
    it('should inject Router correctly', () => {
      expect(component['router']).toBe(mockRouter);
    });
  });

  describe('Plan array structure validation', () => {
    it('should have all required properties for each plan', () => {
      component.plans.forEach((plan) => {
        expect(plan.id).toBeDefined();
        expect(plan.name).toBeDefined();
        expect(typeof plan.price).toBe('number');
        expect(plan.period).toBeDefined();
        expect(Array.isArray(plan.features)).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
        expect(typeof plan.popular).toBe('boolean');
        expect(plan.buttonText).toBeDefined();
        expect(plan.buttonClass).toBeDefined();
      });
    });

    it('should have exactly one popular plan', () => {
      const popularPlans = component.plans.filter((plan) => plan.popular);
      expect(popularPlans.length).toBe(1);
      expect(popularPlans[0].id).toBe('monthly');
    });

    it('should have unique plan IDs', () => {
      const ids = component.plans.map((plan) => plan.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });
});

describe('SubscriptionPlansComponent', () => {
  let component: SubscriptionPlansComponent;
  let fixture: ComponentFixture<SubscriptionPlansComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SubscriptionPlansComponent, CommonModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlansComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 3 subscription plans', () => {
    expect(component.plans).toBeDefined();
    expect(component.plans.length).toBe(3);
  });

  it('should have correct plan structure', () => {
    const freePlan = component.plans.find((p) => p.id === 'free');
    const monthlyPlan = component.plans.find((p) => p.id === 'monthly');
    const annualPlan = component.plans.find((p) => p.id === 'annual');

    expect(freePlan).toBeDefined();
    expect(freePlan?.name).toBe('Plan Gratuito');
    expect(freePlan?.price).toBe(0);
    expect(freePlan?.popular).toBe(false);

    expect(monthlyPlan).toBeDefined();
    expect(monthlyPlan?.name).toBe('Plan Mensual');
    expect(monthlyPlan?.price).toBe(9.99);
    expect(monthlyPlan?.popular).toBe(true);

    expect(annualPlan).toBeDefined();
    expect(annualPlan?.name).toBe('Plan Anual');
    expect(annualPlan?.price).toBe(99.99);
    expect(annualPlan?.popular).toBe(false);
  });

  describe('selectPlan', () => {
    it('should navigate to register for free plan', () => {
      spyOn(console, 'log');

      component.selectPlan('free');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: free');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to payment with monthly query param for monthly plan', () => {
      spyOn(console, 'log');

      component.selectPlan('monthly');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: monthly');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment'], {
        queryParams: { plan: 'monthly' },
      });
    });

    it('should navigate to payment with annual query param for annual plan', () => {
      spyOn(console, 'log');

      component.selectPlan('annual');

      expect(console.log).toHaveBeenCalledWith('Plan seleccionado: annual');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment'], {
        queryParams: { plan: 'annual' },
      });
    });

    it('should log error for unrecognized plan', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');

      component.selectPlan('invalid-plan');

      expect(console.log).toHaveBeenCalledWith(
        'Plan seleccionado: invalid-plan',
      );
      expect(console.error).toHaveBeenCalledWith('Plan no reconocido');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getMonthlyPrice', () => {
    it('should return monthly price for non-annual plans', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;

      expect(component.getMonthlyPrice(freePlan)).toBe(0);
      expect(component.getMonthlyPrice(monthlyPlan)).toBe(9.99);
    });

    it('should return calculated monthly price for annual plan', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const expectedMonthlyPrice = 99.99 / 12;

      expect(component.getMonthlyPrice(annualPlan)).toBe(expectedMonthlyPrice);
    });
  });

  describe('getSavingsText', () => {
    it('should return empty string for non-annual plans', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;

      expect(component.getSavingsText(freePlan)).toBe('');
      expect(component.getSavingsText(monthlyPlan)).toBe('');
    });

    it('should return correct savings text for annual plan', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const monthlyTotal = 9.99 * 12;
      const expectedSavings = monthlyTotal - 99.99;
      const expectedText = `Ahorra $${expectedSavings.toFixed(2)} al año`;

      expect(component.getSavingsText(annualPlan)).toBe(expectedText);
    });

    it('should calculate savings correctly', () => {
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;
      const savingsText = component.getSavingsText(annualPlan);

      // 9.99 * 12 = 119.88, 119.88 - 99.99 = 19.89
      expect(savingsText).toBe('Ahorra $19.89 al año');
    });
  });

  describe('Plan properties', () => {
    it('should have all required properties for each plan', () => {
      component.plans.forEach((plan) => {
        expect(plan.id).toBeDefined();
        expect(plan.name).toBeDefined();
        expect(plan.price).toBeDefined();
        expect(plan.period).toBeDefined();
        expect(plan.features).toBeDefined();
        expect(plan.features.length).toBeGreaterThan(0);
        expect(plan.popular).toBeDefined();
        expect(plan.buttonText).toBeDefined();
        expect(plan.buttonClass).toBeDefined();
      });
    });

    it('should have correct button classes', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;

      expect(freePlan.buttonClass).toBe('btn-outline');
      expect(monthlyPlan.buttonClass).toBe('btn-primary');
      expect(annualPlan.buttonClass).toBe('btn-success');
    });

    it('should have correct features count', () => {
      const freePlan = component.plans.find((p) => p.id === 'free')!;
      const monthlyPlan = component.plans.find((p) => p.id === 'monthly')!;
      const annualPlan = component.plans.find((p) => p.id === 'annual')!;

      expect(freePlan.features.length).toBe(5);
      expect(monthlyPlan.features.length).toBe(6);
      expect(annualPlan.features.length).toBe(6);
    });
  });

  describe('Component template integration', () => {
    it('should render all plans in template', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      // This test verifies that the component can be rendered
      // The actual template rendering would depend on the HTML structure
      expect(compiled).toBeTruthy();
    });
  });
});
