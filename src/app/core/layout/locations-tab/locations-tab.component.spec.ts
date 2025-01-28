import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsTabComponent } from './locations-tab.component';

describe('LocationsTabComponent', () => {
  let component: LocationsTabComponent;
  let fixture: ComponentFixture<LocationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
