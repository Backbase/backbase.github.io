import { Component, Input } from '@angular/core';
import { Post } from '../../core/model/post.model';
import { PostsService } from '../../core/services/posts.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { DividerComponent } from '../../components/divider/divider.component';

@Component({
  selector: 'blog-related-posts',
  imports: [AsyncPipe, PostItemComponent, DividerComponent],
  templateUrl: './related-posts.component.html',
  styleUrl: './related-posts.component.scss',
})
export class RelatedPostsComponent {
  relatedPosts$!: Observable<Post[]>;

  @Input() set post(post: Post) {
    this.relatedPosts$ = this.postsService
      .getPosts(
        0,
        2,
        false,
        (_post: Post) =>
          post.title !== _post.title &&
          (post.category === _post.category ||
            post.tags.some(tag => _post.tags.includes(tag)))
      )
      .pipe(map(({ posts }) => posts));
  }

  constructor(private postsService: PostsService) {}
}
