import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeatmapComponent } from './add-heatmap.component';

describe('AddHeatmapComponent', () => {
  let component: AddHeatmapComponent;
  let fixture: ComponentFixture<AddHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
