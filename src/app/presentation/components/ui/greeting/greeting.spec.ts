import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { Greeting } from './greeting';
import { getElementText } from '../../testing/test-helpers';

describe('Greeting', () => {
  let component: Greeting;
  let fixture: ComponentFixture<Greeting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Greeting],
    })
      // Override change detection strategy for testing
      .overrideComponent(Greeting, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Greeting);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Greeting Messages', () => {
    beforeEach(() => {
      // Mock Date to control time-based tests
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should display good morning message before 12 PM', () => {
      // Set time to 10 AM
      const mockDate = new Date(2023, 0, 1, 10, 0, 0);
      jasmine.clock().mockDate(mockDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.greeting).toBe('Buenos días');

      // Verify it's displayed in the template
      const greetingText = getElementText(
        fixture,
        'h1, .greeting-text, [data-testid="greeting"]',
      );
      expect(greetingText).toContain('Buenos días');
    });

    it('should display good afternoon message between 12 PM and 6 PM', () => {
      // Set time to 3 PM
      const mockDate = new Date(2023, 0, 1, 15, 0, 0);
      jasmine.clock().mockDate(mockDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.greeting).toBe('Buenas tardes');

      const greetingText = getElementText(
        fixture,
        'h1, .greeting-text, [data-testid="greeting"]',
      );
      expect(greetingText).toContain('Buenas tardes');
    });

    it('should display good evening message after 6 PM', () => {
      // Set time to 8 PM
      const mockDate = new Date(2023, 0, 1, 20, 0, 0);
      jasmine.clock().mockDate(mockDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.greeting).toBe('Buenas noches');

      const greetingText = getElementText(
        fixture,
        'h1, .greeting-text, [data-testid="greeting"]',
      );
      expect(greetingText).toContain('Buenas noches');
    });

    it('should handle edge case at exactly 12 PM', () => {
      // Set time to exactly 12 PM
      const mockDate = new Date(2023, 0, 1, 12, 0, 0);
      jasmine.clock().mockDate(mockDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.greeting).toBe('Buenas tardes);
    });

    it('should handle edge case at exactly 6 PM', () => {
      // Set time to exactly 6 PM
      const mockDate = new Date(2023, 0, 1, 18, 0, 0);
      jasmine.clock().mockDate(mockDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.greeting).toBe('Buenas noches);
    });
  });

  describe('Component Lifecycle', () => {
    it('should set greeting on ngOnInit', () => {
      spyOn(component as any, 'setGreeting');

      component.ngOnInit();

      expect((component as any).setGreeting).toHaveBeenCalled();
    });

    it('should have empty greeting initially', () => {
      // Before ngOnInit is called
      expect(component.greeting).toBe('');
    });

    it('should have a greeting after ngOnInit', () => {
      component.ngOnInit();

      expect(component.greeting).not.toBe('');
      expect(component.greeting).toContain();
    });
  });
});
