import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, withLatestFrom } from 'rxjs';
import { Post, Posts } from '../model/post.model';
import { HttpClient } from '@angular/common/http';
import { getPermalink } from '@blog/utils';
import { AuthorsService } from './authors.service';
import { Category } from '../model/categories.model';

const POSTS_PER_PAGE = 8;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private cached: Observable<Post[]> = this.httpClient
    .get<Post[]>('posts.json')
    .pipe(shareReplay());

  constructor(
    private httpClient: HttpClient,
    private authorsService: AuthorsService
  ) {}

  getAllPosts(): Observable<Post[]> {
    return this.cached;
  }

  getHighlightedPost(): Observable<Post | undefined> {
    return this.getAllPosts().pipe(
      map(
        posts =>
          posts.find(({ featured }) => featured) ??
          posts.find(({ date }) => !!date)
      )
    );
  }

  getPosts(
    offset: number = 0,
    size: number = POSTS_PER_PAGE,
    filterFeatured: boolean = true,
    filterFn?: (post: Post) => boolean
  ): Observable<Posts> {
    return this.getAllPosts().pipe(
      withLatestFrom(
        this.getHighlightedPost(),
        this.authorsService.getAuthors()
      ),
      map(([posts, featured, authors]) => {
        let filteredPosts = posts;
        if (filterFeatured) {
          filteredPosts = filteredPosts.filter(
            ({ title }) => title !== featured?.title
          );
        }
        if (typeof filterFn === 'function') {
          filteredPosts = filteredPosts.filter(filterFn);
        }
        const paginatedPosts = filteredPosts.slice(
          offset * size,
          offset * size + size
        );

        return {
          posts: paginatedPosts.map(post => ({
            ...post,
            authors: post.authors.map(author =>
              typeof author === 'string' ? authors[author] || author : author
            ),
          })),
          total: filteredPosts.length,
          perPage: size,
        };
      })
    );
  }

  getPost(permalink: string | null): Observable<Post | undefined> {
    const filterByPermalink = (post: Post) =>
      getPermalink(post.title, post.date, post.category) === permalink;
    return this.getPosts(0, 1, false, (post: Post) =>
      filterByPermalink(post)
    ).pipe(map(({ posts }) => posts[0]));
  }

  getCategories(): Observable<Category[]> {
    return this.getAllPosts().pipe(
      map(posts => {
        const categories = posts.reduce(
          (acc: { [category: string]: number }, curr: Post) => ({
            ...acc,
            [curr.category]: (acc[curr.category] || 0) + 1,
          }),
          {}
        );
        const entries = Object.entries(categories);
        return entries
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0] as Category);
      })
    );
  }
}
