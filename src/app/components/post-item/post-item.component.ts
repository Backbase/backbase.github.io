import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../core/model/post.model';
import { Router, RouterModule } from '@angular/router';
import { AuthorComponent } from '../author/author.component';
import { Author } from '../../core/model/author.model';
import { ReadMoreButtonComponent } from '../read-more-button/read-more-button.component';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { Category } from '../../core/model/categories.model';


@Component({
  selector: 'blog-post-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    ReadMoreButtonComponent,
    AuthorComponent,
    MatRippleModule,
    MatChipsModule,
    PostUrlPipe,
  ],
  providers: [PostUrlPipe],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss'
})
export class PostItemComponent {
  @Input() post!: Post;

  Category = Object.fromEntries(Object.entries(Category));

  constructor(private router: Router, private postUrl: PostUrlPipe) {}

  navigate() {
    this.router.navigateByUrl(this.postUrl.transform(this.post));
  }
}
