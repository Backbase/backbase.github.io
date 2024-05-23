import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PostContent } from '../model/post.model';
import { MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class RouteDetailsService {

  private title$$ = new Subject<string>();
  private meta$$ = new Subject<MetaDefinition[]>;

  title$ = this.title$$.asObservable();
  meta$ = this.meta$$.asObservable();

  update(post: PostContent) {
    const title = `${post.title} | test`;
    this.title$$.next(title);
    this.meta$$.next([
      {
        name: 'description',
        content: post.excerpt
      },
      {
        name: 'og:description',
        content: post.excerpt
      },
      {
        name: 'og:title',
        content: title
      }
    ])
  }
}
