import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { postRedirects } from './app.routes.map';
import { EMPTY, Subject, catchError, map, tap } from 'rxjs';
import { inject, makeStateKey, TransferState } from '@angular/core';
import { PostContent } from './core/model/post.model';
import { PostsService } from './core/services/posts.service';
import { defaultMeta, getPostMeta, notFoundMeta } from './app.meta.config';

export const routes: Routes = [
  {
    path: '',
    title: 'Backbase Engineering',
    data: {
      meta: defaultMeta,
    },
    children: [
      ...postRedirects,
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(mod => mod.HomeComponent),
      },
      {
        path: 'people/:author',
        loadComponent: () =>
          import('./features/author/author.component').then(m => m.AuthorComponent),
      },
      {
        path: ':year/:month/:day/:permalink',
        loadComponent: () =>
          import('./features/post/post.component').then(m => m.PostComponent),
        ...getRouteData(),
      },
      {
        path: 'unpublished/:permalink',
        loadComponent: () =>
          import('./features/post/post.component').then(m => m.PostComponent),
        ...getRouteData(),
      },
      {
        path: 'category/:cat',
        loadComponent: () =>
          import('./features/category/category.component').then(
            m => m.CategoryComponent
          ),
      },
      {
        path: 'principles',
        loadComponent: () =>
          import('./features/principles/principles.component').then(
            m => m.PrinciplesComponent
          ),
      },
      {
        path: 'principles/:permalink',
        loadComponent: () =>
          import('./features/post/post.component').then(m => m.PostComponent),
        ...getRouteData(),
      },
      {
        path: 'meetups',
        loadComponent: () =>
          import('./features/meetups/meetups.component').then(
            m => m.MeetupsComponent
          ),
      },
      {
        path: 'meetups/:permalink',
        loadComponent: () =>
          import('./features/post/post.component').then(m => m.PostComponent),
        ...getRouteData(),
      },
      {
        path: 'people',
        loadComponent: () =>
          import('./features/authors/authors.component').then(
            m => m.AuthorsComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            m => m.NotFoundComponent
          ),
        data: { meta: notFoundMeta },
      },
    ]
  }
];

function getRouteData(): Partial<Route> {
  const postData = new Subject<PostContent>();
  return {
    resolve: {
      post: (activatedRoute: ActivatedRouteSnapshot) => {
        const url = activatedRoute.url.map(({ path }) => path).join('/');
        const router = inject(Router);
        const transferState = inject(TransferState);
        const stateKey = makeStateKey<PostContent | undefined>(url);
        if (transferState.hasKey(stateKey)) {
          const post = transferState.get<PostContent | undefined>(stateKey, undefined);
          postData.next(post as PostContent);
          return post;
        }
        return inject(PostsService).getPost(url)
          .pipe(
            tap(post => {
              transferState.set<PostContent>(stateKey, post);
              postData.next(post)}
            ),
            catchError((_: any) => {
              router.navigate(['**'], { skipLocationChange: true });
              return EMPTY;
            })
          )
      },
      meta: (activatedRoute: ActivatedRouteSnapshot) => {
        const url = activatedRoute.url.map(({ path }) => path).join('/');
        const transferState = inject(TransferState);
        const stateKey = makeStateKey<PostContent | undefined>(url);
        if (transferState.hasKey(stateKey)) {
          return getPostMeta(transferState.get<PostContent | undefined>(stateKey, undefined) as PostContent, url);
        }
        return postData.pipe(map((post) => getPostMeta(post, url)));
      }
    },
    title: (activatedRoute: ActivatedRouteSnapshot) => {
      const url = activatedRoute.url.map(({ path }) => path).join('/');
      const transferState = inject(TransferState);
      const stateKey = makeStateKey<PostContent | undefined>(url);
      const getTitle = ({ title }: PostContent) => `${title} | ${activatedRoute.parent?.title}`;
      if (transferState.hasKey(stateKey)) {
        return getTitle(transferState.get<PostContent | undefined>(stateKey, undefined) as PostContent);
      }
      return postData.pipe(map((post) => getTitle(post)));
    }
  }
}
