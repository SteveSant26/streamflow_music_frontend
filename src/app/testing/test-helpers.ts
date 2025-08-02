// test-helpers.ts - Utilidades comunes para testing

import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Obtiene un elemento del DOM por selector CSS
 */
export function getElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): HTMLElement | null {
  const debugElement = fixture.debugElement.query(By.css(selector));
  return debugElement ? debugElement.nativeElement : null;
}

/**
 * Obtiene múltiples elementos del DOM por selector CSS
 */
export function getElements<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): HTMLElement[] {
  const debugElements = fixture.debugElement.queryAll(By.css(selector));
  return debugElements.map((de) => de.nativeElement);
}

/**
 * Obtiene el texto contenido en un elemento
 */
export function getElementText<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): string {
  const element = getElement(fixture, selector);
  return element ? element.textContent?.trim() || '' : '';
}

/**
 * Simula un click en un elemento
 */
export function clickElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): void {
  const element = getElement(fixture, selector);
  if (element) {
    element.click();
    fixture.detectChanges();
  }
}

/**
 * Simula entrada de texto en un input
 */
export function setInputValue<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  value: string,
): void {
  const input = getElement(fixture, selector) as HTMLInputElement;
  if (input) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}

/**
 * Verifica si un elemento tiene una clase CSS específica
 */
export function hasClass<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  className: string,
): boolean {
  const element = getElement(fixture, selector);
  return element ? element.classList.contains(className) : false;
}

/**
 * Verifica si un elemento está visible
 */
export function isVisible<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): boolean {
  const element = getElement(fixture, selector);
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

/**
 * Espera a que se complete la detección de cambios
 */
export async function waitForAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Mock básico para localStorage
 */
export function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null,
  };
}

/**
 * Crear datos mock para User
 */
export function createMockUser(overrides: Partial<any> = {}): any {
  return {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    profileImage: '',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Crear datos mock para Song
 */
export function createMockSong(overrides: Partial<any> = {}): any {
  return {
    id: '1',
    title: 'Test Song',
    artistId: '1',
    duration: 180,
    fileUrl: 'https://example.com/song.mp3',
    plays: 100,
    likes: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Crear datos mock para Playlist
 */
export function createMockPlaylist(overrides: Partial<any> = {}): any {
  return {
    id: '1',
    name: 'Test Playlist',
    description: 'A test playlist',
    coverImage: 'https://example.com/cover.jpg',
    isPublic: true,
    songsCount: 5,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    ...overrides,
  };
}
