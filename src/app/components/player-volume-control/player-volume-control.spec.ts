import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVolumeControl } from './player-volume-control';

describe('PlayerVolumeControl', () => {
  let component: PlayerVolumeControl;
  let fixture: ComponentFixture<PlayerVolumeControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerVolumeControl],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerVolumeControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
