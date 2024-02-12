import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinciplesHeaderComponent } from './principles-header.component';

describe('PrinciplesHeaderComponent', () => {
  let component: PrinciplesHeaderComponent;
  let fixture: ComponentFixture<PrinciplesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinciplesHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrinciplesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
