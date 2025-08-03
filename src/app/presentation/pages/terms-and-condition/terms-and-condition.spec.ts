import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndCondition } from './terms-and-condition';

describe('TermsAndCondition', () => {
  let component: TermsAndCondition;
  let fixture: ComponentFixture<TermsAndCondition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAndCondition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndCondition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
