import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MusicsTablePlay } from "./musics-table-play";

describe("MusicsTablePlay", () => {
  let component: MusicsTablePlay;
  let fixture: ComponentFixture<MusicsTablePlay>;

  const mockSong = {
    id: 1,
    title: "Test Song",
    artists: ["Test Artist"],
    album: "Test Album",
    albumId: 1,
    duration: "3:45",
    image: "test-image.jpg",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicsTablePlay],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicsTablePlay);
    component = fixture.componentInstance;

    // Set required inputs
    component.song = mockSong;
    component.isCurrentSong = false;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
