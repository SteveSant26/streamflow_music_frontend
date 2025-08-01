import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayListItemCard } from "./play-list-item-card";

describe("PlayListItemCard", () => {
  let component: PlayListItemCard;
  let fixture: ComponentFixture<PlayListItemCard>;

  const mockPlaylist = {
    id: 1,
    cover: "test-cover.jpg",
    title: "Test Playlist",
    artists: ["Test Artist 1", "Test Artist 2"],
    color: "#ff0000",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayListItemCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayListItemCard);
    component = fixture.componentInstance;

    // Set required input
    component.playlist = mockPlaylist;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
