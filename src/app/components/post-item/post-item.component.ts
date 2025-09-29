import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../core/model/post.model';
import { AuthorComponent } from '../author/author.component';
import { ReadMoreButtonComponent } from '../read-more-button/read-more-button.component';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { Category } from '../../core/model/categories.model';
import { RouterLink } from '@angular/router';
import { PostImageComponent } from '../post-image/post-image.component';

@Component({
    selector: 'blog-post-item',
    imports: [
        CommonModule,
        MatCardModule,
        ReadMoreButtonComponent,
        AuthorComponent,
        MatRippleModule,
        MatChipsModule,
        PostUrlPipe,
        RouterLink,
        PostImageComponent,
    ],
    templateUrl: './post-item.component.html',
    styleUrl: './post-item.component.scss'
})
export class PostItemComponent {
  @Input() post!: Post;

  Category = Object.fromEntries(Object.entries(Category));
}
