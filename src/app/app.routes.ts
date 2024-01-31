import { Routes } from '@angular/router';
import { postRedirects } from './app.routes.map';

export const routes: Routes = [
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
  },
  {
    path: 'unpublished/:permalink',
    loadComponent: () =>
      import('./features/post/post.component').then(m => m.PostComponent),
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
];
