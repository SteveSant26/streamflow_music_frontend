import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SideMenuCard } from "./side-menu-card";

describe("SideMenuCard", () => {
  let component: SideMenuCard;
  let fixture: ComponentFixture<SideMenuCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
