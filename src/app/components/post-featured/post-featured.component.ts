import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../core/model/post.model';
import { Router, RouterModule } from '@angular/router';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { ReadMoreButtonComponent } from '../read-more-button/read-more-button.component';

@Component({
  selector: 'blog-post-featured',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    ReadMoreButtonComponent,
    PostUrlPipe,
  ],
  providers: [PostUrlPipe],
  templateUrl: './post-featured.component.html',
  styleUrl: './post-featured.component.scss',
})
export class PostFeaturedComponent {
  @Input({ required: true }) post!: Post;

  constructor(
    private router: Router,
    private postUrlPipe: PostUrlPipe
  ) {}

  navigate() {
    this.router.navigate([this.postUrlPipe.transform(this.post)]);
  }
}
