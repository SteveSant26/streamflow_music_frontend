import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlButtonBar } from './player-control-button-bar';

describe('PlayerControlButtonBar', () => {
  let component: PlayerControlButtonBar;
  let fixture: ComponentFixture<PlayerControlButtonBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerControlButtonBar],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerControlButtonBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
