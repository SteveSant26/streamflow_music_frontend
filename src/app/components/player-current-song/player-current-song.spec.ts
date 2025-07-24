import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerCurrentSong } from "./player-current-song";

describe("PlayerCurrentSong", () => {
  let component: PlayerCurrentSong;
  let fixture: ComponentFixture<PlayerCurrentSong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCurrentSong],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCurrentSong);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
