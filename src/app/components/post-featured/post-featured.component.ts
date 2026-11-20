import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { Post } from '../../core/model/post.model';
import { RouterLink } from '@angular/router';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { ReadMoreButtonComponent } from '../read-more-button/read-more-button.component';
import { MatChipsModule } from '@angular/material/chips';
import { PostImageComponent } from '../post-image/post-image.component';

export enum Reason {
  LATEST = 'Latest',
  FEATURED = 'Featured',
}

@Component({
  selector: 'blog-post-featured',
  imports: [
    MatCardModule,
    ReadMoreButtonComponent,
    PostUrlPipe,
    RouterLink,
    MatChipsModule,
    PostImageComponent,
  ],
  templateUrl: './post-featured.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './post-featured.component.scss',
})
export class PostFeaturedComponent {
  @Input({ required: true }) post!: Post;
}
