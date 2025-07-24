import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayListItemCard } from "./play-list-item-card";

describe("PlayListItemCard", () => {
  let component: PlayListItemCard;
  let fixture: ComponentFixture<PlayListItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayListItemCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayListItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
