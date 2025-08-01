import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { AsideMenu } from "./aside-menu";
import { AuthService } from "../../services/auth.service";

describe("AsideMenu", () => {
  let component: AsideMenu;
  let fixture: ComponentFixture<AsideMenu>;

  const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      params: {},
      queryParams: {},
      url: []
    }
  };

  const mockAuthService = {
    isAuthenticated: () => false,
    getCurrentUserValue: () => null,
    logout: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsideMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
