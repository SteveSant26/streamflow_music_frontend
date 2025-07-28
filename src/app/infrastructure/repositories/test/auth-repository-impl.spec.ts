import { TestBed } from '@angular/core/testing';

import { AuthRepositoryImpl } from '../auth-repository-impl';

describe('AuthRepositoryImpl', () => {
  let service: AuthRepositoryImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRepositoryImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
