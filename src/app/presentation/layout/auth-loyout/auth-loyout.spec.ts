import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoyout } from './auth-loyout';

describe('AuthLoyout', () => {
  let component: AuthLoyout;
  let fixture: ComponentFixture<AuthLoyout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLoyout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthLoyout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
