import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditMapComponent } from './view-edit-map.component';

describe('ViewEditMapComponent', () => {
  let component: ViewEditMapComponent;
  let fixture: ComponentFixture<ViewEditMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
