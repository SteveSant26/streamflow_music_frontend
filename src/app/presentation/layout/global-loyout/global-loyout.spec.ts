import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalLoyout } from './global-loyout';

describe('GlobalLoyout', () => {
  let component: GlobalLoyout;
  let fixture: ComponentFixture<GlobalLoyout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalLoyout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalLoyout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
