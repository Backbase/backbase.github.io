import { Component } from '@angular/core';
import { PrinciplesHeaderComponent } from '../../components/principles-header/principles-header.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { PostsListComponent } from '../../components/posts-list/posts-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'blog-principles',
  standalone: true,
  imports: [
    PrinciplesHeaderComponent,
    DividerComponent,
    GradientComponent,
    PostsListComponent,
    AsyncPipe,
  ],
  templateUrl: './principles.component.html',
  styleUrl: './principles.component.scss'
})
export class PrinciplesComponent {
  articles$ = this.postsService.getPosts(undefined, undefined, false, this.filterPrinciplesArticles.bind(this));

  constructor(private postsService: PostsService) {}

  private filterPrinciplesArticles(post: Post) {
    return post.category as string === 'principles';
  }
}
