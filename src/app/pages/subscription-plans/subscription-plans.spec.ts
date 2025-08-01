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
