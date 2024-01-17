import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMoreButtonComponent } from './read-more-button.component';

describe('ReadMoreButtonComponent', () => {
  let component: ReadMoreButtonComponent;
  let fixture: ComponentFixture<ReadMoreButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadMoreButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadMoreButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
