import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringContentComponent } from './engineering-content.component';

describe('EngineeringContentComponent', () => {
  let component: EngineeringContentComponent;
  let fixture: ComponentFixture<EngineeringContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineeringContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineeringContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
