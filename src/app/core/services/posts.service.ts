import { Inject, Injectable } from '@angular/core';
import { Observable, map, shareReplay, withLatestFrom } from 'rxjs';
import { Post, PostContent, Posts } from '../model/post.model';
import { HttpClient } from '@angular/common/http';
import { extractPostMetaData } from '@blog/utils';
import { AuthorsService } from './authors.service';
import { Category } from '../model/categories.model';
import { ImageSize } from '../model/content.model';
import { AssetsService } from './assets.service';
import { MarkdownService } from 'ngx-markdown';
import { SPECIAL_CATEGORIES } from '../config/configuration-tokens';
import { AuthorsList } from '../model/author.model';
import { Location } from '../model/locations.model';

const POSTS_PER_PAGE = 12;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private cached: Observable<Post[]> = this.httpClient
    .get<Post[]>('posts.json')
    .pipe(
      withLatestFrom(this.authorsService.getAuthors()),
      map(([posts, authors]) =>
        posts.map(post => this.decoratePost(post, authors))
      ),
      shareReplay()
    );

  constructor(
    private httpClient: HttpClient,
    private authorsService: AuthorsService,
    private assetsService: AssetsService,
    private markdownService: MarkdownService,
    @Inject(SPECIAL_CATEGORIES) private specialCategories: Category[]
  ) {}

  getAllPosts(): Observable<Post[]> {
    return this.cached;
  }

  getHighlightedPost(): Observable<Post | undefined> {
    return this.getAllPosts().pipe(
      map(
        posts =>
          posts.find(({ featured }) => featured) ??
          posts.find(
            ({ category }) => !this.specialCategories.includes(category)
          )
      )
    );
  }

  getPosts(
    offset: number = 0,
    size: number = POSTS_PER_PAGE,
    filterFeatured: boolean = true,
    filterFn?: (post: Post) => boolean,
    sortFn?: (a: Post, b: Post) => number
  ): Observable<Posts> {
    return this.getAllPosts().pipe(
      withLatestFrom(this.getHighlightedPost()),
      map(([posts, featured]) => {
        let filteredPosts = posts;
        if (filterFeatured) {
          filteredPosts = filteredPosts.filter(
            ({ title }) => title !== featured?.title
          );
        }
        if (typeof filterFn === 'function') {
          filteredPosts = filteredPosts.filter(filterFn);
        }
        if (typeof sortFn === 'function') {
          filteredPosts = filteredPosts.sort(sortFn);
        }
        const paginatedPosts = filteredPosts.slice(
          offset * size,
          offset * size + size
        );

        return {
          posts: paginatedPosts,
          total: filteredPosts.length,
          perPage: size,
        };
      })
    );
  }

  getPost(permalink: string | null): Observable<PostContent> {
    return this.markdownService.getSource(`${permalink}/post.md`).pipe(
      withLatestFrom(this.authorsService.getAuthors()),
      map(
        ([markdown, authors]) =>
          ({
            ...this.decoratePost(
              extractPostMetaData(markdown) as Post,
              authors
            ),
          }) as PostContent
      )
    );
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
          .sort(([_, a], [__, b]) => b - a)
          .map(entry => entry[0] as Category);
      })
    );
  }

  getLocations(): Observable<Location[]> {
    return this.getAllPosts().pipe(
      map(posts => {
        const locations = posts.reduce(
          (acc: { [location: string]: number }, curr: Post) => {
            if (curr.location) {
              acc[curr.location] = (acc[curr.location] || 0) + 1;
            }
            return acc;
          },
          {}
        );

        const entries = Object.entries(locations);
        return entries
          .sort(([_, countA], [__, countB]) => countB - countA)
          .map(([location]) => location as Location);
      })
    );
  }

  private decoratePost(
    post: Post | PostContent,
    authors: AuthorsList
  ): Post | PostContent {
    return {
      ...post,
      specialCategory: this.specialCategories.includes(post.category),
      date: post.date?.match(/^\d{4}-\d{2}-\d{2}/) ? post.date : undefined,
      displayTeaser: this.generateDisplayAssets(post.teaser),
      authors: post.authors.map(author =>
        typeof author === 'string' ? authors[author] || author : author
      ),
    };
  }

  private generateDisplayAssets(
    url?: string
  ): { [size in ImageSize]: string } | undefined {
    const sizes: ImageSize[] = ['sm', 'md', 'lg'];
    if (url) {
      return sizes.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: this.assetsService.getAssetPath(url, curr),
        }),
        {} as { [size in ImageSize]: string }
      );
    }
    return undefined;
  }
}
