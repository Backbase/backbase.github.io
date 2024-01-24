import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTitleComponent } from './category-title.component';

describe('CategoryTitleComponent', () => {
  let component: CategoryTitleComponent;
  let fixture: ComponentFixture<CategoryTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
