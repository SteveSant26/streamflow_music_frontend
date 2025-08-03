import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SideMenuItem } from './side-menu-item';

describe('SideMenuItem', () => {
  let component: SideMenuItem;
  let fixture: ComponentFixture<SideMenuItem>;

  const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      params: {},
      queryParams: {},
      url: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuItem],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuItem);
    component = fixture.componentInstance;

    // Set required input using signal API
    fixture.componentRef.setInput('href', '/test');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
