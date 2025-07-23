import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlayButton } from './card-play-button';

describe('CardPlayButton', () => {
  let component: CardPlayButton;
  let fixture: ComponentFixture<CardPlayButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPlayButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPlayButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
