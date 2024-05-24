import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { postRedirects } from './app.routes.map';
import { EMPTY, Subject, catchError, tap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { PostsService } from './core/services/posts.service';
import { MetaDefinition } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
class RouteDetails {
  title$$ = new Subject<string>();
  meta$$ = new Subject<MetaDefinition[]>;
}

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
        resolve: {
          post: postFactory,
          meta: () => inject(RouteDetails).meta$$,
        },
        title: () => inject(RouteDetails).title$$,
      },
      {
        path: 'unpublished/:permalink',
        loadComponent: () =>
          import('./features/post/post.component').then(m => m.PostComponent),
        resolve: {
          post: postFactory,
          meta: () => inject(RouteDetails).meta$$,
        },
        title: () => inject(RouteDetails).title$$,
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
        resolve: {
          post: postFactory,
          meta: () => inject(RouteDetails).meta$$,
        },
        title: () => inject(RouteDetails).title$$,
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

function postFactory(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const router = inject(Router);
  const routeDetails = inject(RouteDetails);
  return inject(PostsService).getPost(state.url)
    .pipe(
      tap(({
        title,
        excerpt,
        displayTeaser,
      }) => {
        const pageTitle = `${title} | ${activatedRouteSnapshot.parent?.title}`;
        routeDetails.title$$.next(pageTitle);
        routeDetails.meta$$.next([
          {
            name: 'description',
            content: excerpt,
          },
          {
            property: 'og:title',
            content: pageTitle,
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
        ])
      }),
      catchError((_: any) => {
        router.navigate(['**'], { skipLocationChange: true });
        return EMPTY;
      })
    );
}
