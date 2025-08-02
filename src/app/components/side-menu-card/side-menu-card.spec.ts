import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { SideMenuCard } from "./side-menu-card";

describe("SideMenuCard", () => {
  let component: SideMenuCard;
  let fixture: ComponentFixture<SideMenuCard>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPlaylist = {
    id: 1,
    name: "Test Playlist",
    cover: "test-cover.jpg",
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [SideMenuCard],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuCard);
    component = fixture.componentInstance;

    // Set required input
    component.playlist = mockPlaylist;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
