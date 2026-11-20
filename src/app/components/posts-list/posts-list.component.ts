import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Post } from '../../core/model/post.model';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { AuthorComponent } from '../../components/author/author.component';
import { PostAuthorsPipe } from '../../core/utils/post-authors.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'blog-posts-list',
  imports: [
    PostItemComponent,
    AuthorComponent,
    PostAuthorsPipe,
    MatPaginatorModule,
  ],
  templateUrl: './posts-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  @Input() posts!: Post[] | undefined;
}
