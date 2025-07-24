import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MusicsTable } from "./musics-table";

describe("MusicsTable", () => {
  let component: MusicsTable;
  let fixture: ComponentFixture<MusicsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
