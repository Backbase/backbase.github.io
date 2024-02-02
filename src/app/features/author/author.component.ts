import { Component } from '@angular/core';
import { AuthorsService } from '../../core/services/authors.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Author } from '../../core/model/author.model';
import { PostsListComponent } from '../../components/posts-list/posts-list.component';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { Category } from '../../core/model/categories.model';
import { MatChipsModule } from '@angular/material/chips';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'blog-author',
  standalone: true,
  imports: [
    AsyncPipe,
    PostsListComponent,
    MatChipsModule,
    GradientComponent,
    RouterLink,
    NotFoundComponent,
    AvatarComponent,
    MatButtonModule,
  ],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent {
  author$: Observable<Author | undefined> = this.activatedRoute.paramMap.pipe(
    map(params => params.get('author')),
    withLatestFrom(this.authorsService.getAuthors()),
    map(
      ([param, authors]) =>
        Object.entries(authors).find(
          ([key]) =>
            key.replace(/\W/g, '').toLowerCase() ===
            param?.toLowerCase().replace(/\W/g, '')
        )?.[1]
    )
  );
  posts$: Observable<Post[] | undefined> = this.author$.pipe(
    switchMap(author =>
      this.postsService.getPosts(undefined, undefined, false, (post: Post) =>
        post.authors.includes(author?.fullname ?? '')
      )
    ),
    map(({ posts }) => posts)
  );
  categories$: Observable<Category[] | undefined> = this.posts$.pipe(
    map(posts =>
      posts ? [...new Set(posts.map(({ category }) => category))] : undefined
    )
  );

  Category = Object.fromEntries(Object.entries(Category));

  constructor(
    private activatedRoute: ActivatedRoute,
    private authorsService: AuthorsService,
    private postsService: PostsService
  ) {}
}
