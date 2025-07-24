import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVolumeIconComponent } from './player-volume-icon-component';

describe('PlayerVolumeIconComponent', () => {
  let component: PlayerVolumeIconComponent;
  let fixture: ComponentFixture<PlayerVolumeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerVolumeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerVolumeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
