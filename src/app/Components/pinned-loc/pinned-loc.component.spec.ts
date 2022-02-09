import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedLocComponent } from './pinned-loc.component';

describe('PinnedLocComponent', () => {
  let component: PinnedLocComponent;
  let fixture: ComponentFixture<PinnedLocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinnedLocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnedLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
