import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedPostsComponent } from './related-posts.component';

describe('RelatedPostsComponent', () => {
  let component: RelatedPostsComponent;
  let fixture: ComponentFixture<RelatedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
