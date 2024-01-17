import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFeaturedComponent } from './post-featured.component';

describe('PostFeaturedComponent', () => {
  let component: PostFeaturedComponent;
  let fixture: ComponentFixture<PostFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFeaturedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
