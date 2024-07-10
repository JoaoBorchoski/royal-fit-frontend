import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedFilterComponent } from './saved-filter.component';

describe('SavedFilterComponent', () => {
  let component: SavedFilterComponent;
  let fixture: ComponentFixture<SavedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
