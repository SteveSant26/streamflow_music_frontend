import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { PlayListItemCard } from "./play-list-item-card";

describe("PlayListItemCard", () => {
  let component: PlayListItemCard;
  let fixture: ComponentFixture<PlayListItemCard>;

  const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      params: {},
      queryParams: {},
      url: []
    }
  };

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
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
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
