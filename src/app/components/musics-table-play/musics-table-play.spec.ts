import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicsTablePlay } from './musics-table-play';

describe('MusicsTablePlay', () => {
  let component: MusicsTablePlay;
  let fixture: ComponentFixture<MusicsTablePlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicsTablePlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicsTablePlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
