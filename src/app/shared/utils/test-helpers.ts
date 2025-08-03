import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock para IAuthRepository
export const mockAuthRepository = {
  login: () => of({}),
  register: () => of({}),
  logout: () => of({}),
  getCurrentUser: () => of(null),
  refreshSession: () => of({}),
  isAuthenticated: () => false,
};

/**
 * Common test setup configuration for Angular components
 */
export interface TestSetupConfig {
  /** Additional imports for the testing module */
  imports?: any[];
  /** Additional providers for the testing module */
  providers?: any[];
  /** Mock route data */
  routeData?: any;
  /** Mock route params */
  routeParams?: any;
}

/**
 * Sets up common testing configuration for Angular components
 */
export function setupTestEnvironment(config: TestSetupConfig = {}) {
  const {
    imports = [],
    providers = [],
    routeData = {},
    routeParams = {},
  } = config;

  const mockActivatedRoute = {
    data: of(routeData),
    params: of(routeParams),
    snapshot: {
      data: routeData,
      params: routeParams,
    },
  };

  return TestBed.configureTestingModule({
    imports: [NoopAnimationsModule, ...imports],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      ...providers,
    ],
  });
}

/**
 * Creates a component fixture with common setup
 */
export async function createComponentFixture<T>(
  component: new (...args: any[]) => T,
  config: TestSetupConfig = {},
): Promise<ComponentFixture<T>> {
  await setupTestEnvironment(config).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

/**
 * Helper to get element by selector
 */
export function getElement(
  fixture: ComponentFixture<any>,
  selector: string,
): HTMLElement | null {
  return fixture.nativeElement.querySelector(selector);
}

/**
 * Helper to get all elements by selector
 */
export function getAllElements(
  fixture: ComponentFixture<any>,
  selector: string,
): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector));
}

/**
 * Helper to get text content from element
 */
export function getTextContent(
  fixture: ComponentFixture<any>,
  selector: string,
): string {
  const element = getElement(fixture, selector);
  return element?.textContent?.trim() || '';
}

/**
 * Helper to trigger click event
 */
export function clickElement(element: HTMLElement): void {
  element.click();
}

/**
 * Helper to set input value and trigger change event
 */
export function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
