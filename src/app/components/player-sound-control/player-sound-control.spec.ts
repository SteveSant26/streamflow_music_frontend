import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSoundControl } from './player-sound-control';

describe('PlayerSoundControl', () => {
  let component: PlayerSoundControl;
  let fixture: ComponentFixture<PlayerSoundControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSoundControl],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSoundControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
