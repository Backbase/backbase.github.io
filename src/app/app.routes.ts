import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { postRedirects } from './app.routes.map';
import { EMPTY, Subject, catchError, map, tap } from 'rxjs';
import { inject } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { PostContent } from './core/model/post.model';
import { PostsService } from './core/services/posts.service';

export const routes: Routes = [
  {
    path: '',
    title: 'Backbase Engineering',
    data: {
      meta: <MetaDefinition[]>[
        {
          name: 'description',
          content: 'Backbase is a global fintech company creating the best digital banking solutions on the planet. We are a young-spirited, diverse (45+ nationalities), fast-growing and leading company in our niche.',
        },
        {
          property: 'og:site_name',
          content: 'Backbase Engineering',
        },
        {
          property: 'og:title',
          content: 'Backbase Engineering',
        },
        {
          property: 'og:url',
          content: 'https://engineering.backbase.com/',
        },
        {
          property: 'og:description',
          content: 'Backbase is a global fintech company creating the best digital banking solutions on the planet. We are a young-spirited, diverse (45+ nationalities), fast-growing and leading company in our niche.',
        },
      ]
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
        ...getRouteData()
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
        ...getRouteData()
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
      },
    ]
  }
];

function getRouteData(): Partial<Route> {
  const postData = new Subject<PostContent>();
  return {
    resolve: {
      post: (_: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) => {
        const router = inject(Router);
        return inject(PostsService).getPost(routerStateSnapshot.url)
          .pipe(
            tap(post => postData.next(post)),
            catchError((_: any) => {
              router.navigate(['**'], { skipLocationChange: true });
              return EMPTY;
            })
          )
      },
      meta: (activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
        postData.pipe((map(({ excerpt, title, displayTeaser }) => [
          {
            name: 'description',
            content: excerpt,
          },
          {
            property: 'og:title',
            content: `${title} | ${activatedRouteSnapshot.parent?.title}`,
          },
          {
            property: 'og:url',
            content: `https://engineering.backbase.com${state.url}`,
          },
          {
            property: 'og:image',
            content: `https://engineering.backbase.com${state.url}/${displayTeaser?.md}`,
          },
          {
            property: 'og:description',
            content: excerpt,
          },
        ])))
    },
    title: (activatedRouteSnapshot: ActivatedRouteSnapshot) =>
      postData.pipe((map(({ title }) => `${title} | ${activatedRouteSnapshot.parent?.title}`)))
  }
}
