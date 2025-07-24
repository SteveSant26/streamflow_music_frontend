import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SideMenuItem } from "./side-menu-item";

describe("SideMenuItem", () => {
  let component: SideMenuItem;
  let fixture: ComponentFixture<SideMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
