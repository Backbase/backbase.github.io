import { Component } from '@angular/core';
import { DividerComponent } from '../../components/divider/divider.component';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { PostsListComponent } from '../../components/posts-list/posts-list.component';
import { AsyncPipe } from '@angular/common';
import { MeetupsHeaderComponent } from '../../components/meetups-header/meetups-header.component';

@Component({
  selector: 'blog-meetups',
  standalone: true,
  imports: [
    DividerComponent,
    GradientComponent,
    PostsListComponent,
    AsyncPipe,
    MeetupsHeaderComponent,
  ],
  templateUrl: './meetups.component.html',
  styleUrl: './meetups.component.scss',
})
export class MeetupsComponent {
  articles$ = this.postsService.getPosts(
    undefined,
    undefined,
    false,
    this.filterPrinciplesArticles.bind(this)
  );

  constructor(private postsService: PostsService) {}

  private filterPrinciplesArticles(post: Post) {
    return (post.category as string) === 'meetups';
  }
}
