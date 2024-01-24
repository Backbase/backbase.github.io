import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTabComponent } from './categories-tab.component';

describe('CategoriesTabComponent', () => {
  let component: CategoriesTabComponent;
  let fixture: ComponentFixture<CategoriesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
